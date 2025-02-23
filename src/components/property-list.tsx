"use client";

import { usePropertyContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";

export default function PropertyList() {
  const { properties, selectedPropertyId, handleChangeSelectedPropertyId } =
    usePropertyContext();
  const { searchQuery } = useSearchContext();

  const filteredProperties = useMemo(
    () =>
      properties.filter((property) =>
        property.name.toLowerCase().includes(searchQuery)
      ),
    [properties, searchQuery]
  );

  return (
    <ul className="bg-white border-b border-light">
      {filteredProperties.map((property) => (
        <li key={property.id}>
          <button
            onClick={() => handleChangeSelectedPropertyId(property.id)}
            className={cn(
              "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition",
              {
                "bg-[#EFF1F2]": selectedPropertyId === property.id,
              }
            )}
          >
            <Image
              src={property.imageUrl}
              alt="Property image"
              width={45}
              height={45}
              className="w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{property.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
