import React from 'react';
//@ts-ignore
import { CloseOutlined, ExclamationCircleOutlined, SendOutlined } from '@ant-design/icons';
import { OnlineChatMessage } from '../../components/OnlineChatMessage';
import { Avatar, ConfigProvider, Input, Segmented, Space } from 'antd';

//@ts-ignore
import styles from './beeChat.module.scss';
import socket from '../../socket';
import axios from '../../axios';
import { IContact, IMessage } from '../../types';

const { TextArea } = Input;

export const BeeChat: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const [text, setText] = React.useState('');
    const [contact_id, setContactId] = React.useState<number | null>(null);
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const [infoShapeIsActive, setInfoShapeIsActive] = React.useState(true);
    const [leadShapeIsActive, setLeadShapeIsActive] = React.useState(false);
    const [contact_name, setName] = React.useState('');
    const [contact_phone, setPhone] = React.useState('');
    const [fromUrl, setFromUrl] = React.useState('');
    const [isMessenger, setIsMessenger] = React.useState<string | number>('telegram');

    const contentDivRef = React.useRef(null);

    const urlParams = new URLSearchParams(window.location.search);
    const account_id = urlParams.get('accountId');

    React.useEffect(() => {
        socket.on('newMessage', (data: IMessage) => {
            if (!data.from_contact) setMessages((pred) => [...pred, data]);
        });
        window.addEventListener('message', (event: MessageEvent<any>) => {
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
        if (isChatOpen) {
            const loadingChat = async () => {
                let localStorageContactId: number | undefined = Number(
                    window.localStorage.getItem('beechat'),
                );
                console.log('localStorageContactId is', localStorageContactId);
                if (localStorageContactId !== undefined) {
                    const { data } = await axios.get<IContact>(
                        `/contacts/${localStorageContactId}`,
                    );
                    if (data) {
                        setContactId((prev) => data.id);
                        if (data.contact_name) setInfoShapeIsActive(false);
                        const getMessages = await axios.get(`/messages?contact_id=${data.id}`);
                        setMessages((prev) => getMessages.data.sort());
                        socket.emit('join', { contact_id: Number(data.id) });
                    } else {
                        window.localStorage.removeItem('beechat');
                    }
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
                const messageDate = new Date(message.created_at).toLocaleDateString();
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
        if (!contact_id) {
            const newContact = await axios.post('/contacts', {
                account_id,
                messenger_id: 0,
                from_url: fromUrl,
                messenger_type: 'beechat',
            });
            window.localStorage.setItem('beechat', newContact.data.id.toString());
            setContactId((pred) => newContact.data.id);
            socket.emit('join', { contact_id: newContact.data.id });

            const newMessage = await axios.post('/messages', {
                contact_id: newContact.data.id,
                text,
                from_contact: true,
            });
            setMessages((pred) => [...pred, newMessage.data]);
            socket.emit('sendMessage', newMessage.data);
            setText((prev) => '');
        } else {
            const { data } = await axios.post('/messages', {
                contact_id,
                text,
                from_contact: true,
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
        await axios.patch('/contacts/update', {
            contact_id,
            contact_name,
            contact_phone,
            isMessenger,
        });

        setLeadShapeIsActive(false);
        setInfoShapeIsActive(false);
    };
    console.log(isMessenger);
    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <div>
                    <img src="./lf_logo.jpeg" alt="" />
                    <p>Онлайн поддержка</p>
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
                                    <b>Нет времени ждать ответа?</b> Оставьте свои данные и мы
                                    свяжемся с вами, как только сможем.
                                </p>

                                <p
                                    onClick={() => {
                                        setLeadShapeIsActive((prev) => !prev);
                                    }}
                                    className={styles.pLink}
                                >
                                    {leadShapeIsActive ? 'Закрыть' : 'Оставить телефон'}
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
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Segmented: {
                                                itemSelectedBg: 'orange',
                                            },
                                        },
                                    }}
                                >
                                    <Space direction="vertical">
                                        <Segmented
                                            onChange={setIsMessenger}
                                            value={isMessenger}
                                            options={[
                                                {
                                                    label: (
                                                        <div style={{ padding: 4 }}>
                                                            <Avatar src="https://beechat.ru/imgs/messengerIcon/telegram.jpg" />
                                                        </div>
                                                    ),
                                                    value: 'telegram',
                                                },
                                                {
                                                    label: (
                                                        <div style={{ padding: 4 }}>
                                                            <Avatar src="https://beechat.ru/imgs/messengerIcon/wa.png" />
                                                        </div>
                                                    ),
                                                    value: 'wa',
                                                },
                                                {
                                                    label: (
                                                        <div style={{ padding: 4 }}>
                                                            <Avatar src="https://beechat.ru/imgs/messengerIcon/viber.png" />
                                                        </div>
                                                    ),
                                                    value: 'viber',
                                                },
                                            ]}
                                        />
                                    </Space>
                                </ConfigProvider>
                                <button
                                    onClick={() => {
                                        sendLeadInfo();
                                    }}
                                    disabled={contact_name && contact_phone ? false : true}
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
                        return <OnlineChatMessage key={index} {...el} />;
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
