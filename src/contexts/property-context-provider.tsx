"use client";

import { addProperty, deleteProperty, editProperty } from "@/actions/actions";
import { PropertyEssentials } from "@/lib/types";
import { Property } from "@prisma/client";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PropertyContextProviderProps = {
  data: Property[];
  children: React.ReactNode;
};

type TPropertyContext = {
  properties: Property[];
  selectedPropertyId: Property["id"] | null;
  selectedProperty: Property | undefined;
  numberOfProperties: number;
  handleAddProperty: (newProperty: PropertyEssentials) => Promise<void>;
  handleEditProperty: (
    propertyId: Property["id"],
    newPropertyData: PropertyEssentials
  ) => Promise<void>;
  handleCheckoutProperty: (id: Property["id"]) => Promise<void>;
  handleChangeSelectedPropertyId: (id: Property["id"]) => void;
};

export const PropertyContext = createContext<TPropertyContext | null>(null);

export default function PropertyContextProvider({
  data,
  children,
}: PropertyContextProviderProps) {
  // state
  const [optimisticProperties, setOptimisticProperties] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random().toString() }];
        case "edit":
          return state.map((property) => {
            if (property.id === payload.id) {
              return { ...property, ...payload.newPropertyData };
            }
            return property;
          });
        case "delete":
          return state.filter((property) => property.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );

  // derived state
  const selectedProperty = optimisticProperties.find(
    (property) => property.id === selectedPropertyId
  );
  const numberOfProperties = optimisticProperties.length;

  // event handlers / actions
  const handleAddProperty = async (newProperty: PropertyEssentials) => {
    setOptimisticProperties({ action: "add", payload: newProperty });
    const error = await addProperty(newProperty);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };
  const handleEditProperty = async (
    propertyId: Property["id"],
    newPropertyData: PropertyEssentials
  ) => {
    setOptimisticProperties({
      action: "edit",
      payload: { id: propertyId, newPropertyData },
    });
    const error = await editProperty(propertyId, newPropertyData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };
  const handleCheckoutProperty = async (propertyId: Property["id"]) => {
    setOptimisticProperties({ action: "delete", payload: propertyId });
    const error = await deleteProperty(propertyId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedPropertyId(null);
  };
  const handleChangeSelectedPropertyId = (id: Property["id"]) => {
    setSelectedPropertyId(id);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties: optimisticProperties,
        selectedPropertyId,
        selectedProperty,
        numberOfProperties,
        handleAddProperty,
        handleEditProperty,
        handleCheckoutProperty,
        handleChangeSelectedPropertyId,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}
