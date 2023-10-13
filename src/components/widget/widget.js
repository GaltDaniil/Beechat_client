document.addEventListener('DOMContentLoaded', function () {
    const mainBtn = document.getElementById('bee-main-button');
    const closeWidgetsBtn = document.getElementById('bee-close-widgets-button');
    const buttonsIframes = document.getElementById('buttons-iframe');
    const liveChatDiv = document.getElementById('bee-livechat');

    mainBtn.addEventListener('click', () => {
        mainBtn.classList.add('bee_hidden');
        closeWidgetsBtn.classList.remove('bee_hidden');
        buttonsIframes.style.height = '202px';
    });

    closeWidgetsBtn.addEventListener('click', () => {
        let hasHiddenClass = liveChatDiv.classList.contains('bee_hidden');
        console.log(hasHiddenClass);
        if (hasHiddenClass) {
            mainBtn.classList.remove('bee_hidden');
            closeWidgetsBtn.classList.add('bee_hidden');
            buttonsIframes.style.height = '0px';
        } else {
            liveChatDiv.classList.add('bee_hidden');
            mainBtn.classList.remove('bee_hidden');
            closeWidgetsBtn.classList.add('bee_hidden');
        }
    });

    window.addEventListener('message', function (event) {
        if (event.origin !== 'http://localhost:3000') return; // Убедитесь, что это сообщение от вашего iframe

        var message = event.data;
        if (message.action === 'showLiveChat') {
            buttonsIframes.style.height = '0px';
            liveChatDiv.classList.remove('bee_hidden');
        }
        if (message.action === 'hideLiveChat') {
            liveChatDiv.classList.add('bee_hidden');
            mainBtn.classList.remove('bee_hidden');
            closeWidgetsBtn.classList.add('bee_hidden');
        }
    });
});

/* const closeBtn = document.getElementById('close-button');
    const closeChatBtn = document.getElementById('close-chat-button');
    const chatBtn = document.getElementById('chat-button');
    const telegramBtn = document.getElementById('telegram-button');

    mainBtn.addEventListener('click', () => {
        mainBtn.classList.add('hidden');
        telegramBtn.classList.remove('hidden');
        closeBtn.classList.remove('hidden');
        chatBtn.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        mainBtn.classList.remove('hidden');
        telegramBtn.classList.add('hidden');
        closeBtn.classList.add('hidden');
        chatBtn.classList.add('hidden');
    });

    chatBtn.addEventListener('click', () => {
        telegramBtn.classList.add('hidden');
        closeBtn.classList.add('hidden');
        chatBtn.classList.add('hidden');
        iframeContainer.classList.remove('hidden');
        closeChatBtn.classList.remove('hidden');
    });

    closeChatBtn.addEventListener('click', () => {
        telegramBtn.classList.add('hidden');
        closeBtn.classList.add('hidden');
        chatBtn.classList.add('hidden');
        mainBtn.classList.remove('hidden');
        iframeContainer.classList.add('hidden');
        closeChatBtn.classList.add('hidden');
    });
});
 */
