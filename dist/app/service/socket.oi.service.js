"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var io = require("socket/socket.io.js");
var Io = (function () {
    function Io() {
        var _this = this;
        this._socket = io("http://" + window.location.hostname + ":8081");
        this._socket.$emit = function (name, data) {
            return new Promise(function (resolve, reject) {
                var timeout = setTimeout(function () {
                    reject('Error by timeout ');
                }, 30000);
                var response = function (d) {
                    clearTimeout(timeout);
                    _this.socket.off(name, response);
                    resolve(d);
                };
                _this.socket.on(name, response);
                _this.socket.emit(name, data);
            });
        };
        this._socket.on('news', function (d) {
            //console.log(d,'klklttewefewfwe')
        });
    }
    Object.defineProperty(Io.prototype, "socket", {
        get: function () {
            return this._socket;
        },
        enumerable: true,
        configurable: true
    });
    Io = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Io);
    return Io;
}());
exports.Io = Io;
//# sourceMappingURL=socket.oi.service.js.map