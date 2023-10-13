import React from 'react';
//@ts-ignore
import styles from './ChatFrameMessage.module.scss';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';

interface IChatFrameMessageProps {
    from_client: boolean;
    text: string;
    sended_at: Date;
}

export const ChatFrameMessage: React.FC<IChatFrameMessageProps> = (props) => {
    return (
        <div
            className={
                props.from_client
                    ? `${styles.messageShape} ${styles.client}`
                    : `${styles.messageShape} ${styles.manager}`
            }
        >
            <div className={styles.message}>
                <div className={styles.text}>{props.text}</div>
            </div>
            <div className={styles.time}>
                <div>{moment(props.sended_at).format('HH:mm')}</div>
                <CheckOutlined />
            </div>
        </div>
    );
};
