import React from 'react';
import { ContactsOutlined, DesktopOutlined, MessageOutlined } from '@ant-design/icons';
/* import type { MenuProps } from 'antd'; */
import { Layout, Menu, theme } from 'antd';
//@ts-ignore
import styles from './Navigation.module.scss';
import { Link } from 'react-router-dom';

/* type MenuItem = Required<MenuProps>['items'][number]; */

const { Sider } = Layout;

/* function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
} */

/* const items: MenuItem[] = [
    getItem('Чаты', '1', <MessageOutlined />),
    getItem('CRM', '2', <DesktopOutlined />),
    getItem('Контакты', '3', <ContactsOutlined />),
]; */

export const Navigation = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Sider
            className="ant-layout-sider-light"
            style={{ background: colorBgContainer }}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
        >
            <div className="demo-logo-vertical" />
            <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<MessageOutlined />}>
                    <Link to="/">Чаты</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    <Link to="/crm">CRM</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<ContactsOutlined />}>
                    <Link to="/contacts">Контакты</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};
