// 通知
const notify = (data) => {
    const tab = chrome.extension.getViews({type: 'tab'});
    const popup = chrome.extension.getViews({type: 'popup'});
    [tab, popup].map((v) => {
        if (!v || !(v instanceof Array) || !tab.length) {
            return;
        }
        if (data instanceof Array) {
            v[0].$ui[data[0]] && v[0].$ui[data[0]](...data.slice(1));
        }
    });
    chrome.runtime.sendMessage(data);
    chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
        if (tabs.length === 0) {
            return
        }
        chrome.tabs.sendMessage(tabs[0].id, data);
    });
};

// 获取数据
const getData = (arr) => {
    const url = 'https://www.dailymotion.com/player/metadata/video/';
    fetch(url + arr[1], {
        headers: {
            'content-type': 'application/json'
        }
    }).then(function (response) {
        return response.json()
    }).then(function (myJson) {
        console.log(myJson);
        const videos = Object.values(myJson['qualities']);
        notify(['setVideo', videos[videos.length - 2][videos[videos.length - 2].length - 1]['url']]);
        const covers = Object.values(myJson['posters']);
        notify(['setCover', covers[covers.length - 1]]);
    });
};

window.bg = {
    getData: getData,
};