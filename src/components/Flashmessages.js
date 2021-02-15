import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

let messageList = [];

export default function FlashMessages({ messages }) {
    const timerRef = useRef(null);
    const [msgIndex, setMsgIndex] = useState(-1);

    useEffect(() => {
        if (messages.length < 1) return;
        if (timerRef.current === null) {
            setMsgIndex(0);
            messageList = [...messages];
            startTimer();
        }
        else {
            //console.log("uj uzenetek lettek hozzafuzve");
            messageList = [...messageList, ...messages];
        }
    }, [messages]);

    function startTimer() {
        timerRef.current = setInterval(() => (
            setMsgIndex(msgIndex => {
                if (msgIndex < messageList.length - 1) return msgIndex + 1;
                stopTimer();
                return -1;
            })
        ), 1000);
    }

    function stopTimer() {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }

    if (msgIndex < 0) return <></>;

    return (
        <motion.div key={msgIndex} className="flashmessage" animate={{ scale: 3, y: -50 }} initial={{ scale: 0.5, y: 0 }}>{messageList[msgIndex]}</motion.div>
    );
}