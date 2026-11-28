"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Radio,
  Scale,
  Truck,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { collectorApi, type CollectorJob, type JobStatus } from "@/api/collector.api";
import { useTripLocation, type SharingState } from "@/hooks/use-trip-location";

const TripMap = dynamic(() => import("@/components/map/TripMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full rounded-xl" />,
});

const ACTIVE: JobStatus[] = ["EN_ROUTE", "COLLECTOR_ARRIVED", "IN_PROGRESS"];
const SHARING: JobStatus[] = ["EN_ROUTE", "COLLECTOR_ARRIVED"];
const DONE: JobStatus[] = ["COMPLETED", "COLLECTED"];

const STATUS_LABEL: Partial<Record<JobStatus, string>> = {
  ASSIGNED: "Awaiting schedule",
  SCHEDULED: "Scheduled",
  EN_ROUTE: "On the way",
  COLLECTOR_ARRIVED: "Arrived",
  IN_PROGRESS: "Collecting",
  COMPLETED: "Completed",
  COLLECTED: "Collected",
  CANCELLED: "Cancelled",
};

const TRIP_STEPS: { status: JobStatus; label: string }[] = [
  { status: "EN_ROUTE", label: "On the way" },
  { status: "COLLECTOR_ARRIVED", label: "Arrived" },
  { status: "IN_PROGRESS", label: "Collecting" },
];

const errorMessage = (e: unknown, fallback: string) => (e as { message?: string })?.message || fallback;

function hasPin(job: CollectorJob) {
  return job.latitude != null && job.longitude != null;
}

function navigateUrl(job: CollectorJob) {
  const destination = hasPin(job) ? `${job.latitude},${job.longitude}` : encodeURIComponent(job.address);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
}

function scheduleText(job: CollectorJob) {
  const s = job.collectionSchedule;
  if (!s) return "Not scheduled yet";
  return `${format(new Date(s.scheduledDate), "EEE d MMM")} · ${s.timeWindow}`;
}

function residentName(job: CollectorJob) {
  const c = job.citizen;
  return c ? `${c.firstName} ${c.lastName}`.trim() : "Resident";
}

