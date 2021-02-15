import {motion} from 'framer-motion';
import imgCortez from '../static/Desembarco_de_Cortés,_de_Antonio_María_Esquivel_(Museo_de_América,_Madrid)_small.jpg';

export default function Introduction({isActiveGame, showHowToCallback, startCallback, continueCallback}) {
    return (
        <div className="modal">
            <motion.div className="modal-inner" animate={{ scale: 1}} initial={{scale: 0.3}}>
                <h1 className="header">Conquistador</h1>
                <p><img src={imgCortez} alt="Cortes" className="cortez-image" /><i>A Conquistador was a Spanish soldier, explorer and adventurer.<br />
             The Conquistadors invaded and conquered much of the Americas and the 
             Philippines Islands and other islands in Asia Pacific in the 16th, 17th and 18th centuries.
            Many of them were hidalgos (noblemen of low category).</i><br />
            (wikipedia)</p>
                <br />
                <p><b>You are one of them.</b></p>
                <p>You control a band of merceneries seeking gold in the New World.<br/>
                   Use your soldiers, warfare or plague to conquer the enemy<br/> and gather as much gold as you can.

                </p>
                <br />
                <div className="button-container">
                    <button className="button2" onClick={showHowToCallback}>How To Play</button>
                    <button className="button2" onClick={startCallback}>Start New</button>
                    {isActiveGame && <button className="button2" onClick={continueCallback}>Continue</button>}
                </div>
                <br />
                <p>The game based a <a href="https://www.angelfire.com/games2/warpspawn/Cortez.html" target="_blank" rel="noreferrer">solo card game</a>.</p>
                <p>Programmed by Zsolt Csernai<br />
                    csernai.zsolt at gmail.com<br/>
                    <a href="https://github.com/cserzs/conquistador" target="_blank" rel="noreferrer">Source</a>
                </p>
                <p className="credits"><b>Credits</b><br/>
                    Scroll image by stefano corradetti from the <a href="https://thenounproject.com/" target="_blank" rel="noreferrer">Noun Project</a><br/>
                    Help image from <a href="https://game-icons.net/" target="_blank" rel="noreferrer">game-icon.net</a>.<br/>
                    Image of Cortez from wikipedia.<br/>
                    Comfortaa font created by aajohan@gmail.com
                </p>
            </motion.div>
        </div>

    );
}