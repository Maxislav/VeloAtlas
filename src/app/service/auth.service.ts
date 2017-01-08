import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";
import {DeviceService} from "./device.service";
import {Resolve} from "@angular/router";
import {FriendsService} from "./friends.service";
import {UserService} from "./main.user.service";
import {LogService} from "./log.service";

export interface Setting{
    hill?: boolean;
    id?: number;
    map?: string;
    lock?: boolean;
}



@Injectable()
export class AuthService implements Resolve<any>{
    socket: any;
    private _userId: number;
    private _userName: string = null;
    private _userImage: string = null;
    private _setting: Setting;

    private resolveAuth: Function;
    constructor(
        private io: Io,
        private ls: LocalStorage,
        private log: LogService,
        private ds: DeviceService,
        private friend: FriendsService,
        private userService: UserService) {
        this.socket = io.socket;
        this._setting = {};
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', (d) => {
            console.log('disconnect');
           // this.userName = null;
        });
    }
    resolve(): Promise<any> {
        return new Promise((resolve, reject)=>{
            this.resolveAuth = resolve;
        });
    }

    onAuth(){
        this.onConnect()
    }

    onConnect() {
        this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(d => {
            if(d.result =='ok'){
                this.userService.user = d.user;
                this.userId = d.user.id;
                this.userImage = d.user.image;
                this.userName = d.user.name;
                this.setting = d.user.setting || this.setting;
                this.friend.updateFriends()
                    .then(d=>{
                        this.ds.updateDevices()
                            .then(d=>{
                                this.log.getLastPosition()
                            })
                    });
                this.friend.getInvites();

            }else{
                this.userName = null;
            }
            console.log(d);
            this.resolveAuth(true)
        })
    }

    get userName() {
        return this._userName;
    }
    set userName(name) {
        this._userName = name
    }
    get setting(): Setting {
        return this._setting;
    }
    set setting(value: Setting  ) {
        this._setting = value;
    }
    get userImage(): string {
        return this._userImage;
    }
    set userImage(value: string) {
        this._userImage = value;
    }
    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }
}