export default function PickupsPage() {
  const queryClient = useQueryClient();
  const [completing, setCompleting] = useState<CollectorJob | null>(null);

  const jobsQuery = useQuery({
    queryKey: ["collector-jobs"],
    queryFn: () => collectorApi.getMyJobs({ limit: 50 }),
    refetchInterval: 30000,
  });

  const jobs = jobsQuery.data?.data ?? [];
  const activeJob = jobs.find((j) => ACTIVE.includes(j.status)) ?? null;
  const upcoming = jobs
    .filter((j) => j.status === "SCHEDULED" || j.status === "ASSIGNED")
    .sort((a, b) => {
      const ad = a.collectionSchedule?.scheduledDate ?? "9999";
      const bd = b.collectionSchedule?.scheduledDate ?? "9999";
      return ad.localeCompare(bd);
    });
  const done = jobs.filter((j) => DONE.includes(j.status)).slice(0, 6);

  const { sharing, position } = useTripLocation(activeJob != null && SHARING.includes(activeJob.status));

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["collector-jobs"] });

  const depart = useMutation({
    mutationFn: (id: string) => collectorApi.departForPickup(id),
    onSuccess: () => {
      toast.success("Trip started. Your location is now shared with the resident.");
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e, "Couldn't start the trip.")),
  });

  const arrive = useMutation({
    mutationFn: (id: string) => collectorApi.arriveAtLocation(id),
    onSuccess: () => {
      toast.success("Marked as arrived. The resident has been updated.");
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e, "Couldn't mark as arrived.")),
  });

  const start = useMutation({
    mutationFn: (id: string) => collectorApi.startCollection(id),
    onSuccess: () => {
      toast.success("Collection started.");
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e, "Couldn't start the collection.")),
  });

  const busy = depart.isPending || arrive.isPending || start.isPending;

  return (
    <RoleGuard allowedRoles={["COLLECTOR"]}>
      <div className="space-y-8">
        <PageHeader title="My Pickups" description="Start a trip to share your live location, then update each step at the pickup." />

        {jobsQuery.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-72 w-full rounded-xl" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          </div>
        ) : jobsQuery.isError ? (
          <div className="rounded-xl border bg-destructive/10 py-12 text-center text-destructive">
            <p>Couldn&apos;t load your pickups. Check your connection and try again.</p>
            <Button variant="outline" className="mt-4" onClick={() => jobsQuery.refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            {activeJob && (
              <ActiveTrip
                job={activeJob}
                sharing={sharing}
                position={position}
                busy={busy}
                onArrive={() => arrive.mutate(activeJob.id)}
                onStart={() => start.mutate(activeJob.id)}
                onComplete={() => setCompleting(activeJob)}
              />
            )}

            <section aria-labelledby="upcoming-heading" className="space-y-4">
              <h2 id="upcoming-heading" className="text-lg font-semibold">
                Upcoming
              </h2>
              {upcoming.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-card py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">No upcoming pickups</p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">New jobs appear here once an admin assigns and schedules them.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {upcoming.map((job) => (
                    <JobCard key={job.id} job={job}>
                      {job.status === "SCHEDULED" ? (
                        <Button
                          className="min-h-11 w-full"
                          disabled={busy || activeJob != null}
                          onClick={() => depart.mutate(job.id)}
                        >
                          {depart.isPending && depart.variables === job.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Truck className="mr-2 h-4 w-4" />
                          )}
                          Start trip
                        </Button>
                      ) : (
                        <p className="rounded-md bg-muted/60 py-2.5 text-center text-sm text-muted-foreground">Waiting for the admin to schedule</p>
                      )}
                      {job.status === "SCHEDULED" && activeJob && (
                        <p className="mt-2 text-center text-xs text-muted-foreground">Finish your current trip first</p>
                      )}
                    </JobCard>
                  ))}
                </div>
              )}
            </section>

            {done.length > 0 && (
              <section aria-labelledby="done-heading" className="space-y-4">
                <h2 id="done-heading" className="text-lg font-semibold">
                  Recently completed
                </h2>
                <ul className="divide-y rounded-xl border bg-card">
                  {done.map((job) => (
                    <li key={job.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{job.address}</p>
                        <p className="text-muted-foreground">
                          {job.category?.name ?? "Waste"} · {job.weight != null ? `${job.weight} kg` : "—"}
                        </p>
                      </div>
                      <Badge variant="secondary">{STATUS_LABEL[job.status] ?? job.status}</Badge>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        <CompleteDialog
          job={completing}
          onClose={() => setCompleting(null)}
          onDone={() => {
            setCompleting(null);
            refresh();
          }}
        />
      </div>
    </RoleGuard>
  );
}

function JobCard({ job, children }: { job: CollectorJob; children: React.ReactNode }) {
  return (
    <article className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <Badge variant={job.status === "SCHEDULED" ? "default" : "outline"}>{STATUS_LABEL[job.status] ?? job.status}</Badge>
        <Badge variant="secondary">{job.category?.name ?? "Waste"}</Badge>
      </div>
      <div className="flex-1 space-y-2 text-sm">
        <p className="flex items-start gap-2 font-medium">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{job.address}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarClock className="h-4 w-4 shrink-0" />
          {scheduleText(job)}
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Scale className="h-4 w-4 shrink-0" />
          {job.weight != null ? `About ${job.weight} kg` : "Weight not given"}
        </p>
        {!hasPin(job) && (
          <p className="flex items-center gap-2 text-amber-700">
            <CircleAlert className="h-4 w-4 shrink-0" />
            No map pin — navigate by address
          </p>
        )}
      </div>
      <div className="mt-4 border-t pt-4">{children}</div>
    </article>
  );
}

function ActiveTrip({
  job,
  sharing,
  position,
  busy,
  onArrive,
  onStart,
  onComplete,
}: {
  job: CollectorJob;
  sharing: SharingState;
  position: { latitude: number; longitude: number; heading: number | null } | null;
  busy: boolean;
  onArrive: () => void;
  onStart: () => void;
  onComplete: () => void;
}) {
  const stepIndex = TRIP_STEPS.findIndex((s) => s.status === job.status);
  const destination = hasPin(job) ? { latitude: job.latitude as number, longitude: job.longitude as number } : null;

  return (
    <section aria-labelledby="trip-heading" className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-col gap-1 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="trip-heading" className="text-lg font-semibold">
          Current trip
        </h2>
        <SharingIndicator sharing={sharing} />
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
        <div className="p-4 lg:pr-2">
          <TripMap destination={destination} vehicle={position} vehicleLabel="You" className="h-72 sm:h-96" />
        </div>

        <div className="flex flex-col gap-5 p-5">
          <ol className="flex items-center gap-2" aria-label="Trip progress">
            {TRIP_STEPS.map((s, i) => (
              <li key={s.status} className="flex flex-1 flex-col gap-1.5" aria-current={i === stepIndex ? "step" : undefined}>
                <span className={`h-1.5 rounded-full ${i <= stepIndex ? "bg-primary" : "bg-muted"}`} />
                <span className={`text-xs font-medium ${i === stepIndex ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              </li>
            ))}
          </ol>

          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2 text-base font-medium">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {job.address}
            </p>
            <p className="text-muted-foreground">
              {job.category?.name ?? "Waste"} · {job.weight != null ? `about ${job.weight} kg` : "weight not given"}
            </p>
            <p className="text-muted-foreground">
              {residentName(job)}
              {job.citizen?.phone ? ` · ${job.citizen.phone}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={navigateUrl(job)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", className: "min-h-11" })}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Navigate
            </a>
            {job.citizen?.phone ? (
              <a href={`tel:${job.citizen.phone}`} className={buttonVariants({ variant: "outline", className: "min-h-11" })}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </a>
            ) : (
              <span />
            )}
          </div>

          <div className="mt-auto">
            {job.status === "EN_ROUTE" && (
              <Button className="min-h-12 w-full text-base" onClick={onArrive} disabled={busy}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                I&apos;ve arrived
              </Button>
            )}
            {job.status === "COLLECTOR_ARRIVED" && (
              <Button className="min-h-12 w-full text-base" onClick={onStart} disabled={busy}>
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Truck className="mr-2 h-4 w-4" />}
                Start collection
              </Button>
            )}
            {job.status === "IN_PROGRESS" && (
              <Button className="min-h-12 w-full text-base" onClick={onComplete} disabled={busy}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete pickup
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SharingIndicator({ sharing }: { sharing: SharingState }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (sharing.kind === "off") {
    return <p className="text-sm text-muted-foreground">Location sharing is off while collecting</p>;
  }
  if (sharing.kind === "error") {
    return (
      <p role="alert" className="flex items-start gap-2 text-sm text-destructive">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
        {sharing.message}
      </p>
    );
  }
  if (sharing.kind === "waiting") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
        <Loader2 className="h-4 w-4 animate-spin" />
        Waiting for GPS… keep this screen open
      </p>
    );
  }
  if (sharing.kind === "retrying") {
    return (
      <p className="flex items-center gap-2 text-sm text-amber-700" aria-live="polite">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connection lost — retrying
      </p>
    );
  }
  const seconds = Math.max(0, Math.round((now - sharing.lastSentAt) / 1000));
  return (
    <p className="flex items-center gap-2 text-sm font-medium text-primary" aria-live="polite">
      <Radio className="h-4 w-4 motion-safe:animate-pulse" />
      Sharing live location · {seconds < 2 ? "just now" : `${seconds}s ago`}
      {sharing.accuracy != null && <span className="font-normal text-muted-foreground">± {Math.round(sharing.accuracy)} m</span>}
    </p>
  );
}

function CompleteDialog({ job, onClose, onDone }: { job: CollectorJob | null; onClose: () => void; onDone: () => void }) {
  return (
    <Dialog open={job != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {job && <CompleteForm key={job.id} job={job} onCancel={onClose} onDone={onDone} />}
      </DialogContent>
    </Dialog>
  );
}

function CompleteForm({ job, onCancel, onDone }: { job: CollectorJob; onCancel: () => void; onDone: () => void }) {
  const [weight, setWeight] = useState(job.weight != null ? String(job.weight) : "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const complete = useMutation({
    mutationFn: () => collectorApi.completeCollection(job.id, { actualWeight: Number(weight), notes: notes.trim() || undefined }),
    onSuccess: () => {
      toast.success("Pickup completed. The resident's invoice has been created.");
      onDone();
    },
    onError: (e) => toast.error(errorMessage(e, "Couldn't complete the pickup.")),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(weight);
    if (!weight || Number.isNaN(value) || value <= 0) {
      setError("Enter the weight you collected, in kg.");
      return;
    }
    setError(null);
    complete.mutate();
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <DialogHeader>
        <DialogTitle>Complete pickup</DialogTitle>
        <DialogDescription>Weigh what you collected. The resident&apos;s invoice is based on this weight.</DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <Label htmlFor="actual-weight">Actual weight (kg)</Label>
        <Input
          id="actual-weight"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          aria-invalid={!!error}
          autoFocus
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="complete-notes">Notes (optional)</Label>
        <Textarea id="complete-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything the office should know" />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={complete.isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={complete.isPending}>
          {complete.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete pickup
        </Button>
      </DialogFooter>
    </form>
  );
}
