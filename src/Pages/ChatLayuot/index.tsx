import React from 'react';
import { Layout, List, Input, Segmented, Space } from 'antd';
import socket from '../../socket';
//@ts-ignore
import styles from './ChatLayout.module.scss';
import { AdminChatMessage } from '../../components/AdminChatMessage';
import axios from '../../axios';
import { ChatContact } from '../../components/ChatContact';
import { ContactInfoSider } from '../../components/ContactInfoSider';
import { IMessage } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getManyContacts } from '../../redux/reducers/ContactSlice';
import { Spinner } from '../../components/Spinner';
import {
    addNewMessage,
    getAndReadMessages,
    readOneMessages,
} from '../../redux/reducers/MessageSlice';
//import { Spinner } from '../../components/Spinner';
//@ts-ignore
const { Sider, Content } = Layout;
const { TextArea } = Input;

// "ОНЛАЙН"
/* type OnlineUsers = {
    [key: string]: any;
}; */

export const ChatLayuot = () => {
    const dispatch = useAppDispatch();
    const { contacts, currentContact } = useAppSelector((state) => state.contactReducer);
    const { isLoading, messages } = useAppSelector((state) => state.messageReducer);
    //@ts-ignore
    const [activeFilter, setActiveFilter] = React.useState<string | number>('Все');
    const [tgMessageData, setTgMessageData] = React.useState<IMessage | null>(null);

    const [text, setText] = React.useState('');

    const refDivMessagesSpace = React.useRef(null);

    console.log('messages', messages);

    /* ============= FUNCTIONS ============= */

    const sortMessagesByDays = () => {
        const messagesByDay: any[] = [];
        let currentDay: any = null;
        const newMessages = messages.map((el) => el);
        newMessages
            //@ts-ignore
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
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
        if (currentContact && text) {
            const { data } = await axios.post('/messages', {
                contact_id: currentContact.id,
                text,
                from_contact: false,
                messenger_type: currentContact.messenger_type,
                messenger_id: currentContact.messenger_id,
                instagram_chat_id: currentContact.instagram_chat_id,
            });
            socket.emit('sendMessage', data);
            setText((prev) => '');
        }
    };

    const handlerPressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage();
        }
    };
    /* ============= FUNCTIONS END ============= */

    /* ============= EFFECTS ============= */

    React.useEffect(() => {
        dispatch(getManyContacts());

        socket.on('newMessage', async (dataMessage: IMessage) => {
            console.log('отработал NewMessage');
            const data = await dispatch(readOneMessages(dataMessage.id));
            console.log(data);
            dispatch(addNewMessage(data.payload));
        });

        socket.on('sendMessengerMessage', async (data) => {
            setTgMessageData((prev) => data);
        });
        socket.on('update', () => {
            console.log('update');
            dispatch(getManyContacts());
        });

        //longPooling();
        return () => {
            socket.disconnect();
        };
    }, []);

    React.useEffect(() => {
        const fx = async () => {
            if (tgMessageData && currentContact) {
                if (currentContact.id === tgMessageData.contact_id) {
                    //@ts-ignore
                    dispatch(readOneMessages(tgMessageData.id));
                    dispatch(addNewMessage(tgMessageData));
                }
            }
        };
        fx();
        //@ts-ignore
    }, [tgMessageData]);

    React.useEffect(() => {
        if (refDivMessagesSpace.current) {
            //@ts-ignore
            refDivMessagesSpace.current.scrollTop = refDivMessagesSpace.current.scrollHeight;
        }
    }, [messages]);

    React.useEffect(() => {
        //setIsLoading(true);
        if (currentContact) {
            dispatch(getAndReadMessages(currentContact.id));
            socket.emit('join', { contact_id: currentContact.id });
            dispatch(getManyContacts());
        }
    }, [currentContact]);

    /* ============= EFFECTS END ============= */

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider
                        width={320}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            background: '#fff',
                            padding: '0 0px',
                            border: '1px solid #eee',
                            overflow: 'hidden',
                        }}
                        className={styles.chatsHolder}
                    >
                        <h4 className={styles.title}>Диалоги</h4>
                        <Space direction="vertical">
                            <Segmented
                                style={{ marginLeft: '10px' }}
                                onChange={setActiveFilter}
                                value={activeFilter}
                                options={['Все', 'Новые']}
                            />
                        </Space>
                        <List className={styles.chatList}>
                            {contacts && activeFilter === 'Новые' //@ts-ignore
                                ? contacts
                                      .filter((el) => el.unread_messages_count > 0 && !el.is_hidden)
                                      .map((e, index) => (
                                          <ChatContact
                                              key={index}
                                              activeContactId={currentContact?.id}
                                              {...e}
                                          />
                                      ))
                                : contacts
                                      .filter((el) => el.last_message && !el.is_hidden)
                                      .map((e, index) => (
                                          <ChatContact
                                              key={index}
                                              activeContactId={currentContact?.id}
                                              {...e}
                                          />
                                      ))}
                        </List>
                    </Sider>
                    <Content>
                        <div className={styles.content}>
                            <div className={styles.chatSpace} ref={refDivMessagesSpace}>
                                {!messages.length ? (
                                    <div className={styles.emptySpace}>
                                        <img
                                            src="https://beechat.ru/imgs/messengerIcon/empty_messages.png"
                                            alt="empty"
                                        />
                                        <p>Выберите контакт, чтобы увидеть сообщения</p>
                                    </div>
                                ) : !isLoading ? (
                                    sortMessagesByDays().map((el, index) => {
                                        if (el.type === 'date') {
                                            return (
                                                <div key={index} className={styles.dates}>
                                                    {el.date === new Date().toLocaleDateString()
                                                        ? 'Сегодня'
                                                        : el.date}
                                                </div>
                                            );
                                        }
                                        return (
                                            <AdminChatMessage
                                                key={index}
                                                {...el}
                                                contact_name={currentContact!.contact_name!}
                                                messenger_type={currentContact!.messenger_type}
                                            />
                                        );
                                    })
                                ) : (
                                    <Spinner />
                                )}
                                {/* {!isLoading ? (
                                    sortMessagesByDays().map((el, index) => {
                                        if (el.type === 'date') {
                                            return (
                                                <div key={index} className={styles.dates}>
                                                    {el.date === new Date().toLocaleDateString()
                                                        ? 'Сегодня'
                                                        : el.date}
                                                </div>
                                            );
                                        }
                                        return (
                                            <ChatAdminMessage
                                                key={index}
                                                {...el}
                                                client_name={currentContact!.client_name!}
                                                messenger_type={currentContact!.messenger_type}
                                            />
                                        );
                                    })
                                ) : (
                                    <Spinner />
                                )} */}
                            </div>

                            {!messages.length ? null : (
                                <div className={styles.inputHolder}>
                                    <TextArea
                                        disabled={currentContact ? false : true}
                                        value={text}
                                        className={styles.textArea}
                                        onChange={(e) => {
                                            setText((pred) => e.target.value);
                                        }}
                                        onKeyDown={(e) => handlerPressEnter(e)}
                                        placeholder="написать сообщение"
                                        autoSize={{ minRows: 4, maxRows: 6 }}
                                    />
                                    <button disabled={!currentContact} onClick={sendMessage}>
                                        Отправить
                                    </button>
                                </div>
                            )}
                        </div>
                    </Content>
                    {currentContact !== null ? (
                        //@ts-ignore
                        <ContactInfoSider {...currentContact} />
                    ) : (
                        <></>
                    )}
                </Layout>
            </Layout>
        </>
    );
};
