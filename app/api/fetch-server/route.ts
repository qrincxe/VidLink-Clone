import { servers } from "@/lib/servers";
import axios from "axios";

/**
 * 
Mydomain.com/embed/movie/{tmdb or IMDb I'd}

Mydomain.com/embed/tv/{tmdb or IMDb I'd}/{season no}/{episode no}
 */
const fetchServer = async (
  type: "movie" | "tvShows",
  serverNumber: number,
  id: number | string,
  seasonNo: number,
  tmdbOrImdbId: number
) => {
  const server = servers[serverNumber];

  const url = `${server[type]}${tmdbOrImdbId ? `/${tmdbOrImdbId}` : ""}${
    seasonNo ? `/${seasonNo}` : ""
  }/${id}`;
  console.log({ url });
  try {
    const { data } = await axios.get(url);
    console.log({ data });
    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export async function POST(req, res) {
  const { type, serverNumber, id, seasonNo, tmdbOrImdbId } = await req.json();
  console.log({ type, seasonNo, serverNumber, id, tmdbOrImdbId });
  try {
    const serverData = await fetchServer(
      type,
      serverNumber,
      id,
      seasonNo,
      tmdbOrImdbId
    );

    return Response.json(serverData);
  } catch (e) {
    return Response.json(e, { status: 500 });
  }
}
