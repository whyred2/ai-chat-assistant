import { Mistral } from "@mistralai/mistralai";

const mistralApiKey = process.env.MISTRAL_API_KEY;

export const mistral = new Mistral({
  apiKey: mistralApiKey || "dummy-key",
});
