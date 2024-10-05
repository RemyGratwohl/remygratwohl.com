import Image from "next/image";

const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${process.env.STEAM_ID}`;

type Game = {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
};

type RecentlyPlayedGamesAPIResponse = {
  response: {
    total_count: number;
    games: Game[];
  };
};

const isGameSafeForWork = async (game: Game) => {
  const response = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${game.appid}`,
    { next: { revalidate: 3600 * 24 } }
  );
  const data = await response.json();

  const contentDescriptorNotes =
    data?.[game.appid]?.data?.content_descriptors?.notes;

  if (contentDescriptorNotes) {
    // ;)
    return !contentDescriptorNotes.includes("sexual");
  }

  return true;
};

export const RecentlyPlayedGames = async () => {
  const response = await fetch(url, { next: { revalidate: 3600 } });
  const data: RecentlyPlayedGamesAPIResponse = await response.json();

  const gameDetailPromises = data.response.games.map(async (game) => {
    if (game.name && (await isGameSafeForWork(game))) {
      return game;
    }

    return null;
  });

  const filteredGames = (await Promise.all(gameDetailPromises)).filter(
    (game) => game !== null
  );

  return (
    <div className="p-4">
      <fieldset className="border-4">
        <legend className="mr-auto ml-4 px-2 text-xl">Games</legend>
        <div className="flex p-4 overflow-hidden gap-8 flex-col sm:flex-row">
          {filteredGames.map((game) => (
            <div className="" key={game.appid}>
              <a href={`https://store.steampowered.com/app/${game.appid}`}>
                <Image
                  src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                  alt={game.name}
                  width={460}
                  height={215}
                />
              </a>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
