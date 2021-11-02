import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MainService} from "./main.service";
import {FormBuilder, FormControl, Validator, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
myForm:FormGroup;
myLoginForm:FormGroup;
  constructor(public router: Router, public service: MainService,) {

      let fb = new FormBuilder(); // for building formGroup
      this.myLoginForm =fb.group({
          myName: ['Bret', { //for FormControl
              validators: [Validators.required,],
              updateOn: 'change'
          }],
          myPassword: ['Kulas Light', { //for FormControl
              validators: [Validators.required,],
              updateOn: 'change'
          }],
      })
      this.myForm = fb.group({
          txtName: ['', { //for FormControl
              validators: [Validators.required,this.validAccountName],
              updateOn: 'change'
          }],
          displayName: ['', { //for FormControl
              validators: [Validators.required,],
              updateOn: 'change'
          }],
          emailAdd: ['', { //for FormControl
              validators: [Validators.required,this.validEmail],
              updateOn: 'change'
          }],
          txtPhone: ['', { //for FormControl
              validators: [Validators.required,this.validNumber, Validators.maxLength(10),],
              updateOn: 'change'
          }],
          birth: ['', { //for FormControl
              validators: [Validators.required,this.checkAdult],
              updateOn: 'change'
          }],
          txtZipcode: ['', { //for FormControl
              validators: [Validators.required, Validators.maxLength(5), Validators.minLength(5)],
              updateOn: 'change'
          }],
          pwd: ['', { //for FormControl
              validators: [Validators.required,],
              updateOn: 'change'
          }],
          pwd2: ['', { //for FormControl
              validators: [Validators.required,],
              updateOn: 'change'
          }],
    },{
          validators: [this.samePwd],
      }
    )
      if(this.service.getCurrentUserName()!=null && this.service.getCurrentUserName()!="" ){
          this.router.navigateByUrl("main_page");
          return;
      }
  }
  ngOnInit(): void {
  }
  onSubmit(value:any):boolean{
      console.log(value);
      if(!this.myForm.valid){
          console.log("!!!!!!!",this.myForm.errors)
          return false;
      }
      //console.log(value.user);

      this.service.saveInfo(value);
      this.router.navigateByUrl("main_page");
      return true;
    }

    onLogin(value:any):boolean{
    console.log(":::::::::: ", value);
        var userName = value.myName;
        var Password = value.myPassword;
        console.log("userName::::::: ", userName);
        console.log("password::::::: ", Password);

        if(this.service.checkLogin(userName,Password)){

            this.service.changeCurrentUser(userName);
            this.router.navigateByUrl("main_page");
            return true;
        }else{
            return false;
        }
    }
/*public workSpace():void{
    this.router.navigateByUrl("main_page");
}*/

    validNumber(control: FormControl):any{
        let value=control.value;

        let reg=/([0-9]{3}[0-9]{3}[0-9]{4})+/;
        if(!reg.test(value)){
            return {validNumber:{info:'please input a valid number'}};
        }else{
            return null;
        }
    }
    validAccountName(control: FormControl):any{
        let value=control.value;

        let reg=/(^[a-zA-Z])+([a-zA-Z0-9])*/;
        if(!reg.test(value)){
            return {validAccountName:{info:'please input a valid accountName'}};
        }else{
            return null;
        }
    }

    checkAdult(control: FormControl):any{
        let birthDate=new Date(control.value);
        let today=new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if(age<18){
            return {checkAdult:{info:'Can NOT register under 18'}};
        }else{
            return null;
        }
    }

    samePwd(controlGroup: FormGroup): any {
        // @ts-ignore
        let pw2 = controlGroup.get('pwd').value;
        // @ts-ignore
        let pw1=controlGroup.get('pwd2').value;

        if (pw2==pw1) {
            return null;
        } else {
            return {samePwd: {info: 'password do NOT match!'}};
        }
    }
    validEmail(control: FormControl):any{
        let value=control.value;
        let reg=/([a-zA-Z0-9])+@([a-zA-Z0-9])+\.([a-zA-Z0-9])+/;
        if(!reg.test(value)){
            return {validEmail:{info:'please input a valid email'}};
        }else{
            return null;
        }
    }
}
