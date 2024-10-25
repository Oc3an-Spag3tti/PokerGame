import React, { useState } from "react";
import { getDeck, shuffleDeck, dealHands } from "./Deck";
import Card from "./Card";

const PokerGame = () => {
  const [playerHand, setPlayerHand] = useState<
    { rank: string; suit: string; value: number }[]
  >([]);
  const [computerHand, setComputerHand] = useState<
    { rank: string; suit: string; value: number }[]
  >([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [selectedCards, setSelectedCards] = useState<boolean[]>([]);
  const [dropCount, setDropCount] = useState(0);
  const [deck, setDeck] = useState<
    { rank: string; suit: string; value: number }[]
  >([]);

  const startGame = () => {
    const newDeck = getDeck();
    const shuffledDeck = shuffleDeck(newDeck);
    const { playerHand, computerHand } = dealHands(shuffledDeck);
    setDeck(shuffledDeck.slice(8)); // Store remaining cards
    setPlayerHand(playerHand);
    setComputerHand(computerHand);
    setWinner(null);
    setResultMessage("");
    setReveal(false);
    setRevealedCards(new Array(computerHand.length).fill(false));
    setSelectedCards(new Array(playerHand.length).fill(false));
    setDropCount(0);
  };

  const resetGame = () => {
    startGame();
  };

  const exitGame = () => {
    setPlayerHand([]);
    setComputerHand([]);
    setWinner(null);
    setResultMessage("");
    setReveal(false);
    setRevealedCards([]);
    setSelectedCards([]);
    setDropCount(0);
    setDeck([]);
  };

  const toggleCardSelection = (index: number) => {
    if (!reveal) {
      const newSelectedCards = [...selectedCards];
      newSelectedCards[index] = !newSelectedCards[index];
      setSelectedCards(newSelectedCards);
    }
  };

  const dropSelectedCards = () => {
    if (dropCount >= 3) return;

    const newPlayerHand = [...playerHand];
    const remainingDeck = [...deck];

    selectedCards.forEach((isSelected, index) => {
      if (isSelected && remainingDeck.length > 0) {
        const newCard = remainingDeck.pop();
        if (newCard) {
          newPlayerHand[index] = newCard;
        }
      }
    });

    setPlayerHand(newPlayerHand);
    setDeck(remainingDeck);
    setSelectedCards(new Array(playerHand.length).fill(false));
    setDropCount(dropCount + 1);
  };

  const evaluateHand = (
    hand: { rank: string; suit: string; value: number }[]
  ) => {
    const rankCount: Record<string, number> = {};
    hand.forEach((card) => {
      rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    });

    const counts = Object.values(rankCount).sort((a, b) => b - a);
    const isFlush = checkIfFlush(hand);
    const isStraight = checkIfStraight(hand);

    if (isStraight && isFlush) return { score: 8, message: "Straight Flush" };
    if (counts[0] === 4) return { score: 7, message: "Four of a Kind" };
    if (counts[0] === 3 && counts[1] === 2)
      return { score: 6, message: "Full House" };
    if (isFlush) return { score: 5, message: "Flush" };
    if (isStraight) return { score: 4, message: "Straight" };
    if (counts[0] === 3) return { score: 3, message: "Three of a Kind" };
    if (counts[0] === 2 && counts[1] === 2)
      return { score: 2, message: "Two Pair" };
    if (counts[0] === 2) return { score: 1, message: "One Pair" };

    const highCard = Math.max(...hand.map((card) => card.value));
    return { score: 0, message: "High Card", highCard };
  };

  const determineWinner = () => {
    const playerScore = evaluateHand(playerHand);
    const computerScore = evaluateHand(computerHand);

    if (playerScore.score > computerScore.score) {
      setWinner("Player");
      setResultMessage(`Player wins with: ${playerScore.message}`);
    } else if (computerScore.score > playerScore.score) {
      setWinner("Computer");
      setResultMessage(`Computer wins with: ${computerScore.message}`);
    } else {
      const playerHighCard = playerScore.highCard ?? -1;
      const computerHighCard = computerScore.highCard ?? -1;

      if (playerHighCard > computerHighCard) {
        setWinner("Player");
        setResultMessage("Player wins with the high card.");
      } else {
        setWinner("Computer");
        setResultMessage("Computer wins with the high card.");
      }
    }
  };

  const checkIfFlush = (hand: { suit: string }[]): boolean => {
    return new Set(hand.map((card) => card.suit)).size === 1;
  };

  const checkIfStraight = (hand: { value: number }[]): boolean => {
    const sortedValues = hand.map((card) => card.value).sort((a, b) => a - b);
    return sortedValues.every(
      (value, index) => index === 0 || value === sortedValues[index - 1] + 1
    );
  };

  const handleReveal = () => {
    setReveal(true);
    const newRevealedCards = [...revealedCards];

    const revealCardsSequentially = (index: number) => {
      if (index < computerHand.length) {
        newRevealedCards[index] = true;
        setRevealedCards([...newRevealedCards]);

        setTimeout(() => {
          revealCardsSequentially(index + 1);
        }, 1000);
      } else {
        setTimeout(determineWinner, 1000);
      }
    };

    revealCardsSequentially(0);
  };

  const isDropEnabled =
    selectedCards.some((card) => card) && dropCount < 3 && !reveal;

  return (
    <div className="relative flex flex-col items-center w-[900px] h-[600px] bg-green-800 rounded-lg p-6 mx-auto">
      {/* Deck visualization */}
      {playerHand.length > 0 && (
        <div className="absolute top-6 right-6 flex flex-col items-center">
          <Card rank="" suit="" isFaceUp={false} />
          <div className="mt-1 text-white font-bold text-sm">
            Remaining: {deck.length}
          </div>
        </div>
      )}

      {computerHand.length > 0 && (
        <div className="flex flex-col items-center w-full mt-4">
          <h2 className="text-lg font-bold text-white mb-2">Computer Hand</h2>
          <div className="flex justify-center gap-2">
            {computerHand.map((card, index) => (
              <Card
                key={`computer-${index}`}
                rank={card.rank}
                suit={card.suit}
                isFaceUp={reveal && revealedCards[index]}
                className="transition-transform duration-700"
              />
            ))}
          </div>
        </div>
      )}

      {playerHand.length > 0 && (
        <div className="flex flex-col items-center w-full mt-16">
          <h2 className="text-lg font-bold text-white mb-2">Player Hand</h2>
          <div className="flex justify-center gap-2">
            {playerHand.map((card, index) => (
              <div
                key={`player-${index}`}
                className={`transform transition-all duration-200 ${
                  selectedCards[index] ? "translate-y-[-10px]" : ""
                }`}
                onClick={() => toggleCardSelection(index)}
              >
                <Card
                  rank={card.rank}
                  suit={card.suit}
                  isFaceUp={true}
                  className={`cursor-pointer transition-transform duration-700 ${
                    selectedCards[index] ? "border-blue-500 border-4" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mt-16">
        {playerHand.length === 0 ? (
          <button
            onClick={startGame}
            className="p-3 bg-blue-600 text-white rounded-lg transition duration-200 hover:bg-blue-700 text-lg"
          >
            Start Game
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={handleReveal}
              className="p-2 bg-green-600 text-white rounded-lg transition duration-200 hover:bg-green-700"
            >
              Reveal
            </button>
            <button
              onClick={dropSelectedCards}
              disabled={!isDropEnabled}
              className={`p-2 text-white rounded-lg transition duration-200 ${
                isDropEnabled
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Drop ({dropCount}/3)
            </button>
            <button
              onClick={resetGame}
              className="p-2 bg-yellow-600 text-white rounded-lg transition duration-200 hover:bg-yellow-700"
            >
              Reset
            </button>
            <button
              onClick={exitGame}
              className="p-2 bg-red-600 text-white rounded-lg transition duration-200 hover:bg-red-700"
            >
              Exit
            </button>
          </div>
        )}
      </div>

      {winner && (
        <h2 className="text-xl mt-4 font-bold text-white">{winner} Wins!</h2>
      )}
      {resultMessage && (
        <h2 className="text-lg mt-2 text-white">{resultMessage}</h2>
      )}
    </div>
  );
};

export default PokerGame;
