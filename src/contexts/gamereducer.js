import cardlist from './cardlist';

export const ACTION_INIT = "init";
export const ACTION_SHUFFLE = "shuffle";
export const ACTION_DISCARD_TOP_CARD = "discard top card";
export const ACTION_PICK_UP = "pick up";
export const ACTION_DISCARD_SELECTED = "discard selected";
export const ACTION_CONQUER = "conquer";
export const ACTION_SELECT_CARD = "select card";

export const GAMESTATE_RUN = 'run';
export const GAMESTATE_WIN = 'win';
export const GAMESTATE_LOSE = 'lose';

export const HAND_LIMIT = 7;

export const initState = {
    cp: 20,
    gold: 0,
    hand: [],
    topCard: null,
    cards: [],
    selectedCards: [],
    isGameEnd: false,
    gamestate: GAMESTATE_RUN,
    message: "",
    flashMessages: []
};

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

function generateMessage(topCard, handSize) {
    if (!topCard) return "";
    let message = "";
    if (topCard.indian) {
        message = "Select your cards to conquer the enemy or retreat!";
    }
    else {
        if (handSize < HAND_LIMIT) {
            message = "Pick up the card!";
        }
        else {
            message = "You have reached the hand limit! Discard the top card or select any card to discard it!";
        }
    }
    return message;
}

function drawNewTopCard(cardList) {
    let cards = [...cardList];
    let gamestate = GAMESTATE_RUN;
    let topCard = null;
    if (cards.length === 0) {
        gamestate = GAMESTATE_WIN;
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

function containOnly(cards, type) {
    for(let i = 0; i < cards.length; i++) {
        if (cards[i].type !== type) return false;
    }
    return true;
}

export function gameReducer(state, action) {

    if (action.type === ACTION_INIT) {
        return {
            ...initState
        }
    }

    if (action.type === ACTION_SHUFFLE) {
        let hand = [cardlist[0], cardlist[1], cardlist[2]];
        let temp = [];
        let leng = cardlist.length;
        for (let i = 3; i < leng; i++) {
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
            isGameEnd: gamestate !== GAMESTATE_RUN,
            message: generateMessage(topCard, hand.length)
        };
    }

    if (action.type === ACTION_PICK_UP) {
        let newHand = [...state.hand, state.topCard];
        let { topCard, cards, gamestate } = drawNewTopCard(state.cards);
        return {
            ...state,
            hand: newHand,
            topCard: topCard,
            cards: cards,
            gamestate: gamestate,
            isGameEnd: gamestate !== GAMESTATE_RUN,
            selectedCards: [],
            message: generateMessage(topCard, newHand.length),
            //flashMessages: ["Helloka", "mizujs", "haha"]
        };
    }

    if (action.type === ACTION_DISCARD_TOP_CARD) {
        let cp = state.cp;
        let isGameEnd = false;
        let flashMessages = [];
        let message = "";

        if (state.topCard.indian) {
            cp -= state.topCard.force;
            flashMessages.push("-" + state.topCard.force + " soldier");
            if (cp < 1) {
                isGameEnd = true;
            }
        }

        if (isGameEnd) {
            return {
                ...state,
                cp: cp,
                isGameEnd: isGameEnd,
                gamestate: isGameEnd ? GAMESTATE_LOSE : GAMESTATE_RUN
            };
        }

        let { topCard, cards, gamestate } = drawNewTopCard(state.cards);
        message = generateMessage(topCard, state.hand.length);

        return {
            ...state,
            cp: cp,
            isGameEnd: gamestate !== GAMESTATE_RUN,
            gamestate: gamestate,
            message: message,
            topCard: topCard,
            cards: cards,
            flashMessages: flashMessages
        };
    }

    if (action.type === ACTION_DISCARD_SELECTED) {
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
                isGameEnd: gamestate !== GAMESTATE_RUN,
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

    if (action.type === ACTION_CONQUER) {
        let playerForce = 0;
        let gold = state.gold;
        let flashMessages = [];
        let cp = state.cp;
        let hand = [...state.hand];

        for (let i = 0; i < state.selectedCards.length; i++) {
            playerForce += state.selectedCards[i].force;
            let index = hand.indexOf(state.selectedCards[i]);
            hand.splice(index, 1);
        }

        if (playerForce >= state.topCard.force) {
            //  conquered
            if (containOnly(state.selectedCards, "disease"))
            {
                flashMessages.push("0 gold (disease)");
            }
            else {
                gold += state.topCard.force;
                flashMessages.push("+" + state.topCard.force + " gold");
            }
            if (containOnly(state.selectedCards, "diplomacy") && state.topCard.type !== "settlements") {
                hand.push(state.topCard);
                flashMessages.push("new ally");
            }
        }
        else {
            //  not conquered
            cp -= state.topCard.force;
            flashMessages.push("-" + state.topCard.force + " soldier");
        }

        if (cp < 1) {
            return {
                ...state,
                cp: cp,
                isGameEnd: true,
                gamestate: GAMESTATE_LOSE
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
            isGameEnd: gamestate !== GAMESTATE_RUN,
            flashMessages: flashMessages           
        };
    }

    if (action.type === ACTION_SELECT_CARD) {
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