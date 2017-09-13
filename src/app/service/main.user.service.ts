
import {Injectable} from "@angular/core";
import {Device} from "./device.service";
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {Io} from "./socket.oi.service";
import {ToastService} from "../component/toast/toast.component";
import {Router} from "@angular/router";
import {Deferred} from "../util/deferred";



export interface User{
    id: number;
    name: string;
    image: string;
    deviceKeys?:Array<string>;
    setting?: any;
    devices?: Array<Device>;
}


@Injectable()
export class UserService implements CanActivate{
    canActivate(   route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        console.log(route, state);
        if(!this.user.id){
            this.toast.show({
                type: 'warning',
                translate: 'NOT_LOGGED'
            });
            this.router.navigate(['/auth/map']);
        }
        return !!this.user.id;
    }
    

    private _user: User;
    private _friends: Array<User> = [];
    private _other: User;
    private socket: any;
    private images: {[userId:number]: String} ={};
    private deferImage: {[userId:number]: Deferred} = {};
    constructor(private io: Io, private toast:ToastService, private router: Router){
        this.socket = io.socket;
        this._user = {
            name: null,
            id: null,
            image: null
        };
        this._other = {
            id: null,
            name: null,
            image: null,
            devices: []
        };
        this.socket.on('getUserImage', this.onUserImage.bind(this));
    }

    onUserImage(data){
        this.images[data.id] = data.image;
        this.deferImage[data.id].resolve(data.image)
    }
    getUserImageById(id: number) {
        if(!this.deferImage[id] ){
            this.deferImage[id] = new Deferred();
            this.socket.$emit('getUserImage', id);
        }
        return this.deferImage[id].promise;
    }

    clearUser(){
       for (let opt in this._user){
           this._user[opt] = null
       }
    }
    clearAll(){
        this.user.devices.forEach(device=>{
            if(device.marker){
                device.marker.remove()
            }
        });
        this.friends.forEach(friend=>{
            friend.devices.forEach(device=>{
                if(device.marker){
                    device.marker.remove()
                }
            })
        });
        while (this.friends.length){
            this.friends.shift()
        }
        this.clearUser();
    }
    
    createDeviceOther(device){
        this._other.devices.push(device);
        return device
    }



    get other():User {
        return this._other;
    }

    set other(value:User) {
        this._other = value;
    }
  

    set friends(friends: Array<User>){
        if(!friends) return;
        this._friends.length = 0;
        friends.forEach(friend=>{
            this._friends.push(friend)
        })
    }
    get friends(){
        return this._friends
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        for(let opt in value){
            this._user[opt] = value[opt]
        }
    }




}

