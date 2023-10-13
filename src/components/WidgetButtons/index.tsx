import React from 'react';
//@ts-ignore
import styles from './WidgetButtons.module.scss';
//import { useAppDispatch } from '../../hooks/redux';
//import axios from '../../axios';

export const WidgetButtons = () => {
    //const dispatch = useAppDispatch();

    //const [chat_id, setChat_id] = React.useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const account_id = urlParams.get('accountId');

    var messageToParent = {
        action: 'showLiveChat', // Например, сообщение о показе live chat
    };

    // Отправляем сообщение родительскому документу
    const sendMessageFromIframe = () => {
        window.parent.postMessage(messageToParent, '*');
    };

    /* React.useEffect(() => {
        const openWidgets = async () => {
            let localStorageBeeChatId: string | null = window.localStorage.getItem('beechat');
            let newChatId;
            if (!localStorageBeeChatId && account_id) {
                const { data } = await axios.post('/chats', {
                    account_id,
                    from_messenger: 'beeChat',
                });
                window.localStorage.setItem('beechat', data.id);
            } else {
                setChat_id((pred) => localStorageBeeChatId!);
                newChatId = Number(localStorageBeeChatId);
                const { data } = await axios.get(`/chats/${localStorageBeeChatId}`);
                console.log(data);
                //@ts-ignore
                if (data.client_id) setInfoShapeIsActive(false);
            }

            socket.emit('join', { chat_id: newChatId });

        };
        openChat();
    }, []); */

    return (
        <div className={styles.buttomsContainer}>
            <div className={styles.telegram}>
                <a
                    target="_blank"
                    href={`https://t.me/LF_support_bot?start=accountId=${account_id}`}
                    rel="noreferrer"
                >
                    <img
                        src="https://cdn.iconscout.com/icon/free/png-256/free-telegram-3691230-3073750.png"
                        alt="tg"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            <div
                onClick={() => {
                    sendMessageFromIframe();
                }}
                className={styles.livechat}
            >
                {/* <a target="_blank" href={`http://localhost:3000/livechat`} rel="noreferrer"> */}
                <img
                    src="https://icon-library.com/images/white-chat-icon/white-chat-icon-27.jpg"
                    alt="livechat"
                    width={27}
                    height={27}
                />
                {/* </a> */}
            </div>
        </div>
    );
};