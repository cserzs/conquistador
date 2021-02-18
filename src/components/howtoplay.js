import {motion} from 'framer-motion';

export default function HowToPlay({closeCallback}) {
    return (
        <div className="modal">
            <motion.div className="modal-inner howtoplay" animate={{ scale: 1}} initial={{scale: 0.3}}>
                <h1 className="header">How To Be A Conquistador</h1>
                
                <p>This is a card game.<br/>
                   There are 2 main card types in the deck:<br/>
                    1. Conquistador cards<br/>
                    2. Indian cards
                </p>
                
                <p>You can use the conquistador cards to defeat the indian cards. Every card has a force value.
                   To defeat the indian cards, you have to select cards (1 or more) with equal or greater force value than indian card value.
                </p>

                <p>Every defeated card force value increase your gold.<br/>
                   If you can't defeat the card you retreat. In this case the force decrease your army point. If your army point reduced to zero you lose.
                </p>

                <p>
                    If no cards left in the deck you win.
                </p>

                <p><b>Allies</b><br/>
                    If you conquer an indian card ONLY with Diplomacy type cards, these card become your allies.<br/>
                    Ally card can use like a conquistador card. When used, ally card value added to gold value.<br/>
                    Settlement cards cannot be used as Allies.
                </p>

                <p><b>Disease</b><br/>
                    If you conquer an indian card only with Disease type cards, these card discarded and there values
                    NOT added to your gold.
                </p>

                <div className="button-container">
                    <button className="button2" onClick={closeCallback}>Close</button>
                </div>
                <br />
            </motion.div>
        </div>
    );
}