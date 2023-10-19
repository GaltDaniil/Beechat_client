declare module '*.scss';

export interface IAccount {
    id: number;
    company_name: string;
    owner_id: number;
}
export interface IPipeline {
    id: number;
    title: string;
    account_id: number;
    created_at: Date;
}
export interface IStage {
    id: number;
    stage_title: string;
    created_at: Date;
    stage_color: string;
    pipeline_id: number;
    stage_index: number;
}
export interface IDeal {
    id: number;
    stage_id: number;
    deal_title: string;
    deal_price: number;
    deal_status: number;
    client_id: number;
    tag_id: number;
    deal_custom_fields: object;
    deal_position: number;
    created_at: Date;
}

export interface IDealJoin extends IDeal {
    client_name: string;
    client_surname: string;
    client_email: string;
    client_phone: string;
    client_avatar: string;
    client_custom_fields: object;
    setTargetDeal: React.Dispatch<React.SetStateAction<IDealJoin | null>>;
    setCurrentDeal: React.Dispatch<React.SetStateAction<IDealJoin | null>>;
    setPreviousDeal: React.Dispatch<React.SetStateAction<IDealJoin | null>>;
}

export interface IChat {
    id: number;
    account_id: number;
    created_at: Date;
    avatar?: string;
    from_messenger: string;
    client_id?: number;
    telegram_id?: string;
}

export interface IChatResponse extends IChat {
    client_id?: number;
    client_name?: string;
    client_phone: string;
    client_custom_fields: { tg_name: string; tg_user_name: string };
    last_message?: string;
    last_message_sended_at: Date;
    unread_messages_count: number;
    status?: boolean;
}

export interface IMessage {
    id: number;
    sended_at: Date;
    text: string;
    chat_id: number;
    from_client: boolean;
    is_readed: boolean;
}

export interface IClient {
    id: number;

    name: string;
    surname?: string;
    email?: string;
    phone?: string;
    adress?: string;
    avatar?: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    from_messenger?: string;
    manager_id?: number;
    custom_fields?: object;
    telegram_id?: number;
    account_id: number;
    created_at: Date;
}
