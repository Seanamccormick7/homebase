import { PropertyContext } from "@/contexts/property-context-provider";
import { SearchContext } from "@/contexts/search-context-provider";
import { useContext } from "react";

export function usePropertyContext() {
  const context = useContext(PropertyContext);

  if (!context) {
    throw new Error(
      "usePropertyContext must be used within a PropertyContextProvider"
    );
  }

  return context;
}

export function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearchContext must be used within a SearchContextProvider"
    );
  }

  return context;
}
