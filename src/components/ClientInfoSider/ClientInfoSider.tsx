import React from 'react';
//@ts-ignore
import styles from './ClientInfoSider.module.scss';
/* import { Descriptions } from 'antd'; */
/* import type { DescriptionsProps } from 'antd'; */

interface IClientInfoProps {
    id: string;
    account_id: number;
    created_at?: Date;
    update_at?: Date;
    avatar?: string;
    fromUrl?: string;
    from_messenger?: string;
    client_id: number;
    client_name?: string;
    client_phone: string;
    client_email: string;
    last_message?: string;
    last_message_sended_at: Date;
    client_custom_fields: { chat_description: string };
}

export const ClientInfoSider: React.FC<IClientInfoProps> = (props) => {
    return (
        <div className={styles.content}>
            <h4>Информация о клиенте</h4>
            <div className={styles.clientInfo}>
                <span>Имя</span>
                <p>{props.client_name || 'Не передано'}</p>
                <span>Телефон</span>
                <p>{props.client_phone || 'Не передано'}</p>
                <span>Email</span>
                <p>{props.client_email || 'Не передано'}</p>
                <span>Источник</span>
                <p>неизвестно</p>
                <span>Ссылки</span>
                <p>неизвестно</p>
                <span>Описание</span>
                <p>
                    {props.client_custom_fields ? props.client_custom_fields.chat_description : ''}
                </p>
            </div>
        </div>
    );
};
