import {ComponentFixture, TestBed} from '@angular/core/testing';

import { MainService } from './main.service';
import {MainPageComponent} from "../main-page/main-page.component";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import pp = jasmine.pp;
import {MainComponent} from "./main.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ProfilePageComponent} from "../profile-page/profile-page.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('MainService', () => {
  let service: MainService;
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let router:Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainComponent ],
      providers:[MainService],
      imports: [
          RouterTestingModule.withRoutes([
              {path:'', component: MainComponent},
              {path:'main_page', component: MainPageComponent},
              {path:'profile_page', component: ProfilePageComponent},
          ]),
          HttpClientModule,
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


    /*fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);*/

    service = TestBed.inject(MainService);

    /*fixture.detectChanges();*/
  });

  it('service should be created', () => {
      localStorage.setItem("currentUser","Bret");
      expect(service).toBeTruthy();

  });

  it('test LogOut', () => {
    service.logOut();
    expect(localStorage.getItem("currentUser")).toEqual("");
  });

  it('test request User', (done) => {
    service.requestUser().toPromise().then(
        res=>{
          expect(res.length).toBeGreaterThan(3);
          done();
        }
    );
  });


 it('test checkLogin if userStr is null', () => {

    expect(service.checkLogin('Antonette','Victor Plains')).toBeTrue();

  });

/*  it('test checkUserNameAndPwd to be true', () => {

    expect(service.checkUserNameAndPwd("Antonette", "Victor Plains")).toBe(true);

  });*/
/*  it('test checkUserNameAndPwd to be false', () => {

    expect(service.checkUserNameAndPwd("A", "w")).toBeFalse();

  });*/

      it('test addFollowingByUsername by currentUserName (need false)', () => {
    var currentUserName = service.getCurrentUserName();
    expect(service.addFollowingByUsername(currentUserName)).toBeFalse();
  });
  it('test addFollowingByUsername by correctUserName (need true)', () => {
    expect(service.addFollowingByUsername("Bret")).toBeTrue();
  });
  it('test addFollowingByUsername by empty relation', () => {
    localStorage.removeItem("relationships");
    expect(service.addFollowingByUsername("Bret")).toBeFalse();
  });

  it('test addFollowingByUsername by person already in the relation', () => {
    localStorage.setItem("currentUser","Bret");
      expect(service.addFollowingByUsername("Antonette")).toBeFalse();
  });

  it('test addFollowingByUsername by person already in the relation', () => {
        localStorage.setItem("currentUser","Bret");
        expect(service.addFollowingByUsername("Maxime_Nienow")).toBeTrue();
    });

  it('test deleteRelationByFollowingId by null', () => {
    localStorage.removeItem("relationships");
    expect(service.deleteRelationByFollowingId("Bret")).toEqual([]);
  });

  it('test deleteRelationByFollowingId by one ', () => {
    expect(service.deleteRelationByFollowingId(service.getCurrentUserName())).toBeTruthy();
  });

  it('test deleteRelationByFollowingId by one ', () => {

   localStorage.setItem("currentUser","Bret");
    expect(service.deleteRelationByFollowingId("2")).toBeTruthy();
  });


  it('test requestUser info ', (done) => {
    //localStorage.removeItem("users");
    //service.requestUser();
    expect(service.saveUser()).toBeTrue();
    done();
  });
});