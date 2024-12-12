var tonukiBridge = (function() {
    const _wrapper = window.parent.window;
    var _unityInstance = null;

    const handleReceiveMessage = (message) => {
        const tonuki = message?.data?.tonuki || message?.data?.playdeck;

        if (!tonuki) return;

        console.log(tonuki);

        if (tonuki.method === "getUserProfile") {
            _unityInstance?.SendMessage("TonukiBridge", "GetUserHandler", JSON.stringify(tonuki.value))
        }
        else if (tonuki.method === "getData") {
            let data = tonuki?.value?.data?.toString();
            console.log("tonuki data: " + data);
            if (!data) data = "";
            _unityInstance.SendMessage("TonukiBridge", "GetDataHandler", data);
        }
        else if (tonuki.method === "requestPayment") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "RequestPaymentHandler", JSON.stringify(tonuki.value))
        }
        else if (tonuki.method === "getPaymentInfo") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "GetPaymentInfoHandler", JSON.stringify(tonuki.value))
        }
        else if (tonuki.method === "getShareLink") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "GetShareLinkHandler", tonuki.value);
        }
        else if (tonuki.method === "getPlaydeckState") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "GetPlaydeckStateHandler", tonuki.value ? 1 : 0 );
        }
        else if (tonuki.method === "rewardedAd") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "RewardedAdHandler", JSON.stringify(tonuki.value) );
        }
        else if (tonuki.method === "errAd") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "ErrAdHandler", JSON.stringify(tonuki.value) );
        }
        else if (tonuki.method === "skipAd") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "SkipAdHandler", JSON.stringify(tonuki.value) );
        }
        else if (tonuki.method === "notFoundAd") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "NotFoundAdHandler", JSON.stringify(tonuki.value) );
        }
        else if (tonuki.method === "startAd") {
            console.log(tonuki.value);
            _unityInstance?.SendMessage("TonukiBridge", "StartAdHandler", JSON.stringify(tonuki.value) );
        }
    }

    return {
        init: function(unityInstance){
            _unityInstance = unityInstance;
            window.addEventListener("message", handleReceiveMessage);
        },

        setLoadingProgress: function (progressValue) {
            _wrapper.postMessage({ tonuki: { method: "loading", value: progressValue } }, "*")
        }
    };
});
