import React from "react";
import "./Card.css";

interface CardProps {
  rank: string;
  suit: string;
  isFaceUp: boolean;
  onClick?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({ rank, suit, isFaceUp, className }) => {
  const getSuitColor = (suit: string) => {
    switch (suit) {
      case "♥":
      case "♦":
        return "text-red-500";
      case "♣":
      case "♠":
        return "text-black";
      default:
        return "text-black";
    }
  };

  return (
    <div className={`relative w-24 h-36 ${className}`}>
      <div
        className={`absolute w-full h-full border-2 rounded-lg bg-white shadow-lg transition-transform duration-700 ${
          isFaceUp ? "" : "rotate-y-180"
        }`}
      >
        {isFaceUp ? (
          <div className="flex flex-col items-center justify-center flex-grow">
            <div className={`text-xl font-bold ${getSuitColor(suit)}`}>
              {rank}
            </div>
            <div className={`text-lg ${getSuitColor(suit)}`}>{suit}</div>
          </div>
        ) : (
          <div className="w-full h-full bg-red-600 rounded-lg flex items-center justify-center"></div>
        )}
      </div>
    </div>
  );
};

export default Card;
