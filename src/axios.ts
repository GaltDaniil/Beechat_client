import axios from 'axios';

const instance = axios.create({
    //baseURL: 'http://95.163.243.156:8002/api',
    baseURL: 'https://beechat.ru/api',
    //baseURL: 'https://smartdietai.ru/api',
});

export default instance;
