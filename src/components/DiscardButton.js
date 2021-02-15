import React from 'react';
import {HAND_LIMIT} from '../contexts/gamereducer';

export default function DiscardButton({topCard, handSize, selectedSize, click}) {

    const caption = "Discard" + (selectedSize == 0 ? " top card": " selected");

    return (
        <>
        { topCard && !topCard.indian && handSize === HAND_LIMIT &&
            <div className="button-container">
                <button className="button2" onClick={click}>{caption}</button>
            </div>
        }
        </>        
    );
}