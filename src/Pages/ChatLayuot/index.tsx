import React from 'react';
import { Layout, List, Input, Segmented, Space } from 'antd';
import socket from '../../socket';
//@ts-ignore
import styles from './ChatLayout.module.scss';
import { ChatAdminMessage } from '../../components/ChatAdminMessage';
import axios from '../../axios';
import { ChatContact } from '../../components/ChatContact';
import { ClientInfoSider } from '../../components/ClientInfoSider/ClientInfoSider';
import { IMessage } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getChats } from '../../redux/reducers/ChatSlice';
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
    const { chats, currentChat } = useAppSelector((state) => state.chatReducer);
    const { isLoading, messages } = useAppSelector((state) => state.messageReducer);
    //@ts-ignore
    const [activeFilter, setActiveFilter] = React.useState<string | number>('Все');
    const [tgMessageData, setTgMessageData] = React.useState<IMessage | null>(null);

    const [text, setText] = React.useState('');

    const refDivMessagesSpace = React.useRef(null);
    console.log(chats);

    /* ============= FUNCTIONS ============= */

    const sortMessagesByDays = () => {
        const messagesByDay: any[] = [];
        let currentDay: any = null;
        const newMessages = messages.map((el) => el);
        newMessages
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
        if (currentChat && text) {
            const { data } = await axios.post('/messages', {
                chat_id: currentChat.id,
                text,
                from_client: false,
                chat_type: currentChat.chat_type,
                messenger_id: currentChat.messenger_id,
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
        dispatch(getChats());

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
            dispatch(getChats());
        });

        //longPooling();
        return () => {
            socket.disconnect();
        };
    }, []);

    React.useEffect(() => {
        const fx = async () => {
            console.log('отработал ТГ приемщик');
            console.log(tgMessageData);
            console.log(currentChat);
            if (tgMessageData && currentChat) {
                if (currentChat.messenger_id === tgMessageData.id) {
                    console.log(tgMessageData);
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
        if (currentChat) {
            dispatch(getAndReadMessages(currentChat.id));
            socket.emit('join', { chat_id: currentChat.id });
            dispatch(getChats());
            //setIsLoading(false);
        }
    }, [currentChat]);

    /* ============= EFFECTS END ============= */

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                {/* <Sider
            width={180}
            style={{ background: '#fff', padding: '0 20px', border: '1px solid #eee' }}
        >
            <List>
                <List.Item>Новые</List.Item>
                <List.Item>Отвеченные</List.Item>
                <List.Item>В архиве</List.Item>
            </List>
        </Sider> */}

                <Layout style={{ minHeight: '100vh' }}>
                    <Sider
                        width={320}
                        style={{
                            background: '#f3f7f9',
                            padding: '0 0px',
                            border: '1px solid #eee',
                        }}
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
                            {chats && activeFilter === 'Новые' //@ts-ignore
                                ? chats
                                      .filter((el) => el.unread_messages_count > 0 && !el.is_hidden)
                                      .map((e, index) => (
                                          <ChatContact
                                              key={index}
                                              activeChatId={currentChat?.id}
                                              {...e}
                                          />
                                      ))
                                : chats
                                      .filter((el) => el.last_message && !el.is_hidden)
                                      .map((e, index) => (
                                          <ChatContact
                                              key={index}
                                              activeChatId={currentChat?.id}
                                              {...e}
                                          />
                                      ))}
                        </List>
                    </Sider>
                    <Content>
                        <div className={styles.content}>
                            <div className={styles.chatSpace} ref={refDivMessagesSpace}>
                                {!messages ? (
                                    <div>123</div>
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
                                            <ChatAdminMessage
                                                key={index}
                                                {...el}
                                                client_name={currentChat!.client_name!}
                                                chat_type={currentChat!.chat_type}
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
                                                client_name={currentChat!.client_name!}
                                                chat_type={currentChat!.chat_type}
                                            />
                                        );
                                    })
                                ) : (
                                    <Spinner />
                                )} */}
                            </div>

                            <div className={styles.inputHolder}>
                                <TextArea
                                    disabled={currentChat ? false : true}
                                    value={text}
                                    className={styles.textArea}
                                    onChange={(e) => {
                                        setText((pred) => e.target.value);
                                    }}
                                    onKeyDown={(e) => handlerPressEnter(e)}
                                    placeholder="написать сообщение"
                                    autoSize={{ minRows: 4, maxRows: 6 }}
                                />
                                <button disabled={!currentChat} onClick={sendMessage}>
                                    Отправить
                                </button>
                            </div>
                        </div>
                    </Content>
                    {currentChat !== null ? (
                        //@ts-ignore
                        <ClientInfoSider {...currentChat} />
                    ) : (
                        <></>
                    )}
                </Layout>
            </Layout>
        </>
    );
};
