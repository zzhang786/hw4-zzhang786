import { Component, OnInit } from '@angular/core';
import {MainService} from "../main/main.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
    followerList : any[] = [];
    showPosts : any[] = [];
    title: string = "Your Title Here ";
    content: string = "Your content ";
    status: string = "Your status";

    searchWords:string="";

    constructor(private service:MainService, private router:Router) {
     this,service.eventShowFollowing.subscribe(
        (id:string)=>{
          this.showPosts=this.service.getPostByUserName(this.service.getUserNameByID(id));
          console.log(this.showPosts);
        }
    )
    if(this.service.getCurrentUserName()==null ||
            this.service.getCurrentUserName()=="" ){
            this.router.navigateByUrl("main")
            return;
    }
    this.status = this.service.getStatusByUsername(this.service.getCurrentUserName());
    this.followerList = this.service.getfollowerByUserID(
        this.service.getUserIDByUsername(this.service.getCurrentUserName()))  ;
    console.log("this is follower list ", this.followerList);

      this.showPosts = this.service.getPostByUserName(this.service.getCurrentUserName());
console.log("showPosts:",this.showPosts);
  }

  ngOnInit(): void {
    console.log("this is in second page!");
    console.log(this.service.checkUserNameAndPwd('zz','dd'));
  }

  addNewPost():void{
     this.service.addNewPost(this.title,this.content);
     this.title = "Your Title Here ";
     this.content = "Your content ";
     this.showPosts=this.service.getPostByUserName(this.service.getCurrentUserName());
      console.log(this.showPosts);

}
    changeStatus():void{
        this.service.changeStatus(this.status);
        this.service.eventChangeStatus.emit(this.status);
    }

    searchByWords():void{
        this.showPosts=this.service.getPostsByWords(this.searchWords);


    }
}
