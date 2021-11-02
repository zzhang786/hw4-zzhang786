import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {MainService} from "../main/main.service";
import {Router} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MainComponent} from "../main/main.component";
import {ProfilePageComponent} from "../profile-page/profile-page.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let service: MainService;
  let router:Router;
  const routerSpy=jasmine.createSpyObj('Router',['navigateByUrl']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPageComponent ],
      providers:[MainService,{provide:Router,useValue:routerSpy}],
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
        MatSidenavModule,
        MatCheckboxModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        BrowserAnimationsModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MainService);
    router=fixture.debugElement.injector.get(Router);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test constructor', () => {
    spyOn(service.eventShowFollowing, 'subscribe').and.callThrough();

    service.eventShowFollowing.emit("2");

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(service.eventShowFollowing.subscribe).toHaveBeenCalled();
  });

  it('test navigateByUrl equal Null', () => {
     const spy = router.navigateByUrl as jasmine.Spy;
     localStorage.removeItem("currentUser");

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledWith("");
  });

  it('test relation change event', () => {
    spyOn(service.relationChangeEvent, 'subscribe').and.callThrough();
    localStorage.setItem('currentUser','Bret');

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service.relationChangeEvent.emit("Bret");

    expect(service.relationChangeEvent.subscribe).toHaveBeenCalled();
});

  it('test addNewPost', () => {
    component.title = "new title";
    component.content = "new content";
    expect(component.addNewPost()).toBe(true);
  });

  it('Test Article: should fetch articles for current logged in user (posts state is set)', () => {
    localStorage.setItem('currentUser','Bret');

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    //get all the authors
    let allAuthors:string[]=[]
    let curId=service.getUserIDByUsername(service.getCurrentUserName());
    allAuthors.push(curId);
    //add followings' id
    let followings=service.getfollowingByUserID(curId);
    followings.forEach(following=>{
      allAuthors.push(following.id);
    })//finished

    component.showPosts.forEach(post=>{
      expect(allAuthors).toContain(post.userId);
    });

    console.log("this is my showPost:::", component.showPosts);
    //expect(component.showPosts);

  });

  // Test Article: should filter displayed articles by the search keyword (posts state is filtered)
  it('  Test Article: should filter displayed articles by the search keyword', () => {
    component.searchWords="Bret";
    component.searchByWords();
    component.showPosts.forEach(post=>{
      expect(JSON.stringify(post)).toContain("Bret");
    });
  });



  it('test changeStatus', () => {
    spyOn(service.eventChangeStatus, 'emit').and.callThrough();
    component.status = service.getStatusByUsername(service.getCurrentUserName());
    component.changeStatus();
    expect(service.eventChangeStatus.emit).toHaveBeenCalled();
  });



});
