import "server-only";

import { redirect } from "next/navigation";
import { auth } from "./auth-no-edge";
import { Property, User } from "@prisma/client";
import prisma from "./db";

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function getUserByEmail(email: User["email"]) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

export async function getPropertyById(propertyId: Property["id"]) {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });
  return property;
}

export async function getPropertiesByUserId(userId: User["id"]) {
  const properties = await prisma.property.findMany({
    where: {
      userId,
    },
  });
  return properties;
}
