"use client";

import { usePropertyContext } from "@/lib/hooks";

export default function Stats() {
  const { numberOfProperties } = usePropertyContext();

  return (
    <section className="text-center">
      <p className="text-2xl font-bold leading-6">{numberOfProperties}</p>
      <p className="opacity-80">current guests</p>
    </section>
  );
}
