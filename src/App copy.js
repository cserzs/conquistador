import React, { useEffect, useReducer, useState } from 'react';
import Card from './components/Card';
import TopCard from './components/TopCard';
import Stat from './components/Stat';
import DiscardButton from './components/DiscardButton';
import Button from './components/Button';
import * as gamedata from './contexts/gamedata';
import cardlist from './contexts/cardlist';
import './App.css';


//  TODO
//  - allies
//  - disease
//  - nyitoablak
//  - sugo
//  - animaciok

function shuffleArray(arr) {
  const len = arr.length;
  let temp;
  for (let i = 0; i < len; i++) {
    const index = Math.floor(Math.random() * len);
    if (index !== i) {
      temp = arr[i];
      arr[i] = arr[index];
      arr[index] = temp;
    }
  }

  return arr;
}

const initState = {
  cp: 20,
  gold: 0,
  hand: [],
  topCard: null,
  cards: [],
  selectedCards: [],
  isGameEnd: false,
  gamestate: gamedata.GAMESTATE_RUN,
  message: ""
};

function generateMessage(topCard, handSize) {
  if (!topCard) return "";
  let message = "";
  if (topCard.indian) {
    message = "Select your cards to conquer the enemy or retreat!";
  }
  else {
    if (handSize < gamedata.HAND_LIMIT) {
      message = "Pick the card!";
    }
    else {
      message = "You have reached the hand limit! Discard the top card or select any card to discard it!";
    }
  }
  return message;
}

function drawNewTopCard(cardList) {
  let cards = [...cardList];
  let gamestate = gamedata.GAMESTATE_RUN;
  let topCard = null;
  if (cards.length === 0) {
    gamestate = gamedata.GAMESTATE_WIN;
  }
  else {
    topCard = cards.pop();
  }
  return {
    cards: cards,
    topCard: topCard,
    gamestate: gamestate
  };
}

function reducer(state, action) {

  if (action.type === gamedata.ACTION_INIT) {
    return {
      ...initState
    }
  }

  if (action.type === gamedata.ACTION_SHUFFLE) {
    let hand = [cardlist[0], cardlist[1], cardlist[2]];
    let temp = [];
    for (let i = 3; i < cardlist.length; i++) {
      temp.push(cardlist[i]);
    }
    temp = shuffleArray(temp);
    let { cards, topCard, gamestate } = drawNewTopCard(temp);
    return {
      ...state,
      cards: cards,
      topCard: topCard,
      hand: hand,
      gamestate: gamestate,
      isGameEnd: gamestate !== gamedata.GAMESTATE_RUN,
      message: generateMessage(topCard, hand.length)
    };
  }

  if (action.type === gamedata.ACTION_PICK_UP) {
    let newHand = [...state.hand, state.topCard];
    let { topCard, cards, gamestate } = drawNewTopCard(state.cards);
    return {
      ...state,
      hand: newHand,
      topCard: topCard,
      cards: cards,
      gamestate: gamestate,
      isGameEnd: gamestate !== gamedata.GAMESTATE_RUN,
      message: generateMessage(topCard, newHand.length)
    };
  }

  if (action.type === gamedata.ACTION_DISCARD_TOP_CARD) {
    let cp = state.cp;
    let isGameEnd = false;
    let message = "";

    if (state.topCard.indian) {
      cp -= state.topCard.force;
      if (cp < 1) {
        isGameEnd = true;
      }
    }

    if (isGameEnd) {
      return {
        ...state,
        cp: cp,
        isGameEnd: isGameEnd,
        gamestate: isGameEnd ? gamedata.GAMESTATE_LOSE : gamedata.GAMESTATE_RUN
      };
    }

    let { topCard, cards, gamestate } = drawNewTopCard(state.cards);
    message = generateMessage(topCard, state.hand.length);

    return {
      ...state,
      cp: cp,
      isGameEnd: gamestate !== gamedata.GAMESTATE_RUN,
      gamestate: gamestate,
      message: message,
      topCard: topCard,
      cards: cards
    };
  }

  if (action.type === gamedata.ACTION_DISCARD_SELECTED) {
    if (state.selectedCards.length === 0) {
      //  discard top card
      let { topCard, cards, gamestate } = drawNewTopCard(state.cards);
      let message = generateMessage(topCard, state.hand.length);
      return {
        ...state,
        cards: cards,
        topCard: topCard,
        message: message,
        gamestate: gamestate,
        isGameEnd: gamestate !== gamedata.GAMESTATE_RUN,
      };
    }
    else {
      //  discard selected
      let hand = [...state.hand];

      for (let i = 0; i < state.selectedCards.length; i++) {
        let index = hand.indexOf(state.selectedCards[i]);
        hand.splice(index, 1);
      }

      let message = generateMessage(state.topCard, hand.length);

      return {
        ...state,
        hand: hand,
        selectedCards: [],
        message: message
      };
    }
  }

  if (action.type === gamedata.ACTION_CONQUER) {
    let playerForce = 0;
    let gold = state.gold;
    let cp = state.cp;
    let hand = [...state.hand];

    for (let i = 0; i < state.selectedCards.length; i++) {
      playerForce += state.selectedCards[i].force;
      let index = hand.indexOf(state.selectedCards[i]);
      hand.splice(index, 1);
    }

    if (playerForce >= state.topCard.force) {
      //  conquered
      gold += state.topCard.force;
    }
    else {
      //  not conquered
      cp -= state.topCard.force;
    }

    if (cp < 1) {
      return {
        ...state,
        cp: cp,
        isGameEnd: true,
        gamestate: gamedata.GAMESTATE_LOSE
      }
    }

    let { topCard, cards, gamestate } = drawNewTopCard(state.cards);
    let message = generateMessage(topCard, hand.length);

    return {
      ...state,
      gold: gold,
      cp: cp,
      cards: cards,
      hand: hand,
      topCard: topCard,
      message: message,
      selectedCards: [],
      gamestate: gamestate,
      isGameEnd: gamestate !== gamedata.GAMESTATE_RUN,
    };
  }

  if (action.type === gamedata.ACTION_SELECT_CARD) {
    let card = action.card;
    let selectedCards = [...state.selectedCards];
    let index = selectedCards.indexOf(card);
    if (index > -1) {
      //  remove
      selectedCards.splice(index, 1);
    }
    else {
      selectedCards.push(card);
    }

    return {
      ...state,
      selectedCards: selectedCards
    };
  }
}



