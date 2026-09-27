"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wasteRequestApi } from "@/api/waste-request.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const createRequestSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  wasteType: z.enum(["PLASTIC", "ORGANIC", "E_WASTE", "PAPER", "METAL", "OTHER"], {
    required_error: "Please select a waste type",
  }),
  estimatedWeight: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contactNumber: z.string().min(10, "Valid contact number required"),
});

type CreateRequestFormValues = z.infer<typeof createRequestSchema>;

interface CreateRequestFormProps {
  onSuccess?: () => void;
}

export function CreateRequestForm({ onSuccess }: CreateRequestFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateRequestFormValues>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      address: "", 
      contactNumber: "",
    }
  });

  const createMutation = useMutation({
    mutationFn: wasteRequestApi.create,
    onSuccess: () => {
      toast.success("Waste request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["waste-requests"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to submit request");
    },
  });

  const onSubmit = (data: CreateRequestFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Request Title</Label>
        <Input 
          id="title" 
          placeholder="e.g., 2 Bags of Plastic Bottles" 
          {...register("title")} 
          disabled={createMutation.isPending}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="wasteType">Waste Type</Label>
        <Select 
          disabled={createMutation.isPending} 
          onValueChange={(value) => setValue("wasteType", value as "PLASTIC" | "ORGANIC" | "E_WASTE" | "PAPER" | "METAL" | "OTHER")}
          defaultValue={watch("wasteType")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select waste category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PLASTIC">Plastic</SelectItem>
            <SelectItem value="ORGANIC">Organic</SelectItem>
            <SelectItem value="E_WASTE">E-Waste</SelectItem>
            <SelectItem value="PAPER">Paper</SelectItem>
            <SelectItem value="METAL">Metal</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.wasteType && <p className="text-sm text-destructive">{errors.wasteType.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Briefly describe the items for pickup..." 
          {...register("description")} 
          disabled={createMutation.isPending}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimatedWeight">Estimated Weight (kg)</Label>
          <Input 
            id="estimatedWeight" 
            type="number"
            placeholder="e.g., 5" 
            {...register("estimatedWeight")} 
            disabled={createMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input 
            id="contactNumber" 
            placeholder="Phone number" 
            {...register("contactNumber")} 
            disabled={createMutation.isPending}
          />
          {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Pickup Address</Label>
        <Input 
          id="address" 
          placeholder="Detailed pickup address" 
          {...register("address")} 
          disabled={createMutation.isPending}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={createMutation.isPending}>
        {createMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}
