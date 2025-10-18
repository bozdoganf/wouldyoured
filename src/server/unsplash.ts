import { Devvit } from "@devvit/public-api";

// ⚠️ Hackathon hard-coded Unsplash key (safe for demo only)
const UNSPLASH_ACCESS_KEY = "VBGJ5USZDxNO2qdKYk42lF5qkD-uHPcLyMi27SCFG4k";

export async function getImageForOption(option: string, context: Devvit.Context): Promise<string> {
  const query = encodeURIComponent(option);
  const url = `https://api.unsplash.com/photos/random?query=${query}&orientation=squarish&client_id=${UNSPLASH_ACCESS_KEY}`;

  try {
    const res = await context.http.get(url);

    if (res.status !== 200) {
      console.error(`Unsplash error ${res.status}`);
      return `https://placehold.co/300x300?text=${encodeURIComponent(option)}`;
    }

    const data = JSON.parse(res.body);
    return data.urls?.small || `https://placehold.co/300x300?text=${encodeURIComponent(option)}`;
  } catch (err) {
    console.error("Error fetching Unsplash image:", err);
    return `https://placehold.co/300x300?text=${encodeURIComponent(option)}`;
  }
}
