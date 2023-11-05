import { Avatar, List } from 'antd';
import React from 'react';
//@ts-ignore
import styles from './ChatContact.module.scss';
import moment from 'moment';
import 'moment/locale/ru';
import { IContactResponse } from '../../types';
import { useAppDispatch } from '../../hooks/redux';
import { setCurrentContact } from '../../redux/reducers/ContactSlice';
//import { CloseOutlined } from '@ant-design/icons';
//import { CloseOutlined } from '@ant-design/icons';

interface IProps extends IContactResponse {
    last_message_created_at: Date;
    last_message_from_contact: boolean;
    unread_messages_count: number;
    activeContactId?: number;
}

export const ChatContact: React.FC<IProps> = (props) => {
    const dispatch = useAppDispatch();

    console.log(props);

    const changeContactId = () => {
        dispatch(setCurrentContact(props.id));
    };

    const dateGenerator = () => {
        const currentDate = moment(); // Текущая дата и время
        const dateFromDatabase = moment(props.last_message_created_at);

        // Разница в днях
        const daysDiff = currentDate.diff(dateFromDatabase, 'days');

        // Проверка на "Вчера"
        if (daysDiff === 1) {
            return `Вчера в ${dateFromDatabase.format('HH:mm')}`;
        } else if (daysDiff === 0) {
            // Проверка на "Сегодня"
            return `Сегодня в ${dateFromDatabase.format('HH:mm')}`;
        } else if (daysDiff <= 7) {
            return `${dateFromDatabase.format('dddd')} в ${dateFromDatabase.format('HH:mm')}`;
        } else {
            return `${dateFromDatabase.format('DD MMM. в HH:mm')}`;
        }
    };

    return (
        <div className={styles.container}>
            <List.Item
                className={
                    props.activeContactId === props.id
                        ? `${styles.item} ${styles.checked}`
                        : styles.item
                }
                style={{ padding: '10px 8px' }}
                key={props.id}
                onClick={() => {
                    changeContactId();
                }}
            >
                <List.Item.Meta
                    avatar={
                        <div className={styles.avatarHolder}>
                            <Avatar
                                style={{ width: '44px', height: '44px' }}
                                src={`https://beechat.ru/${props.contact_avatar}`}
                            />
                            {props.unread_messages_count && props.unread_messages_count > 0 ? (
                                <div className={styles.newMessages}>
                                    {props.unread_messages_count}
                                </div>
                            ) : null}
                        </div>
                    }
                    title={
                        <div className={styles.nameHolder}>
                            <a className={styles.name}>
                                {props.contact_name ? props.contact_name : 'неизвестно'}
                            </a>
                            <div className={styles.dateAndTime}>
                                {props.last_message_created_at ? dateGenerator() : ''}
                            </div>
                        </div>
                    }
                    description={
                        <div className={styles.descriptionHolder}>
                            <div className={styles.description}>
                                {props.last_message_from_contact ? '' : 'Вы: '}
                                {props.last_message}
                            </div>

                            <img
                                className={styles.messengerIcon}
                                src={`https://beechat.ru/imgs/messengerIcon/${props.messenger_type}.png`}
                                alt=""
                            />
                        </div>
                    }
                />
                {/* <div className={styles.onlineIcon}></div> */}
            </List.Item>
            {/* <div
                onClick={() => {
                    hideThisChat();
                }}
                className={styles.deleteBtn}
            >
                <CloseOutlined />
            </div> */}
        </div>
    );
};
