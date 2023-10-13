import React from 'react';
//@ts-ignore
import { CloseOutlined, ExclamationCircleOutlined, SendOutlined } from '@ant-design/icons';
import { ChatFrameMessage } from '../../components/ChatMessage';
import { Input } from 'antd';

//@ts-ignore
import styles from './beeChat.module.scss';
import socket from '../../socket';
import axios from '../../axios';
import { IMessage } from '../../types';

const { TextArea } = Input;

export const BeeChat: React.FC = () => {
    const [text, setText] = React.useState('');

    /*     const [isOpenChat, setIsOpenChat] = React.useState(false);
    const [isOpenMessengers, setIsOpenMessengers] = React.useState(false); */
    const [chat_id, setChatId] = React.useState('');
    const [messages, setMessages] = React.useState<IMessage[]>([]);

    const [infoShapeIsActive, setInfoShapeIsActive] = React.useState(true);
    const [leadShapeIsActive, setLeadShapeIsActive] = React.useState(false);
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [description, setDescription] = React.useState('');
    //const [fromUrl, setFromUrl] = React.useState('');

    const contentDivRef = React.useRef(null);
    const urlParams = new URLSearchParams(window.location.search);
    const account_id = urlParams.get('accountId');

    console.log('а это тоже видно?');

    React.useEffect(() => {
        socket.on('newMessage', (data: IMessage) => {
            if (!data.from_client) setMessages((pred) => [...pred, data]);
        });

        const loadingChat = async () => {
            let localStorageBeeChatId: string | null = window.localStorage.getItem('beechat');
            let newBeeChatId;
            if (localStorageBeeChatId) {
                setChatId((pred) => localStorageBeeChatId!);
                newBeeChatId = Number(localStorageBeeChatId);
                const resultFromChat = await axios.get(`/chats/${localStorageBeeChatId}`);
                //@ts-ignore
                if (resultFromChat.data.client_id) setInfoShapeIsActive(false);
                const resultFromMessages = await axios.get(
                    `/messages?chat_id=${resultFromChat.data.id}`,
                );

                setMessages((prev) => resultFromMessages.data.sort());
                socket.emit('join', { chat_id: newBeeChatId });
            }
        };
        loadingChat();

        return () => {
            socket.disconnect();
        };
    }, []);

    React.useEffect(() => {
        if (contentDivRef.current) {
            //@ts-ignore
            contentDivRef.current.scrollTop = contentDivRef.current.scrollHeight;
        }
    }, [messages]);

    const sortMessagesByDays = () => {
        const messagesByDay: any[] = [];
        let currentDay: any = null;

        messages
            //@ts-ignore
            .sort((a, b) => new Date(a.sended_at) - new Date(b.sended_at))
            .forEach((message) => {
                const messageDate = new Date(message.sended_at).toLocaleDateString();
                if (messageDate !== currentDay) {
                    currentDay = messageDate;
                    messagesByDay.push({
                        //@ts-ignore
                        type: 'date',
                        date: messageDate,
                    });
                }
                messagesByDay.push(message);
                //setMessages((prev) => messagesByDay);
            });
        return messagesByDay;
    };
    const sendMessage = async () => {
        if (!chat_id) {
            const resultFromChat = await axios.post('/chats', {
                account_id,
                from_messenger: 'beeChat',
            });
            console.log(resultFromChat.data.id);
            window.localStorage.setItem('beechat', resultFromChat.data.id);
            setChatId((pred) => resultFromChat.data.id);

            socket.emit('join', { chat_id: resultFromChat.data.id });

            const resultFromMessage = await axios.post('/messages', {
                chat_id: resultFromChat.data.id,
                text,
                from_client: true,
            });
            console.log(resultFromMessage.data);
            setMessages((pred) => [...pred, resultFromMessage.data]);
            socket.emit('sendMessage', resultFromMessage.data);
            setText((prev) => '');
        } else {
            const { data } = await axios.post('/messages', {
                chat_id: Number(chat_id),
                text,
                from_client: true,
            });
            setMessages((pred) => [...pred, data]);
            socket.emit('sendMessage', data);
            setText((prev) => '');
        }
    };

    const handlerPressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
        }
    };

    const closeLiveChat = () => {
        window.parent.postMessage({ action: 'hideLiveChat' }, '*');
    };

    /* const openWidgets = () => {
        setIsOpenChat((pred) => false);
        setIsOpenMessengers((pred) => true);
    }; */

    /* const closeAll = () => {
        setIsOpenChat((pred) => false);
        setIsOpenMessengers((pred) => false);
    }; */

    const sendLeadInfo = async () => {
        await axios.post('/clients/create-from-chat', {
            account_id,
            chat_id,
            from_messenger: 'beechat',
            name,
            phone,
            description,
        });

        setLeadShapeIsActive(false);
        setInfoShapeIsActive(false);
    };

    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <div>
                    <img src="./logo192.png" alt="" />
                    <p>Имя менеджера</p>
                </div>
                <CloseOutlined onClick={() => closeLiveChat()} className={styles.close_chat} />
            </div>
            <div className={styles.space}>
                {infoShapeIsActive ? (
                    <div className={styles.leadAndInfoShape}>
                        <div className={styles.infoShape}>
                            <ExclamationCircleOutlined />
                            <div>
                                <p>
                                    Оставьте контактные данные, чтобы получить ответ после закрытия
                                    этого чата.
                                </p>
                                <p
                                    onClick={() => {
                                        setLeadShapeIsActive(true);
                                    }}
                                    className={styles.pLink}
                                >
                                    Оставить контактные данные
                                </p>
                            </div>
                        </div>

                        {leadShapeIsActive ? (
                            <div className={styles.leadShape}>
                                <span>Имя*</span>
                                <input
                                    onChange={(e) => {
                                        setName((prev) => e.target.value);
                                    }}
                                    type="text"
                                />
                                <span>Телефон*</span>
                                <input
                                    onChange={(e) => {
                                        setPhone((prev) => e.target.value);
                                    }}
                                    type="text"
                                />
                                <span>Мессенджер для связи*</span>
                                <input
                                    onChange={(e) => {
                                        setDescription((prev) => e.target.value);
                                    }}
                                    type="text"
                                />
                                <button
                                    onClick={() => {
                                        sendLeadInfo();
                                    }}
                                    disabled={name && phone && description ? false : true}
                                >
                                    Отправить
                                </button>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div ref={contentDivRef} className={styles.content}>
                    {sortMessagesByDays().map((el, index) => {
                        if (el.type === 'date') {
                            return (
                                <div key={index} className={styles.dates}>
                                    {el.date === new Date().toLocaleDateString()
                                        ? 'Сегодня'
                                        : el.date}
                                </div>
                            );
                        }
                        return <ChatFrameMessage key={index} {...el} />;
                    })}
                </div>
                <div className={styles.contactShape}></div>
            </div>
            <div className={styles.input}>
                <TextArea
                    id="textarea"
                    value={text}
                    className={styles.textarea}
                    onChange={(e) => setText((pred) => e.target.value)}
                    onKeyDown={(e) => handlerPressEnter(e)}
                    placeholder="Написать сообщение..."
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />

                <SendOutlined onClick={() => sendMessage()} className={styles.send} />
            </div>
        </div>
    );
};
