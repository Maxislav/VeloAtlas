
import {Component, Directive, ElementRef, Renderer} from "@angular/core";
import {Location} from '@angular/common';
import {FriendsService, User} from "../../service/friends.service";
import {ToastService} from "../toast/toast.component";
import {Router} from "@angular/router";
import {ChatService} from "../../service/chat.service";


@Directive({
    selector: 'users-container',
})
export class UsersContainer{
    constructor(el: ElementRef, renderer: Renderer){

        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        renderer.setElementStyle(el.nativeElement, 'max-height', y-160+'px');
    }
}
declare const module:{
    id: any
};

@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './friends-component.html',
    styleUrls: ['./friends-component.css'],
})
export class FriendsComponent{
    public allUsers: Array<User>;
    public invites: Array<User>;
    public friends: Array<User>;
    private myInvites: Array<any>;
    constructor(private location: Location, private friendsService: FriendsService, private toast: ToastService,  private router: Router, private chatService: ChatService){
        this.allUsers = friendsService.users;
        this.invites = friendsService.invites;
        this.friends = friendsService.friends;
        this.myInvites = friendsService.myInvites;
        friendsService.getFriends()
    }

    onAccept(friend: User){
        this.friendsService.onAcceptInvite(friend)
    }

    onDelFriend(friend: User){
        this.friendsService.onDelFriend(friend.id)
    }
    onClose(){
        this.location.back()
    }
    getAllUsers(){
        this.router.navigate(['/auth/map/friends/all']);
    }
   
    onReject(user){
        this.friendsService.onRejectInvite(user.id)
    }

    onCancelInvite(user: User){
        this.friendsService.onCancelInvite(user.id)
    }
    startChat(user: User): void{
        this.chatService.onEnterRoom(user)
    }

    

}