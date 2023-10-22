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
    const [isChatOpen, setIsChatOpen] = React.useState(false);

    const [text, setText] = React.useState('');

    const [chat_id, setChatId] = React.useState<number | null>(null);

    const [messages, setMessages] = React.useState<IMessage[]>([]);

    const [infoShapeIsActive, setInfoShapeIsActive] = React.useState(true);
    const [leadShapeIsActive, setLeadShapeIsActive] = React.useState(false);
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [fromUrl, setFromUrl] = React.useState('');

    const contentDivRef = React.useRef(null);

    const urlParams = new URLSearchParams(window.location.search);
    const account_id = urlParams.get('accountId');

    React.useEffect(() => {
        socket.on('newMessage', (data: IMessage) => {
            if (!data.from_client) setMessages((pred) => [...pred, data]);
        });
        window.addEventListener('message', (event: MessageEvent<any>) => {
            console.log(event);
            console.log(event.data);
            if (event.data.action === 'showLiveChat') {
                setIsChatOpen((prev) => true);
                const location = event.data.location as string;
                setFromUrl((prev) => location);
            }
        });
    }, []);

    React.useEffect(() => {
        if (contentDivRef.current) {
            //@ts-ignore
            contentDivRef.current.scrollTop = contentDivRef.current.scrollHeight;
        }
    }, [messages]);

    //Срабатывает только если чат открывается. Проверяет в localstoeage наличие message_id
    React.useEffect(() => {
        console.log('запустилась загрузка чатов при открытии');
        if (isChatOpen) {
            const loadingChat = async () => {
                let localStorageBeeChatId: string | null = window.localStorage.getItem('beechat');
                if (localStorageBeeChatId) {
                    const { data } = await axios.get(`/chats/${localStorageBeeChatId}`);
                    setChatId((prev) => data.id);

                    if (data.client_id) setInfoShapeIsActive(false);
                    const getMessages = await axios.get(`/messages?chat_id=${data.id}`);
                    setMessages((prev) => getMessages.data.sort());
                    console.log('Запустился Join');
                    socket.emit('join', { chat_id: Number(data.id) });
                }
            };
            loadingChat();
        }
    }, [isChatOpen]);

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
            const messenger_id = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
            window.localStorage.setItem('beechat', messenger_id.toString());
            const resultFromChat = await axios.post('/chats', {
                account_id,
                messenger_id,
                chat_type: 'beeChat',
            });
            setChatId((pred) => resultFromChat.data.id);
            console.log('Запустился Join');
            socket.emit('join', { chat_id: resultFromChat.data.id });

            const resultFromMessage = await axios.post('/messages', {
                chat_id: resultFromChat.data.id,
                text,
                from_client: true,
            });
            setMessages((pred) => [...pred, resultFromMessage.data]);
            socket.emit('sendMessage', resultFromMessage.data);
            setText((prev) => '');
        } else {
            const { data } = await axios.post('/messages', {
                chat_id,
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

    const sendLeadInfo = async () => {
        await axios.post('/clients/create-from-chat', {
            account_id,
            chat_id,
            chat_type: 'beechat',
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
