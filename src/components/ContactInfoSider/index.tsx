import React from 'react';
//@ts-ignore
import styles from './ContactInfoSider.module.scss';
import { IContact } from '../../types';
/* import { Descriptions } from 'antd'; */
/* import type { DescriptionsProps } from 'antd'; */

export const ContactInfoSider: React.FC<IContact> = (props) => {
    return (
        <div className={styles.content}>
            <h4>Информация о клиенте</h4>
            <div className={styles.clientInfo}>
                <span>Имя:</span>
                <p>{props.contact_name || 'Не передано'}</p>
                <span>Телефон:</span>
                <div style={{ display: 'flex' }}>
                    <p>{props.contact_phone || 'Не передано'}</p>
                    {props.description ? (
                        <img
                            className={styles.messengerIcon}
                            src={`https://beechat.ru/imgs/messengerIcon/${props.description}.png`}
                            alt="messenger_icon"
                        />
                    ) : null}
                </div>
                <span>Email:</span>

                <p>{props.contact_email || 'Не передано'}</p>

                <span>Источник чата:</span>
                <p>{props.from_url || 'Не передано'}</p>
                <span>Ссылки:</span>
                <p>неизвестно</p>
                {/* <span>Описание:</span>
                <p>{props.description ? props.description : ''}</p> */}
            </div>
            {/* <h4>Информация из GetCourse</h4>
            <div className={styles.clientInfo}>
                <span>Ссылка на пользователя в GC:</span>
            </div> */}
        </div>
    );
};
