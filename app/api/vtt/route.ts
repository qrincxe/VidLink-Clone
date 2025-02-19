import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { url } = req;
    const vttUrl = new URL(url).searchParams.get("vttUrl");

  if (!vttUrl) {
    return new Response("vttUrl is required", { status: 400 });
  }

  try {
    const response = await axios.get(vttUrl);
    return new Response(response.data, {
      headers: {
        "Content-Type": "text/vtt",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch VTT content", { status: 500 });
  }
}
