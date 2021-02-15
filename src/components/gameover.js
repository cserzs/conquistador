import {motion} from 'framer-motion';

export default function Gameover({isWin, gold, playAgain}) {
    return (
        <div className={`gameover ${isWin ? "win": "lose"}`}>
          <motion.div animate={{ scale: 1}} initial={{scale: 0.3}} transition={{ type: "spring", bounce: 0.5 }}>
            <div className="gameover-content">
              <p>Game End</p>
              {isWin &&
                <div>
                  <p>You Win!</p>
                  <p>Score: {gold}</p>
                </div>
              }
              {!isWin && <p>You Lose Your Army!</p>}
            </div>
            <button onClick={playAgain}>Play Again</button>
          </motion.div>
        </div>
    );
}