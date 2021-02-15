import React, { useEffect, useState } from 'react';
import {motion} from 'framer-motion';
import Card from './components/Card';
import TopCard from './components/TopCard';
import Stat from './components/Stat';
import DiscardButton from './components/DiscardButton';
import Button from './components/Button';
import { useGame } from './contexts/gamecontext';
import * as game from './contexts/gamereducer';
import Gameover from './components/gameover';
import Introduction from './components/Introduction';
import HowToPlay from './components/howtoplay';
import FlashMessages from './components/Flashmessages';

import imgMenu from './static/scroll2.png';
import imgHelp from './static/help2.png';

import './App.css';

//  TODO
//  + allies
//  + disease
//  + animaciok
//  + alkonyvtarbol is mukodjon
//  + pick up utan is toroljuk a selected kartyakat
//  + ally kartyaknal kiirni
//  - credits
//  - ally card hasznalatakor nem biztos, hogy a gold hozzaadodik?

const WINDOW_INTRODUCTION = 1;
const WINDOW_HOW_TO_PLAY = 2;

function App() {
  const [state, dispatch] = useGame();
  const [visibleWindow, setVisibleWindow] = useState(1);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    dispatch({ type: game.ACTION_SHUFFLE });
  }, []);

  useEffect(() => {
    if (state.message !== "") setLocalMessage("");
  }, [state.message]);

  function retreat() {
    dispatch({ type: game.ACTION_DISCARD_TOP_CARD });
  }

  function conquer() {
    if (state.selectedCards.length < 1) {
      setLocalMessage("You have to select at least one of your card to conquer the enemy!");
      return;
    }
    dispatch({ type: game.ACTION_CONQUER });
  }

  function pickUp() {
    if (state.hand.length === game.HAND_LIMIT) {
      setLocalMessage("You've reached the hand limit! Discard a card!");
      return;
    }
    dispatch({ type: game.ACTION_PICK_UP });
  }

  function discard() {
    dispatch({ type: game.ACTION_DISCARD_SELECTED });
  }

  function clickCard(card) {
    dispatch({ type: game.ACTION_SELECT_CARD, card: card });
  }

  function start() {
    setVisibleWindow(0);
    dispatch({ type: game.ACTION_INIT });
    dispatch({ type: game.ACTION_SHUFFLE });
  }

  function showIntroduction() {
    setVisibleWindow(WINDOW_INTRODUCTION);
  }

  function showHowTo() {
    setVisibleWindow(WINDOW_HOW_TO_PLAY);
  }

  function continueGame() {
    setVisibleWindow(0);
  }

  const closeHowToPlay = () => setVisibleWindow(0);

  const message = (localMessage === "" ? state.message : localMessage);

  return (
    <>
      <h2 className="header">Conquistador</h2>
      <div className="grid-container">
        <div className="left-side">
          <Stat name="Army" value={state.cp} />
          <Stat name="Gold" value={state.gold} />
          <Stat name="Cards remaining" value={state.cards.length} />
        </div>

        <div className="top-card-container">
          {state.topCard &&
            <TopCard key={state.topCard.id} card={state.topCard} />
          }
        </div>

        <div className="right-side">
          <Button visible={state.topCard && state.topCard.indian} caption="Conquer" click={conquer} />
          <Button visible={state.topCard && state.topCard.indian} caption="Retreat" click={retreat} />

          <Button visible={state.topCard && !state.topCard.indian} caption="Pick up" click={pickUp} />
          <DiscardButton topCard={state.topCard} handSize={state.hand.length} selectedSize={state.selectedCards.length} click={discard} />
        </div>

      </div>

      <div className="info-bar">
        <motion.div key={message} animate={{scale: 1}} initial={{scale: 0.4}} transition={{ type: "spring", bounce: 0.5 }}>{message}</motion.div>
      </div>

      <div className="hand-bar">
        {state.hand.map((card, index) => (
            <Card key={card.id} card={card} onClick={clickCard} />
        ))}
      </div>

      <div className="menubar">
        <img src={imgMenu} onClick={showIntroduction} width="50" height="50" alt="Introduction"/>
        <img src={imgHelp} onClick={showHowTo} width="50" height="50" alt="How to play"/>
      </div>

      {state.isGameEnd &&
        <Gameover isWin={state.gamestate === game.GAMESTATE_WIN} gold={state.gold} playAgain={start} />
      }

      {visibleWindow === WINDOW_INTRODUCTION &&
        <Introduction isActiveGame={state.gamestate === game.GAMESTATE_RUN} showHowToCallback={showHowTo} startCallback={start} continueCallback={continueGame} />
      }

      {visibleWindow === WINDOW_HOW_TO_PLAY &&
        <HowToPlay closeCallback={closeHowToPlay} />
      }

      <FlashMessages messages={state.flashMessages} />
    </>
  );
}

export default App;


