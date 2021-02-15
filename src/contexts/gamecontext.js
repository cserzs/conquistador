import React from 'react';

const Game = React.createContext();

export const useGame = () => React.useContext(Game);

export const GameProvider = ({children, initState, reducer}) => {
    const [state, dispatch] = React.useReducer(reducer, initState);

    return (
        <Game.Provider value={[state, dispatch]}>{children}</Game.Provider>
    );
};