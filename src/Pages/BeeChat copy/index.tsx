import React from 'react';
import {
    CloseOutlined,
    ExclamationCircleOutlined,
    MessageOutlined,
    SendOutlined,
    UpCircleOutlined,
    WechatOutlined,
} from '@ant-design/icons';
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

    const [isOpenChat, setIsOpenChat] = React.useState(false);
    const [isOpenMessengers, setIsOpenMessengers] = React.useState(false);
    const [beechat, setBeechat] = React.useState('');
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

    React.useEffect(() => {
        socket.on('newMessage', (data: IMessage) => {
            if (!data.from_client) setMessages((pred) => [...pred, data]);
        });

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
        const { data } = await axios.post('/messages', {
            chat_id: beechat,
            text,
            from_client: true,
        });
        setMessages((pred) => [...pred, data]);
        socket.emit('sendMessage', data);
        setText((prev) => '');
    };

    const openChat = async () => {
        let localStorageBeeChatId: string | null = window.localStorage.getItem('beechat');
        let newBeeChatId;
        if (!localStorageBeeChatId) {
            const { data } = await axios.post('/chats', {
                account_id,
                from_messenger: 'beeChat',
            });
            window.localStorage.setItem('beechat', data.id);
            setBeechat((pred) => data.id);
            newBeeChatId = data.id;
        } else {
            setBeechat((pred) => localStorageBeeChatId!);
            newBeeChatId = Number(localStorageBeeChatId);
            const { data } = await axios.get(`/chats/${localStorageBeeChatId}`);
            console.log(data);
            //@ts-ignore
            if (data.client_id) setInfoShapeIsActive(false);
        }
        const { data } = await axios.get(`/messages?chat_id=${newBeeChatId}`);

        setMessages((prev) => data.sort());

        socket.emit('join', { chat_id: newBeeChatId });

        setIsOpenChat(true);
        setIsOpenMessengers(true);
    };

    const openWidgets = () => {
        setIsOpenChat((pred) => false);
        setIsOpenMessengers((pred) => true);
    };

    const closeAll = () => {
        setIsOpenChat((pred) => false);
        setIsOpenMessengers((pred) => false);
    };

    const sendLeadInfo = async () => {
        await axios.post('/clients/create-from-chat', {
            account_id,
            chat_id: beechat,
            from_messenger: 'beechat',
            name,
            phone,
            description,
        });

        setLeadShapeIsActive(false);
        setInfoShapeIsActive(false);
    };

    return !isOpenMessengers && !isOpenChat ? (
        <div className={styles.btnPosition}>
            <button className={styles.mainBtn} onClick={() => openWidgets()}>
                <WechatOutlined style={{ fontSize: '34px', color: '#fff' }} />
            </button>
        </div>
    ) : isOpenMessengers && !isOpenChat ? (
        <div className={styles.btnPosition}>
            {/* <button onClick={() => {}}>Вотс</button> */}
            <button onClick={() => {}}>
                <a
                    target="_blank"
                    href={`https://t.me/Linnik_fitness_helpBot?start=chatId=tg${beechat}-clientId=${account_id}`}
                    rel="noreferrer"
                >
                    <img src="./telegram.png" alt="" />
                </a>
            </button>
            <button className={styles.mainBtn} onClick={() => openChat()}>
                <MessageOutlined style={{ fontSize: '34px', color: '#fff' }} />
            </button>
            <button className={styles.closeBtn} onClick={() => closeAll()}>
                <CloseOutlined style={{ fontSize: '20px', color: 'orange' }} />
            </button>
        </div>
    ) : (
        <div className={styles.app}>
            <div className={styles.header}>
                <div>
                    <img src="./logo192.png" alt="" />
                    <p>Имя менеджера</p>
                </div>

                <CloseOutlined onClick={() => closeAll()} className={styles.close_chat} />
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
                            <UpCircleOutlined
                                onClick={() => {
                                    setInfoShapeIsActive(false);
                                }}
                            />
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
                    value={text}
                    className={styles.textarea}
                    onChange={(e) => setText((pred) => e.target.value)}
                    placeholder="Написать сообщение..."
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />

                <SendOutlined onClick={() => sendMessage()} className={styles.send} />
            </div>
        </div>
    );
};
