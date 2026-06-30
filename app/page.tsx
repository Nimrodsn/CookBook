import { Header } from "@/components/layout/Header";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { getAppwriteErrorMessage } from "@/lib/appwrite/errors";
import { getRecipes } from "@/lib/appwrite/recipes";
import { getAppwriteEnvStatus } from "@/lib/appwrite/server";

export default async function HomePage() {
  const envStatus = getAppwriteEnvStatus();
  const configured = envStatus.configured;
  // #region agent log
  fetch('http://127.0.0.1:7870/ingest/3e2796c3-9e1e-4eaa-954c-026adc63f002',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c649fa'},body:JSON.stringify({sessionId:'c649fa',location:'app/page.tsx:HomePage',message:'Appwrite env status',data:{configured,missing:envStatus.missing,vercel:!!process.env.VERCEL},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
  // #endregion
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
          missingEnvVars={envStatus.missing}
          isVercel={!!process.env.VERCEL}
          error={appwriteError}
        />
      </main>
    </>
  );
}
