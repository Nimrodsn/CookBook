import { Header } from "@/components/layout/Header";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getAppwriteErrorMessage } from "@/lib/appwrite/errors";
import { getRecipes } from "@/lib/appwrite/recipes";
import { isAppwriteConfigured } from "@/lib/appwrite/server";

export default async function HomePage() {
  const configured = isAppwriteConfigured();
  let recipes: Awaited<ReturnType<typeof getRecipes>> = [];
  let appwriteError: string | undefined;

  try {
    recipes = await getRecipes();
  } catch (error) {
    appwriteError = getAppwriteErrorMessage(error);
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-espresso">
            Our Recipes
          </h1>
          <p className="mt-1 text-stone">
            Family favorites, saved links, and kitchen notes.
          </p>
        </div>
        <DashboardClient
          recipes={recipes}
          configured={configured}
          error={appwriteError}
        />
      </main>
    </>
  );
}
