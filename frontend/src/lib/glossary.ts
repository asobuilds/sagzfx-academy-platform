/** Plain-language explanations of trading terms used throughout SAGZFX. */
export const glossary = {
  forex: "Foreign exchange: the buying and selling of currencies.",
  "currency-pair": "Two currencies compared, such as EUR/USD.",
  "base-currency": "The first currency in a pair. Its value is expressed in units of the second currency.",
  "quote-currency": "The second currency in a pair. It shows how much of that currency one unit of the base currency is worth.",
  pip: "A standard small price move, usually 0.0001 for pairs like EUR/USD.",
  "lot-size": "How large a position is. 0.10 is one-tenth of a standard lot.",
  spread: "The gap between the buy and sell price of a pair.",
  "entry-price": "The price a trade is opened at.",
  position: "A trade that has been opened.",
  "stop-loss": "A planned exit price intended to limit a loss if the market moves against the trade. It may not always execute at the exact price.",
} as const;

export type GlossaryKey = keyof typeof glossary;

export function getDefinition(key: GlossaryKey): string {
  return glossary[key];
}
