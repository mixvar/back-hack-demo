// can be used as code snippet
(function backHackModule() {

    init();

    function init() {
        window.addEventListener('popstate', onPopstate);

        if (shouldEnableBackHack()) {
            enableBackHack();
        } else {
            console.log('backhack | skipped');
        }
    }

    function shouldEnableBackHack() {
        return document.referrer && !document.referrer.includes(window.location.host)
            && (window.history.length > 1)
            && !window.sessionStorage.getItem('backHackEnabled');
    }

    function enableBackHack() {
        console.log('backhack | enabled');

        window.history.replaceState(newHistoryState({backHackEntry: true}), '');
        window.history.pushState(newHistoryState({backHackEntry: false}), '');

        window.backHackEnabled = true; // when user navigates away the flag will disappear

        // prevents adding too many fake history entries, and displaying dialog too often
        window.sessionStorage.setItem('backHackEnabled', 'true');
    }

    function newHistoryState(state) {
        // avoiding potential compatibility issues by keeping original state
        return Object.assign({}, window.history.state, state);
    }

    function onPopstate(e) {
        console.log('backhack | onPopstate', e);
        if (shouldExecuteBackHack()) {
            executeBackHackAction();
        } else if (isBackHackHistoryEntry() && !isSafari()) {
            console.log('backhack | backing');
            window.history.back(); // does not work properly on safari
        }

        window.backHackEnabled = false; // disable backHack if user pressed back more than once within same page
    }

    function executeBackHackAction() {
        console.log('executing backHack action!');
        const modal = document.getElementById('backhackModal');
        modal && modal.classList.remove('hidden');
        // alert('backhack');
    }

    function shouldExecuteBackHack() {
        return isBackHackHistoryEntry() && window.backHackEnabled
            && window.sessionStorage.getItem('backHackEnabled');
    }

    function isBackHackHistoryEntry() {
        return window.history.state && window.history.state.backHackEntry;
    }

    function isSafari() {
        return navigator.vendor.toLowerCase().startsWith('apple')
            && (navigator.userAgent.indexOf('Safari') > -1)
    }
})();
