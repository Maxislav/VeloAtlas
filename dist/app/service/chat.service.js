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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const socket_oi_service_1 = require("./socket.oi.service");
const deferred_1 = require("../util/deferred");
let ChatService = class ChatService {
    constructor(io) {
        this.io = io;
        this.rooms = [];
        this.messages = {};
        this.roomsObj = {};
        this._unViewedIds = [];
        this.socket = io.socket;
        this.socket.on('onChat', this.onChat.bind(this));
        this.unViewedDefer = new deferred_1.Deferred();
    }
    onChat(data) {
        console.log(data);
        this.putMessage(data.userId, {
            id: data.id,
            text: data.text,
            date: new Date(data.date),
            isMy: false,
            viewed: data.viewed
        });
    }
    get unViewedIds() {
        return this._unViewedIds;
    }
    set unViewedIds(ids) {
        this._unViewedIds.length = 0;
        ids.forEach(id => {
            this._unViewedIds.push(id);
        });
    }
    resolveUnViewedIds(userId) {
        const index = this.unViewedIds.indexOf(userId);
        if (-1 < index) {
            this.unViewedIds.splice(index, 1);
        }
    }
    getUnViewed(update) {
        if (this.unViewedDefer.status == 0 || update) {
            if (update) {
                this.unViewedDefer = new deferred_1.Deferred();
            }
            this.socket.$emit('chatUnViewed')
                .then((d) => {
                console.log('chatUnViewed->', d);
                const ids = [];
                for (let key in d) {
                    ids.push(parseFloat(key));
                }
                this.unViewedIds = ids;
                this.unViewedDefer.resolve(d);
            });
        }
        return this.unViewedDefer.promise;
    }
    getMessages(roomId) {
        if (!this.messages[roomId]) {
            this.messages[roomId] = [];
        }
        return this.messages[roomId];
    }
    putMessage(roomId, message) {
        if (!this.messages[roomId]) {
            this.messages[roomId] = [];
        }
        if (!this.roomsObj[roomId]) {
            /**
             * Нове сообщение
             * @type {number}
             */
            const i = this.unViewedIds.indexOf(roomId);
            if (i < 0) {
                this.unViewedIds.push(roomId);
            }
            if (this.addChatUnViewed) {
                this.addChatUnViewed(roomId, message.id);
            }
        }
        else {
            this.emitChatViewed([message.id]);
        }
        this.messages[roomId].push(message);
    }
    emitChatViewed(ids) {
        return this.socket.$emit('chatResolveUnViewed', ids);
    }
    clearRoomMessage(roomId) {
        this.messages[roomId].length = 0;
    }
    onEnterRoom(user) {
        this.rooms.forEach(room => {
            room.isActive = false;
        });
        if (this.roomsObj[user.id]) {
            this.roomsObj[user.id].isActive = true;
        }
        else {
            const room = {
                name: user.name,
                id: user.id,
                isActive: true,
                messages: this.getMessages(user.id)
            };
            this.roomsObj[user.id] = room;
            this.rooms.push(room);
        }
    }
    onSend(outId, message) {
        return this.socket.$emit('onChatSend', {
            id: outId,
            text: message.text
        })
            .then(d => {
            console.log(d);
            this.putMessage(d.toUserId, {
                id: d.id,
                text: d.text,
                isMy: true,
                date: new Date(d.date),
                viewed: true
            });
        });
    }
    closeRoom(id) {
        const index = this.rooms.indexOf(this.roomsObj[id]);
        if (-1 < index) {
            this.rooms.splice(index, 1);
            delete this.roomsObj[id];
            this.clearRoomMessage(id);
        }
    }
    chatHistory(userId) {
        this.socket.$emit('chatHistory', userId)
            .then(arr => {
            arr.forEach(mes => {
                this.putMessage(userId, {
                    date: new Date(mes.date),
                    text: mes.text,
                    isMy: mes.isMy,
                    id: mes.id,
                    viewed: mes.viewed
                });
            });
            console.log(arr);
        });
    }
};
ChatService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_oi_service_1.Io])
], ChatService);
exports.ChatService = ChatService;
