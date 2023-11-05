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

export interface IContact {
    id: number;
    contact_name: string;
    contact_avatar?: string;
    contact_email: string;
    contact_phone?: string;
    messenger_id?: number;
    messenger_type: 'telegram' | 'instagram' | 'whatsapp' | 'vk' | 'beechat';
    created_at: Date;
    account_id: number;
    instagram_chat_id: string;
    is_hidden: boolean;
    from_url: string;
    description: string;
    manager_id?: number;
}

export interface IContactResponse extends IContact {
    last_message?: string;
    last_message_created_at: Date;
    unread_messages_count: number;
    last_message_from_contact: boolean;
    status?: boolean;
}

export interface IMessage {
    id: number;
    created_at: Date;
    text: string;
    contact_id: number;
    from_contact: boolean;
    is_readed: boolean;
}
