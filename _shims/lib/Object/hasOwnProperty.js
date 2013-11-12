Object.prototype.hasOwnProperty = function hasOwnProperty (property) {
    var _prototype = this.__proto__ || this.constructor.prototype;
    return (property in this) && (!(property in _prototype) ||
            _prototype[property] !== this[property]);
};