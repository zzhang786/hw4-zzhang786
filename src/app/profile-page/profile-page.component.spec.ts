import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageComponent } from './profile-page.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MainComponent} from "../main/main.component";
import {MainPageComponent} from "../main-page/main-page.component";
import {MainService} from "../main/main.service";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;
  let service: MainService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePageComponent ],
      imports:[
          RouterTestingModule.withRoutes(
              [
                {path:'', component: MainComponent},
                {path:'main_page',component:MainPageComponent},
                {path: 'profile_page',component:ProfilePageComponent},
              ]
          ),
          HttpClientModule,
          FormsModule,
          ReactiveFormsModule,
          MatToolbarModule,
          MatSidenavModule,
          MatCheckboxModule,
          MatIconModule,
          MatDividerModule,
          MatCardModule,
          BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MainService);
    fixture.detectChanges();

  });

  it('should create profilePageComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should not get loginUserInfo', () => {
    localStorage.removeItem('currentUser');
    expect(component).toBeTruthy();

  });
  it('should get loginUserInfo', () => {
    localStorage.setItem('currentUser','Bret');
    expect(component).toBeTruthy();
  });
  it('testModifyUserInfoToTrue', () => {
    component.myForm.get("displayName")?.setValue("Zan");
    component.myForm.get("emailAdd")?.setValue("zz@rice.edu");
    component.myForm.get("txtPhone")?.setValue("4792255494");
    component.myForm.get("txtZipcode")?.setValue("77007");
    component.myForm.get("pwd")?.setValue("123456");
    component.myForm.get("pwd2")?.setValue("123456");
    fixture.detectChanges();
    expect(component.onSubmit(component.myForm.value)).toBe(true);
  });
  it('testModifyUserInfoToFalse', () => {
    component.myForm.get("displayName")?.setValue("1");
    component.myForm.get("emailAdd")?.setValue("@");
    component.myForm.get("txtPhone")?.setValue("1");
    component.myForm.get("txtZipcode")?.setValue("1");
    component.myForm.get("pwd")?.setValue("12345");
    component.myForm.get("pwd2")?.setValue("123456");
    fixture.detectChanges();
    expect(component.onSubmit(component.myForm.value)).toBe(false);

  });

  it('Test Profile: should fetch the user\'s profile username', () => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.txtName).toEqual(service.getCurrentUserName());


  });
});
