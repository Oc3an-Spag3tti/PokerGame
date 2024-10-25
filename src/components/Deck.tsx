export const suits = ["♠", "♣", "♦", "♥"];
export const ranks = [
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 11 },
  { rank: "Q", value: 12 },
  { rank: "K", value: 13 },
  { rank: "A", value: 14 },
];

export const getDeck = () => {
  const deck: { rank: string; suit: string; value: number }[] = [];
  for (const suit of suits) {
    for (const { rank, value } of ranks) {
      deck.push({ rank, suit, value });
    }
  }
  return deck;
};

export const shuffleDeck = (
  deck: { rank: string; suit: string; value: number }[]
) => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

export const dealHands = (
  deck: { rank: string; suit: string; value: number }[]
) => {
  const playerHand = deck.slice(0, 4);
  const computerHand = deck.slice(4, 8);
  return { playerHand, computerHand };
};
