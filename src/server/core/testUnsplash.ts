import { Devvit } from "@devvit/public-api";
import { getImageForOption } from "../unsplash.js";

Devvit.addEndpoint({
  path: "/internal/test-unsplash",
  async handler(request, context) {
    const query = new URL(request.url).searchParams.get("q") || "hamburger";

    const imageUrl = await getImageForOption(query, context);

    console.log("Fetched Unsplash image:", imageUrl);

    return new Response(
      JSON.stringify({ query, imageUrl }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
});
