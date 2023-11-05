import React from 'react';
//@ts-ignore
import styles from './OnlineChatMessage.module.scss';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { IMessage } from '../../types';

export const OnlineChatMessage: React.FC<IMessage> = (props) => {
    return (
        <div
            className={
                props.from_contact
                    ? `${styles.messageShape} ${styles.client}`
                    : `${styles.messageShape} ${styles.manager}`
            }
        >
            <div className={styles.message}>
                <div className={styles.text}>{props.text}</div>
            </div>
            <div className={styles.time}>
                <div>{moment(props.created_at).format('HH:mm')}</div>
                <CheckOutlined />
            </div>
        </div>
    );
};
