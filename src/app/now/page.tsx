import { RecentlyPlayedGames } from "@/components/now/games";
import { Suspense } from "react";

export default async function Now() {
  return (
    <>
      <h1 className="pl-4 pt-4 text-4xl">/now</h1>
      <Suspense fallback={null}>
        <RecentlyPlayedGames />
      </Suspense>
    </>
  );
}
