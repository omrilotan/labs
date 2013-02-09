/*!
 * singlePageApplicationState v0.0.1
 */
var singlePageApplicationState = function (defaults) {
    // defaults: {
    // - defaultPage (String: page name)
    // - loadPage (Function: argumnets; (name, params, options))
    if (typeof defaults !== 'object' || defaults.defaultPage === 'undefined') {
        throw new Error('field defaultPage is required');
    }
    var that = this,
        Storage = localStorage || sessionStorage,
        storageHistory = Storage.getItem('history'), // read history from storage
        privateHistory = storageHistory !== null ? JSON.parse(storageHistory) : [], // Array
        privateRemember = function (name, params) {
            if (typeof name === 'string') { // if we pass in a page to add to history
                if (privateHistory.length === 0) { // no pages are currently in history
                    privateHistory.push({ name: name, params: params });
                }
                if (privateHistory[privateHistory.length - 1].name !== name) { // not the same page in last location
                    privateHistory.push({ name: name, params: params });
                }
                Storage.setItem('history', JSON.stringify(privateHistory));
            }
            return name;
        };
    // %.back
    that.back = function () {
        if (privateHistory.length < 2) {
            return false;
        }
        privateHistory.pop();
        return that.navigate(privateHistory[privateHistory.length - 1].name, {}, { newSection: null, force: true });
    };
    // %.navigate
    that.navigate = function (name, params, options) {
        options = options || {};
        if (typeof name !== 'string' || name === '') {
            throw new TypeError('page name must be a string');
        }
        if (options.newSection === true) {
            privateHistory = [];
            options.force = true;
        }
        if (options.force === true || privateHistory[privateHistory.length - 1].name !== name) {
            privateRemember(name, params);
            if (typeof defaults.loadPage === 'function') {
                defaults.loadPage(name, params);
            }
        }
        return true;
    };
    // %.getCurrentPageName
    that.getCurrentPageName = function () {
        if (privateHistory.length > 0) {
            return privateHistory[privateHistory.length - 1].name;
        }
        return defaults.defaultPage;
    },
    // %.getCurrentPageParams
    that.getCurrentPageParams = function () {
        if (privateHistory.length > 0) {
            return privateHistory[privateHistory.length - 1].params;
        }
        return false;
    };
    // %.init
    that.init = function () {
        var pageName = that.getCurrentPageName();
        return that.navigate(pageName, that.getCurrentPageParams(), { newSection: !that.hasHistory(), force: true });
    };
    // %.refresh
    that.refresh = function () {
        return that.init();
    };
    // WNDR.navigator.hasHistory
    that.hasHistory = function () {
        return privateHistory.length > 1;
    };
};