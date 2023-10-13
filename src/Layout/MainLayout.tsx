import React from 'react';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { ChatLayuot } from '../Pages/ChatLayuot';
//import { BeeChat } from '../Pages/BeeChat';
import { Contacts } from '../Pages/Contacts';
import { CrmPage } from '../Pages/CrmPage';

export const MainLayout = () => {
    return (
        <Layout hasSider style={{ minHeight: '100vh' }}>
            <Navigation />
            <Layout style={{ minHeight: '100vh' }}>
                <Routes>
                    <Route path="/" element={<ChatLayuot />} />
                    <Route path="crm" element={<CrmPage />} />
                    <Route path="contacts" element={<Contacts />} />
                </Routes>
            </Layout>
        </Layout>
    );
};
