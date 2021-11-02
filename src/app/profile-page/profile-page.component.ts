import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MainService} from "../main/main.service";
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  getImgPath: string = "";
  txtName:string | null = "txtName";
  displayName:string = "displayName";
  emailAdd:string = "txtName";
  txtPhone:string = "txtName";
  birth:string = "txtName";
  txtZipcode:string = "txtName";
  pwd:string = "pwd";
  pwd2:string = "pwd2";
  myForm:FormGroup;
  myLoginForm:FormGroup;
  constructor(public router: Router, public service: MainService,) {
    let fb = new FormBuilder(); // for building formGroup
    this.myLoginForm =fb.group({
      myName: ['', { //for FormControl
        validators: [],
        updateOn: 'change'
      }],
      myPassword: ['', { //for FormControl
        validators: [],
        updateOn: 'change'
      }],
    })
    this.myForm = fb.group({
      txtName: ['', { //for FormControl
        validators: [],
        updateOn: 'change'
      }],
      displayName: ['', { //for FormControl
        validators: [],
        updateOn: 'change'
      }],
      emailAdd: ['', { //for FormControl
        validators: [this.validEmail],
        updateOn: 'change'
      }],
      txtPhone: ['', { //for FormControl
        validators: [this.validNumber],
        updateOn: 'change'
      }],
      birth: ['', { //for FormControl
        validators: [],
        updateOn: 'change'
      }],
      txtZipcode: ['', { //for FormControl
        validators: [Validators.maxLength(5),Validators.minLength(5)],
        updateOn: 'change'
      }],
      pwd: ['', { //for FormControl
        validators: [],
        updateOn: 'change'
      }],
      pwd2: ['', { //for FormControl
        validators: [],
        updateOn: 'change'
      }],
    }
    ,
        {
          validators:[this.samePwd]}
    )
    this.txtName=this.service.getCurrentUserName();
    if(this.txtName==null||this.txtName==""){
      this.router.navigateByUrl("");
      return;
    }
    if (typeof this.txtName === "string") {
      let userStr=this.service.getUserInfoByUserID(this.service.getUserIDByUsername(this.txtName));
      let userJson=JSON.parse(userStr);
      this.getImgPath=userJson.imgSrc;
      this.displayName=userJson.name;
      this.emailAdd=userJson.email;
      this.txtPhone=userJson.phone;
      this.txtZipcode=userJson.address.zipcode;
      this.pwd=userJson.password;
      this.pwd2=userJson.password;
     // this.birth="1998-8-1";//userJson.birth;
/*

      this.getImgPath = JSON.parse(<string>localStorage.getItem(this.txtName)).picture;

      this.displayName = JSON.parse(<string>localStorage.getItem(this.txtName)).name;
      this.emailAdd = JSON.parse(<string>localStorage.getItem(this.txtName)).email;
      this.txtPhone = JSON.parse(<string>localStorage.getItem(this.txtName)).phone;
      /!*      this.birth = JSON.parse(<string>localStorage.getItem(this.txtName));*!/
      this.txtZipcode = JSON.parse(<string>localStorage.getItem(this.txtName)).address.zipcode;
      this.pwd = JSON.parse(<string>localStorage.getItem(this.txtName)).password;
*/
      console.log(this.getImgPath);
    }
  }
  ngOnInit(): void {
  }
 /* onSubmit(value:any):void{
    console.log(value);
    console.log(value.user);
    this.service.saveInfo(value);
    this.router.navigateByUrl("main_page");
  }*/
/*  checkLogin(userName:string,Password:string):boolean{
    var myUserString = localStorage.getItem(userName);
    if(myUserString == null) return false;
    if(JSON.parse(<string>myUserString).password == Password){
      return true;
    } else {
      return false;
    }
  }*/
 /* onLogin(value:any):void{
    /!*        console.log(value);*!/
    var userName = value.myName;
    var Password = value.myPassword;
    console.log(userName);
    console.log(Password);
    if(this.checkLogin(userName,Password)){
      console.log(userName,Password);
      localStorage.setItem("current_user",userName);
      this.router.navigateByUrl("main_page");
    }else{
      console.log("error!")
    }
  }*/
/*  public workSpace():void{
    this.router.navigateByUrl("main_page");
  }*/
  onSubmit(formValue:any):boolean{
   /* if(this.pwd!=this.pwd2){
      this.pwd="";
      this.pwd2="";
      alert("password do NOT match!");
      return;
    }*/
    if(!this.myForm.valid){
      console.log("*****************",this.myForm.value);
      console.log("========",this.myForm.errors);
      return false;
    }
    let value:any={};
    value.name=this.displayName;
    value.email=this.emailAdd;
    value.phone=this.txtPhone;
    value.zipcode=this.txtZipcode;
    value.password=this.pwd;

    alert("modify success!");
    this.service.modifyUser(value);
    return true;
  }
  samePwd(controlGroup: FormGroup): any {
    // @ts-ignore
    let pw2 = controlGroup.get('pwd').value;
    // @ts-ignore
    let pw1=controlGroup.get('pwd2').value;

    if (pw2==pw1) {
      return null;
    } else {
      return {samePwd: {info: 'Password do NOT match!'}};
    }
  }
  validNumber(control: FormControl):any{
    let value=control.value;

    let reg=/([0-9]{3}[0-9]{3}[0-9]{4})+/;
    if(!reg.test(value)){
      return {validNumber:{info:'please input a valid number'}};
    }else{
      return null;
    }
  }
  validEmail(control: FormControl):any{
    let value=control.value;
    if(value==null||value==""){
      return null;
    }
    let reg=/([a-zA-Z0-9])+@([a-zA-Z0-9])+\.([a-zA-Z0-9])+/;
    if(!reg.test(value)){
      return {validEmail:{info:'please input a valid email'}};
    }else{
      return null;
    }
  }
}
