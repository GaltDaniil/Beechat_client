import React from 'react';
//@ts-ignore
import styles from './AdminChatMessage.module.scss';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { IMessage } from '../../types';

interface IProps extends IMessage {
    contact_name: string;
    messenger_type: 'telegram' | 'instagram' | 'whatsapp' | 'vk' | 'beechat';
}

export const AdminChatMessage: React.FC<IProps> = (props) => {
    return (
        <div
            className={
                props.from_contact
                    ? `${styles.messageShape} ${styles.client}`
                    : `${styles.messageShape} ${styles.manager}`
            }
        >
            <div className={styles.message}>
                <div className={styles.name}>
                    {props.from_contact && props.messenger_type === 'beechat'
                        ? 'Онлайн чат'
                        : props.contact_name && props.from_contact
                        ? props.contact_name
                        : 'Менеджер'}
                </div>
                <div className={styles.text}>{props.text}</div>
            </div>
            <div className={styles.time}>
                <span>{moment(props.created_at).format('HH:mm')}</span>
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
