import React from 'react';
//@ts-ignore
import styles from './ChatMessage.module.scss';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';

interface IChatAdminMessageProps {
    id: number;
    sended_at: Date;
    text: string;
    chat_id: string;
    from_client: boolean;
    is_readed: boolean;
    client_name: string;
    chat_type: string;
}

export const ChatAdminMessage: React.FC<IChatAdminMessageProps> = (props) => {
    return (
        <div
            className={
                props.from_client
                    ? `${styles.messageShape} ${styles.client}`
                    : `${styles.messageShape} ${styles.manager}`
            }
        >
            <div className={styles.message}>
                <div className={styles.name}>
                    {props.from_client && props.chat_type === 'beeChat'
                        ? 'Онлайн чат'
                        : props.client_name && props.from_client
                        ? props.client_name
                        : 'Менеджер'}
                </div>
                <div className={styles.text}>{props.text}</div>
            </div>
            <div className={styles.time}>
                <span>{moment(props.sended_at).format('HH:mm')}</span>
                {props.is_readed ? (
                    <div className={styles.isreaded}>
                        <CheckOutlined />
                        <CheckOutlined className={styles.doneIcon} />
                    </div>
                ) : (
                    <CheckOutlined />
                )}
            </div>
        </div>
    );
};
