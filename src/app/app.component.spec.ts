import {ComponentFixture, TestBed} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MainPageComponent} from "./main-page/main-page.component";
import {MainComponent} from "./main/main.component";
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MainService} from "./main/main.service";
import {Router} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: MainService;
  let router:Router;
  const routerSpy=jasmine.createSpyObj('Router',['navigateByUrl']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path:'', component: MainComponent},
          {path:'main_page', component: MainPageComponent},
          {path:'profile_page', component: ProfilePageComponent},
        ]),
        HttpClientModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatToolbarModule,
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers:[MainService,{provide:Router,useValue:routerSpy}],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MainService);

    router=fixture.debugElement.injector.get(Router);
    fixture.detectChanges();

  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'tian'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('tian');
  });

/*  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('tian app is running!');
  });

//ask
  it('test Constructor To False',() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.currentUserInfo = [];
    expect(app.followingList && app.currentUserInfo).toEqual([]);
    expect(app.showIfAddFollowing).toBeFalse();

  });*/

  //test toMain
  it('test toMain', () => {
    const spy=router.navigateByUrl as jasmine.Spy;

    component.toMain();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(router.navigateByUrl).toHaveBeenCalledWith('');
  });

  //test toMainPage
  it('test toMainPage', () => {
    const spy=router.navigateByUrl as jasmine.Spy;

    component.toMainPage();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(router.navigateByUrl).toHaveBeenCalledWith('main_page');
  });

  //test toProfilePage
  it('test toProfilePage', () => {
    const spy=router.navigateByUrl as jasmine.Spy;

    component.toProfilePage();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(router.navigateByUrl).toHaveBeenCalledWith('profile_page');
  });


  //test change sideBar
  it('test change sideBar', () => {
    if(component.openFlag==false){
      component.changeSideBar();
      expect(component.openFlag).toBeTrue();
    }else {
      component.changeSideBar();
      expect(component.openFlag).toBeFalse();
    }
  });

  //test showFollowingPage
  it('test change showFollowingPage', () => {
     component.showFollowingPage('1');
     expect(service.eventShowFollowing.subscribe).toBeTruthy();
  });

  //test LogOut
  it('test LogOut', () => {
    const spy=router.navigateByUrl as jasmine.Spy;

    component.logOut();
    expect(router.navigateByUrl).toHaveBeenCalledWith('');
  });


  //test unfollow
  it('test unfollow', () => {

    spyOn(service.relationChangeEvent, 'emit').and.callThrough();
    component.unfollow("Bret");
    expect(service.relationChangeEvent.emit).toHaveBeenCalled();

  });


  //test addFollowing
  it('test addFollowing',() =>{
    spyOn(service.relationChangeEvent, 'emit').and.callThrough();
    localStorage.setItem("currentUser","Kamren");
    component.newFollowingUserNameToAdd="Moriah.Stanton";
    component.addFollowing();
    expect(service.relationChangeEvent.emit).toHaveBeenCalled();
  });


  //test constructor1
  it('test constructor when username is null', () => {
    spyOn(service.eventChangeStatus, 'subscribe').and.callThrough();

    service.eventChangeStatus.emit('new status');

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(service.eventChangeStatus.subscribe).toHaveBeenCalled();

  });
  // test constructor2
  it('test constructor with correct username', () => {
    spyOn(service.userChangeEvent, 'subscribe').and.callThrough();
    service.userChangeEvent.emit('Bret');

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(service.userChangeEvent.subscribe).toHaveBeenCalled();

  });


  // Test Auth: should log out a user (login state should be cleared)
  it('Test Auth: should log out a user', () => {
    component.logOut();
    expect(service.getCurrentUserName()).toEqual("");
  });

  // Test Article: should add articles when adding a follower (posts state is larger)
  it('Test Article: should add articles when adding a follower (posts state is larger)', () => {
    localStorage.setItem('currentUser','Bret');
    component.newFollowingUserNameToAdd='Moriah.Stanton';
    component.addFollowing();

    let showPosts=service.getPostByUserName("Bret");
    let newUserId=service.getUserIDByUsername('Moriah.Stanton');

    var isContainFlag = false;
    showPosts.forEach(post=> {
      if(post.userId==newUserId){
        isContainFlag=true;
      }
    });
    expect(isContainFlag).toBeTrue();
  });

  //   Test Article: should remove articles when removing a follower (posts state is smaller)
  it('Test Article: should remove articles when removing a follower', () => {
    localStorage.setItem('currentUser','Bret');
    component.unfollow('2');
    let showPosts=service.getPostByUserName("Bret");
    var isContainFlag = false;
    showPosts.forEach(post=> {
      if(post.username == 'Antonette'){
        isContainFlag = true;
      }
    });
     expect(isContainFlag).toBeFalse();

  });

});