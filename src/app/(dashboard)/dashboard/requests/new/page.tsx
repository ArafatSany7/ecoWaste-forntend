"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, MapPin } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { wasteRequestApi } from "@/api/waste-request.api";
import { wasteCategoryApi } from "@/api/waste-category.api";
import { zoneApi } from "@/api/zone.api";
import { formatLatLng, type LatLng } from "@/components/map/map-config";

// MapLibre needs the browser (WebGL, window) — load it client-side only.
const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full rounded-xl sm:h-80" />,
});

interface Option {
  id: string;
  name: string;
  city?: string;
  type?: string;
}

const STEPS = ["Details", "Location", "Review"] as const;

type Errors = Partial<Record<"categoryId" | "weight" | "location" | "address" | "zoneId", string>>;

export default function NewPickupRequestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});

  const [categoryId, setCategoryId] = useState("");
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState<LatLng | null>(null);
  const [address, setAddress] = useState("");
  const [zoneId, setZoneId] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["waste-categories"],
    queryFn: () => wasteCategoryApi.getAll(),
    select: (res) => ((res as unknown as { data?: Option[] }).data ?? []) as Option[],
  });
  const zonesQuery = useQuery({
    queryKey: ["zones", "all"],
    queryFn: () => zoneApi.getAll({ limit: 100 }),
    select: (res) => ((res as unknown as { data?: Option[] }).data ?? []) as Option[],
  });

  const categories = categoriesQuery.data ?? [];
  const zones = zonesQuery.data ?? [];
  const category = categories.find((c) => c.id === categoryId);
  const zone = zones.find((z) => z.id === zoneId);

  const createMutation = useMutation({
    mutationFn: wasteRequestApi.create,
    onSuccess: () => {
      toast.success("Pickup request submitted. We'll notify you once it's approved.");
      queryClient.invalidateQueries({ queryKey: ["waste-requests"] });
      router.push("/dashboard/requests");
    },
    onError: (error: { message?: string }) => {
      toast.error(error?.message || "Couldn't submit the request. Please try again.");
    },
  });

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (!categoryId) e.categoryId = "Choose what kind of waste this is.";
      if (weight && (Number.isNaN(Number(weight)) || Number(weight) <= 0)) e.weight = "Enter a weight above 0, or leave it empty.";
    }
    if (s === 1) {
      if (!location) e.location = "Place the pin where the waste should be collected.";
      if (address.trim().length < 5) e.address = "Enter the full address (at least 5 characters).";
      if (!zoneId) e.zoneId = "Choose your service zone.";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => s + 1);
  };

  const submit = () => {
    if (!location) return;
    createMutation.mutate({
      categoryId,
      zoneId,
      address: address.trim(),
      weight: weight ? Number(weight) : undefined,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  return (
    <RoleGuard allowedRoles={["CITIZEN"]}>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader title="Schedule Pickup" description="Tell us what to collect and pin exactly where to find it." />

        {/* Stepper */}
        <ol className="mb-8 flex items-center justify-between">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 flex-col items-center" aria-current={step === i ? "step" : undefined}>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step === i ? "bg-primary text-primary-foreground" : step > i ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > i ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <div className="mt-2 text-xs font-medium text-muted-foreground">{label}</div>
            </li>
          ))}
        </ol>

        <Card>
          {step === 0 && (
            <>
              <CardHeader>
                <CardTitle>Waste details</CardTitle>
                <CardDescription>What kind of waste do you need collected?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="category">Waste category</Label>
                  {categoriesQuery.isLoading ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <Select
                      value={categoryId || null}
                      onValueChange={(v) => setCategoryId(v ? String(v) : "")}
                      items={categories.map((c) => ({ value: c.id, label: c.name }))}
                    >
                      <SelectTrigger id="category" className="w-full" aria-invalid={!!errors.categoryId}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {categoriesQuery.isError && <p className="text-sm text-destructive">Couldn&apos;t load categories. Refresh to try again.</p>}
                  {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Estimated weight in kg (optional)</Label>
                  <Input
                    id="weight"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 5"
                    aria-invalid={!!errors.weight}
                  />
                  {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" onClick={next}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Pickup location</CardTitle>
                <CardDescription>Pin the exact spot — the collector navigates here and you can track them live.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <LocationPicker
                    value={location}
                    onChange={(p) => {
                      setLocation(p);
                      setErrors((e) => ({ ...e, location: undefined }));
                    }}
                  />
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, road, area — e.g. House 14, Road 11, Banani"
                    autoComplete="street-address"
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Service zone</Label>
                  {zonesQuery.isLoading ? (
                    <Skeleton className="h-9 w-full" />
                  ) : (
                    <Select
                      value={zoneId || null}
                      onValueChange={(v) => setZoneId(v ? String(v) : "")}
                      items={zones.map((z) => ({ value: z.id, label: z.city ? `${z.name}, ${z.city}` : z.name }))}
                    >
                      <SelectTrigger id="zone" className="w-full" aria-invalid={!!errors.zoneId}>
                        <SelectValue placeholder="Select your zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((z) => (
                          <SelectItem key={z.id} value={z.id}>
                            {z.city ? `${z.name}, ${z.city}` : z.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {zonesQuery.isError && <p className="text-sm text-destructive">Couldn&apos;t load zones. Refresh to try again.</p>}
                  {errors.zoneId && <p className="text-sm text-destructive">{errors.zoneId}</p>}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" type="button" onClick={() => setStep(0)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" onClick={next}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Review &amp; submit</CardTitle>
                <CardDescription>An admin will approve it and schedule a collector.</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="divide-y rounded-lg border text-sm">
                  {[
                    ["Category", category?.name ?? "—"],
                    ["Estimated weight", weight ? `${weight} kg` : "Not specified"],
                    ["Address", address],
                    ["Zone", zone ? (zone.city ? `${zone.name}, ${zone.city}` : zone.name) : "—"],
                    ["Map pin", location ? formatLatLng(location) : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-4 px-4 py-3">
                      <dt className="w-36 shrink-0 text-muted-foreground">{k}</dt>
                      <dd className="min-w-0 font-medium">
                        {k === "Map pin" && <MapPin className="mr-1 inline h-3.5 w-3.5 text-primary" />}
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" type="button" onClick={() => setStep(1)} disabled={createMutation.isPending}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" onClick={submit} disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit request
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </RoleGuard>
  );
}
