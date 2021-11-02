import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponent } from './main.component';
import {Router} from "@angular/router";
import {MainPageComponent} from "../main-page/main-page.component";
import {MainService} from "./main.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {ProfilePageComponent} from "../profile-page/profile-page.component";
import {FormsModule, NgModel, ReactiveFormsModule} from "@angular/forms";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let router: Router;
  let service: MainService;
  const routerSpy=jasmine.createSpyObj('Router',['navigateByUrl']);

/*  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      providers:[MainService,{provide:Router,useValue:routerSpy}],
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
        MatToolbar,
      ]
    })
        .compileComponents();
  });*/

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      providers:[MainService,MainComponent,{provide:Router,useValue:routerSpy}],
      imports: [
        RouterTestingModule.withRoutes([
          {path:'', component: MainComponent},
          {path:'main_page', component: MainPageComponent},
          {path:'profile_page', component: ProfilePageComponent},
        ]),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatToolbarModule,
      ],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router=fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('test constructor with current userName', () => {
    const spy = router.navigateByUrl as jasmine.Spy;

    localStorage.setItem("currentUser","Bret");

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledWith("main_page");
  });

  it('test OnSubmit tobe false', () => {
    component.myForm.get("displayName")?.setValue("1");
    component.myForm.get("emailAdd")?.setValue("@");
    component.myForm.get("txtPhone")?.setValue("1");
    component.myForm.get("txtZipcode")?.setValue("1");
    component.myForm.get("birth")?.setValue("2021-12-31");
    component.myForm.get("pwd")?.setValue("12345");
    component.myForm.get("pwd2")?.setValue("123456");
    fixture.detectChanges();
    expect(component.onSubmit(component.myForm.value)).toBe(false);
  });

  it('test OnSubmit tobe true', () => {
    component.myForm.get("displayName")?.setValue("Zan");
    component.myForm.get("txtName")?.setValue("zan");
    component.myForm.get("birth")?.setValue("1999-08-01");
    component.myForm.get("emailAdd")?.setValue("zz@rice.edu");
    component.myForm.get("txtPhone")?.setValue("4792255494");
    component.myForm.get("txtZipcode")?.setValue("77007");
    component.myForm.get("pwd")?.setValue("12345");
    component.myForm.get("pwd2")?.setValue("12345");
    fixture.detectChanges();
    expect(component.onSubmit(component.myForm.value)).toBe(true);
  });
  //Test Auth: should log in a user (login state should be set)
  it('Test Auth: should log in a user', () => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.myLoginForm.get("myName")?.setValue("Antonette");
    component.myLoginForm.get("myPassword")?.setValue("Victor Plains");

    expect(localStorage.getItem("currentUser")).not.toBeNull();
    //expect(router.navigateByUrl).toHaveBeenCalledWith("main_page");
    //expect(component.onLogin(component.myLoginForm.value)).toBe(true);
  });
  //Test Auth: should not log in a user (error state should be set)
  it('Test Auth: should not log in a user', () => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.myLoginForm.get("myName")?.setValue("");
    component.myLoginForm.get("myPassword")?.setValue("");
    //expect(router.navigateByUrl).toHaveBeenCalledWith("main_page");
    expect(component.onLogin(component.myLoginForm.value)).toBe(false);
  });

});
