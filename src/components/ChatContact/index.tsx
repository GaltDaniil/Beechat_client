import { Avatar, List } from 'antd';
import React from 'react';
//@ts-ignore
import styles from './ChatContact.module.scss';
import moment from 'moment';
import 'moment/locale/ru';
import { IChatResponse } from '../../types';
import { useAppDispatch } from '../../hooks/redux';
import { setCurrentChat } from '../../redux/reducers/ChatSlice';
//import { CloseOutlined } from '@ant-design/icons';

interface IProps extends IChatResponse {
    client_phone: string;
    last_message_sended_at: Date;
    unread_messages_count: number;
    activeChatId?: number;
}

export const ChatContact: React.FC<IProps> = (props) => {
    const dispatch = useAppDispatch();

    const changeChatId = () => {
        //@ts-ignore
        //props.setActiveChatId((pred) => props.id);
        dispatch(setCurrentChat(props.id));
    };
    /*  const deleteThisChat = () => {
        console.log('клик по делит');
        dispatch(deleteChat(props.id));
        dispatch(getChats());
    }; */

    return (
        <div className={styles.container}>
            <List.Item
                className={
                    props.activeChatId === props.id
                        ? `${styles.item} ${styles.checked}`
                        : styles.item
                }
                style={{ padding: '14px 10px' }}
                key={props.id}
                onClick={() => {
                    changeChatId();
                }}
            >
                <List.Item.Meta
                    avatar={
                        <Avatar
                            style={{ width: '52px', height: '52px' }}
                            src={`https://beechat.ru/${props.avatar}`}
                        />
                    }
                    title={
                        <a className={styles.name}>
                            {props.from_messenger === 'beeChat' && !props.client_name
                                ? 'Онлайн чат'
                                : props.client_name || props.client_custom_fields.tg_name}
                        </a>
                    }
                    description={<div className={styles.description}>{props.last_message}</div>}
                />
                {/* <div className={styles.onlineIcon}></div> */}
                <div className={styles.info}>
                    {props.unread_messages_count && props.unread_messages_count > 0 ? (
                        <div className={styles.newMessages}>{props.unread_messages_count}</div>
                    ) : null}
                    <div className={styles.time}>
                        {props.last_message_sended_at
                            ? moment(props.last_message_sended_at).format('D MMM HH:mm')
                            : ''}
                    </div>
                </div>
            </List.Item>
            {/* <div
                onClick={() => {
                    deleteThisChat();
                }}
                className={styles.deleteBtn}
            >
                <CloseOutlined />
            </div> */}
        </div>
    );
};
