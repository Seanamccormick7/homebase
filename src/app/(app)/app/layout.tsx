import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import { Toaster } from "@/components/ui/sonner";
import PropertyContextProvider from "@/contexts/property-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
import { checkAuth, getPropertiesByUserId } from "@/lib/server-utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await checkAuth();
  const properties = await getPropertiesByUserId(session.user.id);

  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />

        <SearchContextProvider>
          <PropertyContextProvider data={properties}>
            {children}
          </PropertyContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
