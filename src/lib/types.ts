import { Property } from "@prisma/client";

export type PropertyEssentials = Omit<
  Property,
  "id" | "createdAt" | "updatedAt" | "userId"
>;
