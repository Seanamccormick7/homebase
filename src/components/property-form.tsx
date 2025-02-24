"use client";

import { usePropertyContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import PropertyFormBtn from "./property-form-btn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PROPERTY_IMAGE } from "@/lib/constants";
import { TPropertyForm, propertyFormSchema } from "@/lib/validations";

type PropertyFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PropertyForm({
  actionType,
  onFormSubmission,
}: PropertyFormProps) {
  const { handleAddProperty, handleEditProperty, selectedProperty } =
    usePropertyContext();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<TPropertyForm>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues:
      actionType === "edit"
        ? {
            name: selectedProperty?.name,
            location: selectedProperty?.location,
            imageUrl: selectedProperty?.imageUrl,
            price: selectedProperty?.price,
            notes: selectedProperty?.notes,
          }
        : undefined,
  });

  return (
    <form
      action={async () => {
        //trigger is used by useForm to check validation for all fields
        const result = await trigger();
        if (!result) return;

        //
        onFormSubmission();

        const propertyData = getValues();
        propertyData.imageUrl = propertyData.imageUrl || DEFAULT_PROPERTY_IMAGE;

        if (actionType === "add") {
          await handleAddProperty(propertyData);
        } else if (actionType === "edit") {
          await handleEditProperty(selectedProperty!.id, propertyData);
        }
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="price">Price</Label>
          <Input id="price" {...register("price")} />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PropertyFormBtn actionType={actionType} />
    </form>
  );
}
