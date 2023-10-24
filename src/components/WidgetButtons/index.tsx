import React from 'react';
//@ts-ignore
import styles from './WidgetButtons.module.scss';

export const WidgetButtons = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const account_id = urlParams.get('accountId');

    const [fromUrl, setFromUrl] = React.useState('');

    React.useEffect(() => {
        window.addEventListener('message', (event: MessageEvent<any>) => {
            console.log(event);
            console.log(event.data);
            if (event.data.action === 'showLiveChat') {
                const location = event.data.location as string;
                setFromUrl((prev) => location);
            }
        });
    }, []);

    var messageToParent = {
        action: 'showLiveChat',
    };

    // Отправляем сообщение родительскому документу
    const sendMessageFromIframe = () => {
        window.parent.postMessage(messageToParent, '*');
        console.log('click');
    };

    return (
        <div className={styles.buttonsContainer}>
            <div className={styles.vk}>
                <a
                    target="_blank"
                    href={`https://vk.me/public212085097?ref=accountId=${account_id}_fromUrl=${fromUrl}`}
                    rel="noreferrer"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/256/145/145813.png"
                        alt="tg"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            <div className={styles.telegram}>
                <a
                    target="_blank"
                    href={`https://t.me/LF_support_bot?start=accountId=${account_id}&fromUrl=${fromUrl}`}
                    rel="noreferrer"
                >
                    <img
                        src="https://cdn.iconscout.com/icon/free/png-256/free-telegram-3691230-3073750.png"
                        alt="tg"
                        width={50}
                        height={50}
                    />
                </a>
            </div>
            <div
                onClick={() => {
                    sendMessageFromIframe();
                }}
                className={styles.livechat}
            >
                {/* <a target="_blank" href={`http://localhost:3000/livechat`} rel="noreferrer"> */}
                <img
                    src="https://icon-library.com/images/white-chat-icon/white-chat-icon-27.jpg"
                    alt="livechat"
                    width={27}
                    height={27}
                />
                {/* </a> */}
            </div>
        </div>
    );
};
