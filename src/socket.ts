//@ts-ignore
import io from 'socket.io-client';

const socket = io('https://beechat.ru', {
    withCredentials: true,
    extraHeaders: {
        'my-custom-header': 'abcd',
    },
});

export default socket;
