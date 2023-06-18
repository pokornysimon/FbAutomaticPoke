function reddenPage() {
    var aTags = document.getElementsByTagName("span");
    var searchText = "Poke Back";
    var found;

    var secondSpan = false;

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            if (secondSpan) {
                secondSpan = false;
                continue;
            } else {
                secondSpan = true;
                found = aTags[i];
                found.click();
                console.log("Poked...");
            }
        }
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("poke", {
        delayInMinutes: 0,
        periodInMinutes: 1
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("reload", {
        delayInMinutes: 0,
        periodInMinutes: 4
    });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.tabs.query({ url: "https://www.facebook.com/pokes/*" }, function (tabs) {
        if (alarm.name === "poke" && tabs.length >= 1) {
            {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: reddenPage
                });
            }
        } else if (alarm.name === "reload"){
            chrome.tabs.reload(tabs[0].id);
        }
    });
});

chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.includes("chrome://")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: reddenPage
        });
    }
});
