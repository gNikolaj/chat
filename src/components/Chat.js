import React, {useContext, useState} from 'react';
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
    const [messages, loading] = useCollectionData(query(collection(firestore,'messages'), orderBy('createdAt')));

    const sendMessage = async () => {
        await addDoc(collection(firestore, 'messages'), {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            text: value,
            createdAt: serverTimestamp()
        });
        setValue('');
    }

    if (loading) {
        return <Loader/>
    }

    return (
        <Container>
            <Grid container justifyContent={'center'} style={{height: window.innerHeight - 50, marginTop: '20px'}}>
                <div style={{width: '80%', height: '70vh', border: '1px solid gray', overflowY: 'auto'}}>
                    {messages.map(message =>
                        <div style={{margin: '10px', marginLeft: user.uid === message.uid ? 'auto' : '10px', width: 'fit-content'}}>
                            <Grid container >
                                <Avatar src={message.photoURL}/>
                                <div>{message.displayName}</div>
                            </Grid>
                            <div>{message.text}</div>
                        </div>
                    )}
                </div>
                <Grid container direction={'column'} alignItems={'flex-end'} style={{width: '80%'}}>
                    <TextField fullWidth maxRows={2} variant={"outlined"} value={value}
                               onChange={e => setValue(e.target.value)}/>
                    <Button onClick={sendMessage} variant={'outlined'}>Send</Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Chat;
