import { z } from "zod";
import { DEFAULT_PROPERTY_IMAGE } from "./constants";

export const propertyIdSchema = z.string().cuid();

export const propertyFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(100),
    location: z
      .string()
      .trim()
      .min(1, { message: "Location is required" })
      .max(100),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "Image url must be a valid url" }),
    ]),
    price: z.coerce.number().int().positive().max(9999999999999999),
    notes: z.union([z.literal(""), z.string().trim().max(1000)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PROPERTY_IMAGE,
  }));

export type TPropertyForm = z.infer<typeof propertyFormSchema>;

export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});

export type TAuth = z.infer<typeof authSchema>;
