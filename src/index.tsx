import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { setupStore } from './redux/store';
const root = ReactDOM.createRoot(document.getElementById('root')!);

const store = setupStore();

root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);
