import React from 'react';
import cardlist from '../gamedata/cardlist';

export const GameContext = React.createContext();

function shuffleArray(arr) {
    const len = arr.length;
    let temp;
    for(let i = 0; i < len; i++) {
        const index = Math.floor(Math.random() * len);
        if (index != i) {
        temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
        }
    }

    return arr;
}

export function GameProvider({children}) {

    const [cp, setCp] = React.useState(12);
    const [gold, setGold] = React.useState(120);
    const [topCard, setTopCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);
    const [hand, setHand] = React.useState([]);

    React.useEffect(() => {
        //  lap kiosztas
        //  pakli keveres
        setHand(cards => [cardlist[0], cardlist[1], cardlist[2]]);
        let temp = [];
        for(let i = 3; i < cardlist.length; i++) {
            temp.push(cardlist[i]);
        }
        temp = shuffleArray(temp);
        setTopCard(temp[0]);
        temp.splice(0, 1);
        setCards(cards => [...temp]);

    }, []);

    return (
        <GameContext.Provider value={{cp, setCp, gold, cards, hand, topCard}}>
            {children}
        </GameContext.Provider>
    );
}