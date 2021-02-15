import React, {useState} from 'react';
import {motion} from 'framer-motion';

export default function Card({ card, onClick }) {
    const [selected, setSelected] = useState(false);

    function clickHandler() {
        setSelected(selected => !selected);
        onClick(card);
    }

    let type = card.type.charAt(0).toUpperCase() + card.type.substring(1);
    if (card.indian) type += " / Ally";

    return (
        <motion.div animate={{ rotateY: 0}} initial={{rotateY: 90}} transition={{ duration: 0.4 }}>
        <motion.div whileHover={{y: 5}} transition={{ duration: 0.1 }}>
            <div className={`card ${selected ? "selected" : ""}`} onClick={clickHandler}>
                <div className="card-inner">
                <div className="card-front">
                    <div className="title">{card.title}</div>
                    <div className="inner-box">
                        <div className="force-box">{card.force}</div>
                        <div className="cardtype">{type}</div>
                    </div>
                </div>
                <div className="card-back"> </div>
                </div>
            </div>                
        </motion.div>            
        </motion.div>
    );
  
  }