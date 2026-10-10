"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleGuard } from "@/components/auth/role-guard";

const step1Schema = z.object({
  wasteType: z.string().min(1, "Waste type is required"),
  estimatedWeight: z.string().min(1, "Estimated weight is required"),
});

const step2Schema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  zoneId: z.string().min(1, "Zone is required"),
});

const step3Schema = z.object({
  preferredDate: z.string().min(1, "Preferred date is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & z.infer<typeof step3Schema>;

export default function NewPickupRequestPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const router = useRouter();

  const form1 = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: { wasteType: "", estimatedWeight: "" }
  });

  const form2 = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: { address: "", zoneId: "" }
  });

  const form3 = useForm<z.infer<typeof step3Schema>>({
    resolver: zodResolver(step3Schema),
    defaultValues: { preferredDate: "", notes: "" }
  });

  const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data: z.infer<typeof step2Schema>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const onFinalSubmit = async (data: z.infer<typeof step3Schema>) => {
    const finalData = { ...formData, ...data };
    
    try {
      setIsLoading(true);
      // Simulate API Call for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Submitting Request:", finalData);
      
      toast.success("Pickup request created successfully!");
      router.push("/dashboard/requests");
    } catch (error) {
      toast.error("Failed to create request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["CITIZEN", "ADMIN"]}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Pickup</h1>
          <p className="text-muted-foreground">Create a new waste pickup request using our wizard.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step === s ? "bg-primary text-primary-foreground" :
                step > s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <CheckCircle className="h-4 w-4" /> : s}
              </div>
              <div className="text-xs mt-2 text-muted-foreground font-medium">
                {s === 1 ? "Details" : s === 2 ? "Location" : "Schedule"}
              </div>
            </div>
          ))}
        </div>

        <Card>
          {step === 1 && (
            <form onSubmit={form1.handleSubmit(onStep1Submit)}>
              <CardHeader>
                <CardTitle>Waste Details</CardTitle>
                <CardDescription>What kind of waste do you need collected?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type (e.g., Recyclable, Organic, E-Waste)</Label>
                  <Input id="wasteType" {...form1.register("wasteType")} placeholder="Enter waste type..." />
                  {form1.formState.errors.wasteType && (
                    <p className="text-sm text-destructive">{form1.formState.errors.wasteType.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedWeight">Estimated Weight (kg)</Label>
                  <Input id="estimatedWeight" type="number" {...form1.register("estimatedWeight")} placeholder="Approximate weight..." />
                  {form1.formState.errors.estimatedWeight && (
                    <p className="text-sm text-destructive">{form1.formState.errors.estimatedWeight.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={form2.handleSubmit(onStep2Submit)}>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>Where should we pick this up?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" {...form2.register("address")} placeholder="Enter your full address..." />
                  {form2.formState.errors.address && (
                    <p className="text-sm text-destructive">{form2.formState.errors.address.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneId">Zone (City Area)</Label>
                  <Input id="zoneId" {...form2.register("zoneId")} placeholder="e.g. Zone A, Downtown..." />
                  {form2.formState.errors.zoneId && (
                    <p className="text-sm text-destructive">{form2.formState.errors.zoneId.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" type="button" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={form3.handleSubmit(onFinalSubmit)}>
              <CardHeader>
                <CardTitle>Schedule & Confirm</CardTitle>
                <CardDescription>When should we come by?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date</Label>
                  <Input id="preferredDate" type="date" {...form3.register("preferredDate")} />
                  {form3.formState.errors.preferredDate && (
                    <p className="text-sm text-destructive">{form3.formState.errors.preferredDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Input id="notes" {...form3.register("notes")} placeholder="Any special instructions..." />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg mt-6">
                  <h4 className="font-semibold mb-2 text-sm">Review Information:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>Type:</strong> {formData.wasteType}</li>
                    <li><strong>Weight:</strong> {formData.estimatedWeight} kg</li>
                    <li><strong>Address:</strong> {formData.address} ({formData.zoneId})</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" type="button" onClick={() => setStep(2)} disabled={isLoading}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Request
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </RoleGuard>
  );
}
