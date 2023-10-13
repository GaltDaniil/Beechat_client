import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { BeeChat } from './Pages/BeeChat';
import { MainLayout } from './Layout/MainLayout';
import { WidgetButtons } from './components/WidgetButtons';

function App(): React.ReactElement<any, any> {
    React.useEffect(() => {}, []);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="*" element={<MainLayout />} />
                    <Route path="/livechat" element={<BeeChat />} />
                    <Route path="/buttons" element={<WidgetButtons />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
