"use client";

import { usePropertyContext } from "@/lib/hooks";
import Image from "next/image";
import PropertyButton from "./property-button";
import { Property } from "@prisma/client";

export default function PropertyDetails() {
  const { selectedProperty } = usePropertyContext();

  return (
    <section className="flex flex-col h-full w-full">
      {!selectedProperty ? (
        <EmptyView />
      ) : (
        <>
          <TopBar property={selectedProperty} />

          <OtherInfo property={selectedProperty} />

          <Notes property={selectedProperty} />
        </>
      )}
    </section>
  );
}

function EmptyView() {
  return (
    <p className="h-full flex justify-center items-center text-2xl font-medium">
      No property selected
    </p>
  );
}

type Props = {
  property: Property;
};

function TopBar({ property }: Props) {
  const { handleCheckoutProperty } = usePropertyContext();

  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      <Image
        src={property.imageUrl}
        alt="Selected property image"
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />

      <h2 className="text-3xl font-semibold leading-7 ml-5">{property.name}</h2>

      <div className="ml-auto space-x-2">
        <PropertyButton actionType="edit">Edit</PropertyButton>
        <PropertyButton
          actionType="checkout"
          onClick={async () => await handleCheckoutProperty(property.id)}
        >
          Checkout
        </PropertyButton>
      </div>
    </div>
  );
}

function OtherInfo({ property }: Props) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{property.location}</p>
      </div>

      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Price
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{property.price}</p>
      </div>
    </div>
  );
}

function Notes({ property }: Props) {
  return (
    <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
      {property.notes}
    </section>
  );
}
