import '../css/popup.css'

const bg = chrome.extension.getBackgroundPage().bg;

const setVideo = (src) => {
    const video = document.querySelector('#video');
    const videoUrl = document.querySelector('#video-url');
    video.src = src;
    videoUrl.href = src;
};

const setCover = (src) => {
    const cover = document.querySelector('#cover');
    const coverUrl = document.querySelector('#cover-url');
    cover.src = src;
    coverUrl.href = src;
};

// ui
window.$ui = {
    setVideo: setVideo,
    setCover: setCover,
};

// 通信
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request instanceof Array) {
            console.log(request[0]);
            $ui[request[0]](...request.slice(1));
        }
    });

window.onload = () => {
    chrome.tabs.query({'active': true}, (tabs) => {
        let arr = [];
        const tabURL = tabs[0].url;
        const regexList = [
            {regex: /(www.dailymotion.com)\/video\/(.+)/},
            {regex: /(www.vigovideo.net)\/share\/video\/(\d+?)\//},
        ];
        regexList.some((item) => {
            let result = tabURL.match(item.regex);
            if (result && result.length === 3) {
                arr = result.slice(1);
                return true;
            }
        });
        if (arr.length !== 2) {
            return
        }
        console.log(arr);
        switch (arr[0]) {
            case 'www.dailymotion.com': {
                bg.getDailymotion(arr);
                break;
            }
            case 'www.vigovideo.net': {
                bg.getVigovideo(arr);
                break;
            }
        }
    });
};
