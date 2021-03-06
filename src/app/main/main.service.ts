import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {single} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class MainService {
  currentUser:string="";
  eventShowFollowing=new EventEmitter<string>();
  eventChangeStatus=new EventEmitter<string>();
  userChangeEvent=new EventEmitter<string>();
  relationChangeEvent=new EventEmitter<string>();
  constructor(private http:HttpClient) {
  /*   load jason display holder*/
    this.saveUser();
  /*  load post */
    this.loadPosts();
  /* load Relation */
    this.loadRelationships();
    this.addNewPost("title","content");
  /*  test get post */
    //this.getfollowingByUserID("1");
    //console.log("this is a test",this.getfollowingByUserID("8"));
    //console.log("status ",this.getStatusByUsername("Bret"));
    //console.log("this is a test",this.getfollowerByUserID("1"));
    // console.log("lalalallalalal",this.getPostByUserName("Bret"));
  }
  /*****************
   * user
   ******************/
  changeUser(username:string):void{
    this.userChangeEvent.emit(username);
  }
  logOut():void{
    localStorage.setItem("currentUser","");
    this.changeUser("");
  }
  modifyUser(value:any):void{
    let userStr=localStorage.getItem("users");
    if(userStr==null||userStr==""){
      return;
    }
    let userJson=JSON.parse(userStr);
    for(var i=0;i<userJson.length;i++){
      if(userJson[i].username==this.getCurrentUserName()){
          for(var key in value){
            if(key=="zipcode"){
              userJson[i].address.zipcode=value[key];
            }else {
              userJson[i][key] = value[key];
            }
          }
        localStorage.setItem("users",JSON.stringify(userJson));
        return;
      }
    }
    return;
  }
  getStatusByUsername(userName:string):string{
    let userId=this.getUserIDByUsername(userName);

    let userInfo= this.getUserInfoByUserID(userId);

    var userInfoJSON = JSON.parse(userInfo);

    return userInfoJSON.status;
  }
  changeStatus(userInput:string):void{
     var currentUserName = this.getCurrentUserName();

     let userStr=localStorage.getItem("users");
     if(userStr==null||userStr==""){
       return;
     }
     let userJson=JSON.parse(userStr);
     for(var i=0;i<userJson.length;i++){
        if(userJson[i].username==currentUserName){
        userJson[i].status = userInput;
        }
     }
     localStorage.setItem("users",JSON.stringify(userJson));
  }
  requestUser():Observable<any>{
    let url='https://jsonplaceholder.typicode.com/users'
    return this.http.get(url);
  }
  saveUser():boolean{
   /* if(localStorage.getItem("users")!=null&&localStorage.getItem("users")!=""){
      return true;
    }*/
    this.requestUser().subscribe(response=>{
      if (response instanceof Array){
        response.forEach(elem =>{
          elem.picture = "assets/"+elem.id+".jpeg";
          elem.password = elem.address.street;
          elem.status = elem.company.catchPhrase;
          elem.birth="1998-8-1";
        })
      }
      localStorage.setItem("users",JSON.stringify(response));
      return true;
    });
    return true;
  }
  changeCurrentUser(username:string):void{
    this.currentUser=username;
    localStorage.setItem("currentUser",this.currentUser);
    this.changeUser(username);
  }
  getCurrentUserName():string{
    let username=localStorage.getItem("currentUser");
    if(username==null||username==""){
      return "";
    }
    return username;
  }
  checkLogin(username:string,password:string):boolean{
    let initialvalue= JSON.stringify({"username":"Null","password":"Null"})
    let userStr=localStorage.getItem("users")==null?
        initialvalue:localStorage.getItem("users");

   /* if(userStr==null||userStr==""){
      console.log(":::::::::::: check if is false:::::::::::::!!!!!");
      return false;
    }*/



    // @ts-ignore
    let userJson=JSON.parse(userStr);
    for(var i=0;i<userJson.length;i++){
      if(userJson[i].username==username&&password==userJson[i].password){

        return true;
      }
    }
    console.log(":::::::::::: check if is false22222222:::::::::::::");
    return false;
  }
  saveInfo(value:any):void{
    let userStr=localStorage.getItem("users");
    if(userStr==null||userStr==""){
      return;
    }
    let userJson=JSON.parse(userStr);
    let totalNumber=userJson.length;
    var str=JSON.stringify(userJson[totalNumber-1]);
    userJson[totalNumber] = JSON.parse(str);
    userJson[totalNumber].id = totalNumber+1;
    userJson[totalNumber].username = value.txtName;
    userJson[totalNumber].name = value.displayName;
    userJson[totalNumber].email = value.emailAdd;
    userJson[totalNumber].phone = value.txtPhone;
    userJson[totalNumber].birth = value.birth;
    userJson[totalNumber].address.zipcode = value.txtZipcode;
    userJson[totalNumber].password = value.pwd;
    localStorage.setItem("users",JSON.stringify(userJson));
    localStorage.setItem("currentUser",userJson[totalNumber].username);
    this.loadRelationships();
    //add 10 post for new user
    for(var i=0;i<10;i++) {
      // new user 10 posts
      //this.addNewPost("", "");
    }
    this.changeUser(userJson[totalNumber].username);
  }
/*  checkUserNameAndPwd(txtName:string,pwd:string): boolean {
    var userAllInfoString = localStorage.getItem(txtName);
    if (typeof userAllInfoString === "string") {
      var userAllInfoJson = JSON.parse(userAllInfoString);
      var userPwd = userAllInfoJson.pwd;
      if(userPwd===pwd){
        return true;
      }else{
        console.log("the first false:::::::::------>>>>>");
        return false;}
    } else {
      console.log("the second false:::::::::------>>>>>>");
      return false;
    }
  }*/
  getUserNameByID(userID:string):string{
    let userStr=localStorage.getItem("users");
    if(userStr==null||userStr==""){
      return "";
    }
    let userJson=JSON.parse(userStr);
    for(var i=0;i<userJson.length;i++){
      if(userJson[i].id==userID){
        return userJson[i].username;
      }
    }
    return "";
  }
  getUserIDByUsername(userName:string):string{
    let userStr=localStorage.getItem("users");
    if(userStr==null||userStr==""){
      console.log("lalalallalal9999999999999")
      return "";
    }
    let userJson=JSON.parse(userStr);
    for(var i=0;i<userJson.length;i++){
      console.log("this is userJson[]+++++++++ ", i,  userJson[i].username,userName);
      if(userJson[i].username==userName){

        return userJson[i].id;
      }
    }
    console.log("lalalallalal0000000000000009")
    return "";
  }
  getUserInfoByUserID(userID:string):string{
    let userStr=localStorage.getItem("users");
    if(userStr==null||userStr==""){
      return "";
    }
    let userJson=JSON.parse(userStr);
    for(var i=0;i<userJson.length;i++){
      if(userJson[i].id==userID){
        return JSON.stringify(userJson[i]);
      }
    }
    return "";
  }
  /*****************
   * posts
   ******************/
  addNewPost(title:string,content:string):void{
     var userName = this.getCurrentUserName();
     var userId = this.getUserIDByUsername(userName);
     var imgSrc = "assets/post1.jpeg";
     var postString = localStorage.getItem("posts");
     /*var postContainer : any [] = [];*/
     if (postString != null) {
        let postJson = JSON.parse(postString);
        console.log("llalalalallalal",postJson);
        let totalNumber=postJson.length;
        var postStr=JSON.stringify(postJson[totalNumber-1]);
        postJson[totalNumber] = JSON.parse(postStr);
        postJson[totalNumber].userId = userId;
        postJson[totalNumber].id = totalNumber+1;
        postJson[totalNumber].title=title==""?postJson[totalNumber-1].title:title;
        postJson[totalNumber].body = content==""?postJson[totalNumber-1].body:content;
        postJson[totalNumber].username = userName;
        postJson[totalNumber].imgSrc = imgSrc;
        localStorage.setItem("posts",JSON.stringify(postJson));
     }
  }
  loadPosts():void{
    let url = 'https://jsonplaceholder.typicode.com/posts';
    this.http.get(url).subscribe(
        response=>{
          if(response instanceof Array ){
            response.forEach(elem=>{
              elem.username = this.getUserNameByID(elem.userId);
              elem.imgSrc = "assets/post" +( (elem.id % 7) + 1 )+ ".jpeg";
              elem.time="2018"+"-"+Math.ceil(Math.random()*12)+"-"+Math.ceil(Math.random()*30);
            })
          }
          localStorage.setItem("posts",JSON.stringify(response))
        }
    );
  }
  getPostByUserName(userName:string):any[]{
    var postString = localStorage.getItem("posts");
    var postContainer : any [] = [];
    if(postString==null && postString==""){
      return [];
    }
    if (postString != null) {
      let postJson = JSON.parse(postString);
      for(var i = 0; i< postJson.length; i++) {
        if (userName == postJson[i].username) {//add posts of current user
          postContainer.push(postJson[i]);
        } else {
          let followings = this.getfollowingByUserID(this.getUserIDByUsername(userName));
          for (var j = 0; j < followings.length; j++) {
            if (followings[j].username == postJson[i].username) {
              postContainer.push(postJson[i]);
              break;
            }
          }
        }
      }
      postContainer.sort(
          function(a:any,b:any){
            let dateA=new Date(a.time);
            let dateB=new Date(b.time);
            if(dateA<dateB){
              return -1;
            }
            if(dateA>dateB){
              return 1;
            }
            return 0;
          }
      )
      return postContainer;
    }
    return [];
}
  getPostsByWords(words:string):any[]{
    var postString = localStorage.getItem("posts");
    var postContainer : any [] = [];
    if(postString==null && postString==""){
      return [];
    }
    if (postString != null) {
      let postJson = JSON.parse(postString);
      for(var i = 0; i< postJson.length; i++){
        if(
            postJson[i].username.includes(words)||
            postJson[i].title.includes(words)||
            postJson[i].body.includes(words)
        ){
          postContainer.push(postJson[i]);
        }
      }
      postContainer.sort(
          function(a:any,b:any){
            let dateA=new Date(a.time);
            let dateB=new Date(b.time);
            if(dateA<dateB){
              return -1;
            }
            if(dateA>dateB){
              return 1;
            }
            return 0;
          }
      )
      return postContainer;
    }
    return [];
  }
  /*****************
   * relationships
   ******************/
  loadRelationships():void{
    /*if(localStorage.getItem("relationships")!=null&&localStorage.getItem("relationsihps")!=""){
      return;
    }*/
    let userStr=localStorage.getItem("users");
    if(userStr==null||userStr==""){
      return;
    }
    var relationArray:any[] = [];
    let userJson=JSON.parse(userStr);
    for(var i=0;i<userJson.length;i++){
      var id_index = userJson[i].id;
      if(id_index>10){
        relationArray.push(
            {
              [id_index] : [1],
            }
        );
      }else{
        relationArray.push(
            {
               [id_index] : [
                   (id_index+1)%(userJson.length+1)+((id_index+1)<(userJson.length+1)?0:1),
                 (id_index+2)%(userJson.length+1)+((id_index+2)<(userJson.length+1)?0:1),
               (id_index+3)%(userJson.length+1)+((id_index+3)<(userJson.length+1)?0:1)
               ],
            }
        );
      }
    }
    localStorage.setItem("relationships",JSON.stringify(relationArray));
    return;
  }
  getfollowingByUserID(userID:string):any[]{
      var relationStr = localStorage.getItem("relationships");
      if(relationStr==null||relationStr==""){
        return [];
      }
      var relationJSON = JSON.parse(relationStr);
      console.log("relationStr",relationJSON);
      var res:any[]=[];
      for(var i = 0; i < relationJSON.length; i++){
        var singleJSON = relationJSON[i];
        console.log("singleJson:","singleJSON");
        for(var key in singleJSON){
          if(key==userID){
            //get the user info of the followings
            for(var j=0;j<singleJSON[key].length;j++){
              var followingId=singleJSON[key][j];
              var followingInfo = this.getUserInfoByUserID(followingId);
              var JsonFollowingInfo = JSON.parse(followingInfo);
              res.push(JsonFollowingInfo);
            }
            return res;
          }
        }
      }
      return [];
  }
  getfollowerByUserID(userID:string):any[]{
    var relationStr = localStorage.getItem("relationships");
    if(relationStr==null||relationStr==""){
      return [];
    }
    var relationJSON = JSON.parse(relationStr);
    console.log("relationStr",relationJSON);
    var res:any[]=[];
    for(var i = 0; i < relationJSON.length; i++){
      var singleJSON = relationJSON[i];
      /*console.log("singleJson:","singleJSON");*/
      for(var key in singleJSON){
        /*console.log("check the person:",key);*/
        for(var j=0;j<singleJSON[key].length;j++){
         /* console.log("he follows*********:",singleJSON[key][j]);*/
          if(singleJSON[key][j]==userID){
            var followerId=key;
            var JsonFollower = JSON.parse(this.getUserInfoByUserID(followerId));
            res.push(JsonFollower);
          }
        }
      }
    }
    return res;
  }
  addFollowingByUsername(username:string):boolean{
    let addFollowingId=this.getUserIDByUsername(username);
    // if the added user's name is not exist
    if(addFollowingId==""){
      console.log("first:::::::::::::::::::::::::");
      return false;
    }

    let currentID = this.getUserIDByUsername(this.getCurrentUserName());
    if(currentID==addFollowingId){
      console.log("second:::::::::::::::::::::::::");
      return false;
    }
    var relationStr = localStorage.getItem("relationships");
    if(relationStr==null||relationStr==""){
      console.log("third:::::::::::::::::::::::::");
      return false;
    }
    var relationJSON = JSON.parse(relationStr);
    console.log("before:",relationJSON);
    var res:any[]=[];
    for(var i = 0; i < relationJSON.length; i++){
      var singleJSON = relationJSON[i];
      for(var key in singleJSON){
        if(key==this.getUserIDByUsername(this.getCurrentUserName())
        ){
          for(var j = 0; j < singleJSON[key].length; j++){
              if(singleJSON[key][j] == addFollowingId){
                return false;
              }
          }
          singleJSON[key].push(addFollowingId);
          localStorage.setItem("relationships",JSON.stringify(relationJSON));
          return true;
          }
        }
      }return true;
    }
  deleteRelationByFollowingId(deleteFollowingId:string):any[]{
    var relationStr = localStorage.getItem("relationships");
    if(relationStr==null||relationStr==""){
      return[];
    }
    var relationJSON = JSON.parse(relationStr);
    console.log("before:",relationJSON);
    var res:any[]=[];
    for(var i = 0; i < relationJSON.length; i++){
      var singleJSON = relationJSON[i];
      for(var key in singleJSON){
        if(key==this.getUserIDByUsername(this.getCurrentUserName())){
          console.log("current id:",key);
          //get the user info of the followings
          for(var j=0;j<singleJSON[key].length;j++){
            let followingId=singleJSON[key][j];
            if(followingId==deleteFollowingId){
              singleJSON[key].splice(j,1);
              localStorage.setItem("relationships",JSON.stringify(relationJSON));
              console.log("saved",relationJSON);
              break;
            }
          }
          for(var j=0;j<singleJSON[key].length;j++){
            let followingId=singleJSON[key][j];
            let userJson=this.getUserInfoByUserID(followingId);
            res.push(JSON.parse(userJson));
          }
          return res;
        }
      }
    }
    return [];
  }
}