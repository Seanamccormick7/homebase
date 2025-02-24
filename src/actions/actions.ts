"use server";

import { auth, signIn, signOut } from "@/lib/auth-no-edge";
import prisma from "@/lib/db";
import {
  authSchema,
  propertyFormSchema,
  propertyIdSchema,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { checkAuth, getPropertyById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// --- user actions ---

export async function logIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials.",
          };
        }
        default: {
          return {
            message: "Error. Could not sign in.",
          };
        }
      }
    }

    throw error; // nextjs redirects throws error, so we need to rethrow it
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  // convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());

  // validation
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }

    return {
      message: "Could not create user.",
    };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// --- property actions ---

export async function addProperty(property: unknown) {
  const session = await checkAuth();

  const validatedProperty = propertyFormSchema.safeParse(property);
  if (!validatedProperty.success) {
    return {
      message: "Invalid property data.",
    };
  }

  try {
    await prisma.property.create({
      data: {
        ...validatedProperty.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: "Could not add property.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editProperty(
  propertyId: unknown,
  newPropertyData: unknown
) {
  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPropertyId = propertyIdSchema.safeParse(propertyId);
  const validatedProperty = propertyFormSchema.safeParse(newPropertyData);

  if (!validatedPropertyId.success || !validatedProperty.success) {
    return {
      message: "Invalid property data.",
    };
  }

  // authorization check
  const property = await getPropertyById(validatedPropertyId.data);
  if (!property) {
    return {
      message: "Property not found.",
    };
  }
  if (property.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database mutation
  try {
    await prisma.property.update({
      where: {
        id: validatedPropertyId.data,
      },
      data: validatedProperty.data,
    });
  } catch (error) {
    return {
      message: "Could not edit property.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deleteProperty(propertyId: unknown) {
  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPropertyId = propertyIdSchema.safeParse(propertyId);
  if (!validatedPropertyId.success) {
    return {
      message: "Invalid property data.",
    };
  }

  // authorization check
  const property = await getPropertyById(validatedPropertyId.data);
  if (!property) {
    return {
      message: "Property not found.",
    };
  }
  if (property.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database mutation
  try {
    await prisma.property.delete({
      where: {
        id: validatedPropertyId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete property.",
    };
  }

  revalidatePath("/app", "layout");
}

// --- payment actions ---

export async function createCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  console.log(session.user.email);

  const productPrice = process.env.PROD_PRICE;

  if (!productPrice) {
    throw new Error("PROD_PRICE is not defined in environment variables");
  }

  // create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: productPrice,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_CANONICAL_URL}/payment?cancelled=true`,
  });

  // redirect user
  redirect(checkoutSession.url);
}
