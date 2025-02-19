import { servers } from "./servers";
import axios from "axios";

/**
 * 
Mydomain.com/embed/movie/{tmdb or IMDb I'd}

Mydomain.com/embed/tv/{tmdb or IMDb I'd}/{season no}/{episode no}
 */
export const fetchServer = async (
  type: "movie" | "tvShows",
  serverNumber: number,
  id: number | string,
  seasonNo: number,
  tmdbOrImdbId: number
) => {
  const server = servers.at(serverNumber);
  
  try {
    const { data } = await axios.post("/api/fetch-server", {
      type,
      serverNumber,
      id,
      seasonNo,
      tmdbOrImdbId,
    });
    console.log({ data });
    return data;
  } catch (e) {
    console.error(e);
  }
};