function App() {
  const [state, dispatch] = useReducer(reducer, initState);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    dispatch({ type: gamedata.ACTION_SHUFFLE });
  }, []);

  useEffect(() => {
    if (state.message !== "") setLocalMessage("");
  }, [state.message]);

  function retreat() {
    dispatch({ type: gamedata.ACTION_DISCARD_TOP_CARD });
  }

  function conquer() {
    if (state.selectedCards.length < 1) return;
    dispatch({ type: gamedata.ACTION_CONQUER });
  }

  function pickUp() {
    if (state.hand.length === gamedata.HAND_LIMIT) {
      setLocalMessage("You've reached the hand limit! Discard a card!");
      return;
    }
    dispatch({ type: gamedata.ACTION_PICK_UP });
  }

  function discard() {
    dispatch({ type: gamedata.ACTION_DISCARD_SELECTED });
  }

  function clickCard(card) {
    dispatch({ type: gamedata.ACTION_SELECT_CARD, card: card });
  }

  function restart() {
    dispatch({ type: gamedata.ACTION_INIT });
    dispatch({ type: gamedata.ACTION_SHUFFLE });
  }

  const message = (localMessage === "" ? state.message : localMessage);

  return (
    <div>
      <div className="grid-container">
        <div className="left-side">
          <Stat name="CP" value={state.cp} />
          <Stat name="Gold" value={state.gold} />
          <Stat name="Cards remaining" value={state.cards.length} />
        </div>

        <div className="top-card-container">
          {state.topCard &&
            <TopCard card={state.topCard} />
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
        <div>{message}</div>
      </div>

      <div className="hand-bar">
        {state.hand.map((card, index) => (
          <Card key={card.id} card={card} onClick={clickCard} />
        ))}
      </div>

      {state.isGameEnd &&
        <div className="gameover">
          <div>
            <div className="gameover-content">
              <p>Game End</p>
              <p>You Win!</p>
              <p>You Lose!</p>
              <p>Score: ??</p>
            </div>
            <button onClick={restart}>Play Again</button>
          </div>
        </div>
      }

    </div>
  );
}

export default App;


