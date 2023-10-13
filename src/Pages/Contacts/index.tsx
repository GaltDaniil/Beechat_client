/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { /* Space,  */ Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UploadSpace } from '../../components/UploadSpace';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getClients } from '../../redux/reducers/ClientSlice';

export const Contacts: React.FC = () => {
    const dispatch = useAppDispatch();
    const clients = useAppSelector((state) => state.clientReducer.clients);
    console.log(clients);
    //const [clientsData, setClientsData] = React.useState([]);
    const [convertedData, setConvertedData] = React.useState([]);

    React.useEffect(() => {
        const fx = async () => {
            dispatch(getClients());
        };
        fx();
    }, []);

    interface DataType {
        key: string;
        name: string;
        surname: string;
        email: string;
        phone: number;
        age: number;
        address?: string;
        tags?: string[];
    }

    React.useEffect(() => {
        //@ts-ignore
        const newData = clients.map((el, index) => {
            return {
                key: index.toString(),
                //@ts-ignore
                name: el.name || el.custom_fields.tg_name || 'Не передано',
                surname: el.surname || 'Не передано',
                email: el.email || 'Не передано',
                phone: el.phone || 'Не передано',
                //@ts-ignore
                age: el.custom_fields!.возраст || 'Не передано',
            };
        });
        //@ts-ignore
        setConvertedData((pred) => newData);
        console.log('convertedData is', convertedData);
    }, [clients]);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
            //onFilter: (value: string, record) => record.name.indexOf(value) === 0,
            //sorter: (a, b) => a.name.length - b.name.length,
            //sorter: (a, b) => a.name.localeCompare(b.name),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Фамилия',
            dataIndex: 'surname',
            key: 'surname',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Возраст',
            dataIndex: 'age',
            key: 'age',
        },
        /* {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
        }, */
        {
            title: 'Тэги',
            key: 'tags',
            dataIndex: 'tags',
            /* render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ), */
        },
        /* {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        }, */
    ];

    return (
        <>
            <UploadSpace />
            <Table columns={columns} dataSource={convertedData} />
        </>
    );
};
