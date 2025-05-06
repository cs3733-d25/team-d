import { useEffect } from "react";
import startGame from '../Game/src/main'; // Export your game logic as a function

const Game = () => {
    useEffect(() => {
        startGame(); // Run game logic
    }, []);

    return (
        <div id="game-container">
            <canvas id="docGame" width="800" height="600"/>
        </div>
    );
};

export default Game;
