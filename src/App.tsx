import React from "react";
import PockerGame from "./components/PockerGame";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-600">
      <h1 className="text-white text-4xl font-bold mb-4">Poker</h1>
      <div className="w-full max-w-4xl bg-green-700 rounded-lg shadow-lg border-4 border-green-800 flex items-center justify-center p-4">
        <PockerGame />
      </div>
    </div>
  );
};

export default App;
