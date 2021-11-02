import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MainService} from "./main/main.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tian';
  openFlag:boolean = true;
  followingList:any[] = [];
  currentUserInfo:any = {};
  newFollowingUserNameToAdd:string="";
  showIfAddFollowing:boolean = false;

  constructor(private myRouter:Router, private service: MainService) {
    this.service.eventChangeStatus.subscribe(
        (status:string)=>{
          this.currentUserInfo = JSON.parse(this.service.getUserInfoByUserID(
              this.service.getUserIDByUsername(this.service.getCurrentUserName())));
        }
    );
    this.service.userChangeEvent.subscribe(
        (username:string)=>{
          if(username==""){
            this.followingList=[];
            this.currentUserInfo=[];
            this.showIfAddFollowing = false;
            console.log("hihiiii********",this.currentUserInfo);
          }else{
            console.log("received");
            this.showIfAddFollowing = true;
            this.followingList= this.service.getfollowingByUserID(this.service.getUserIDByUsername(
                this.service.getCurrentUserName()));
                console.log("this is the floowinglish", this.followingList);
            this.currentUserInfo = JSON.parse(this.service.getUserInfoByUserID(this.service.getUserIDByUsername(this.service.getCurrentUserName())));

          }

        }
    );
    if(this.service.getCurrentUserName() == null || this.service.getCurrentUserName() == ""){
      return;
    }
    this.followingList= this.service.getfollowingByUserID(this.service.getUserIDByUsername(
         this.service.getCurrentUserName()));

    this.currentUserInfo = JSON.parse(this.service.getUserInfoByUserID(this.service.getUserIDByUsername(this.service.getCurrentUserName())));
    //console.log("this is current user info:",this.currentUserInfo);
 /*   if(this.currentUserInfo!=null&&this.currentUserInfo.length>0) {
        this.showIfAddFollowing = true;
    }*/
    this.showIfAddFollowing = true;
  }
  changeSideBar():void{
    this.openFlag = !this.openFlag;
  }
  toMain():void{
    this.myRouter.navigateByUrl('');
  }
  toMainPage():void{
    this.myRouter.navigateByUrl('main_page');
  }
  toProfilePage():void{
    this.myRouter.navigateByUrl('profile_page');
  }

  showFollowingPage(id:string):void{
    this.service.eventShowFollowing.emit(id);
  }

  logOut():void{
    this.service.logOut();
    this.myRouter.navigateByUrl("");
  }
  unfollow(id:string):void{
    this.followingList=this.service.deleteRelationByFollowingId(id);
    /*this.followingList= this.service.getfollowingByUserID(this.service.getUserIDByUsername(
        this.service.getCurrentUserName()));*/

    this.service.relationChangeEvent.emit(this.service.getCurrentUserName());
  }
  addFollowing(){
    let legalUsername=this.service.addFollowingByUsername(this.newFollowingUserNameToAdd);
    if(legalUsername==false){
      alert("your input is illegal. Please check it!");
      return;
    }
    this.followingList= this.service.getfollowingByUserID(this.service.getUserIDByUsername(
        this.service.getCurrentUserName()));
    this.service.relationChangeEvent.emit(this.service.getCurrentUserName());
  }

}
