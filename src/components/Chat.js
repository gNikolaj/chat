import React, {useContext, useEffect, useRef, useState} from 'react';
import {Context} from "../index";
import {useAuthState} from "react-firebase-hooks/auth";
import {Avatar, Button, Container, Grid, TextField} from "@mui/material";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {collection, addDoc, serverTimestamp, orderBy, query} from 'firebase/firestore';
import Loader from "./Loader";

const Chat = () => {
    const {auth, firestore} = useContext(Context);
    const [user] = useAuthState(auth);
    const [value, setValue] = useState('');
    const [messages, loading] = useCollectionData(query(collection(firestore, 'messages'), orderBy('createdAt')));

    const sendMessage = async () => {
        if (value !== '') {
            await addDoc(collection(firestore, 'messages'), {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                text: value,
                createdAt: serverTimestamp()
            });
            setValue('');
        }
    }

    const onSendMessageButtonClick = () => {
        sendMessage().then();
    }

    const onTextValueChange = e => {
        if (e.target.value.charAt(0) !== ' ') {
            setValue(e.target.value);
        }
    }

    const checkEnter = e => {
        if (e.code === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage().then();
        }
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    // {document.querySelector('.chat-content').scrollTop = document.querySelector('.chat-content').scrollHeight}

    if (loading) {
        return <Loader/>
    }

    return (
        <Container>
            <Grid container justifyContent={'center'} style={{height: window.innerHeight - 80, marginTop: '15px'}}>
                <div className='chat-content'>
                    {messages.map(message =>
                        <div className='message-content'
                             style={{marginLeft: user.uid === message.uid ? 'auto' : '10px'}}>
                            <Grid container className='grid-name-image'>
                                <Avatar src={message.photoURL}/>
                                <div className='user-name'>{message.displayName}</div>
                            </Grid>
                            <div className='message-text'>{message.text}</div>
                        </div>
                    )}
                    <div ref={messagesEndRef}/>
                </div >
                <Grid container direction={'column'} alignItems={'flex-end'} style={{width: '80%'}}>
                    <TextField multiline onKeyDown={checkEnter} className='chat-text-field' margin="normal" fullWidth maxRows={2}
                               variant='outlined' value={value}
                               onChange={onTextValueChange}
                               placeholder='Enter your message'/>
                    <Button className='send-button' onClick={onSendMessageButtonClick}
                            variant={'contained'} >Send</Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Chat;
