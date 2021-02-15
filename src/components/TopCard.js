import React from 'react';
import {motion} from 'framer-motion';

export default function TopCard({ card }) {

    let type = card.type.charAt(0).toUpperCase() + card.type.substring(1);

    return (
        <motion.div className={`card ${card.indian? "indian": ""}`}
            animate={{ rotateY: 0}} initial={{rotateY: 90}} transition={{ duration: 0.4 }}>
            <div className="title">{card.title}</div>
            <div className="inner-box">
                <div className="force-box enemy-force-box">{card.force}</div>
                <div className="cardtype">{type}</div>
            </div>
        </motion.div>
    );
}