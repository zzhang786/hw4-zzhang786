import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {ProfilePageComponent} from "./profile-page/profile-page.component";

const routes: Routes = [
    {path:'main',component:MainComponent},
    {path:'main_page',component:MainPageComponent},
    {path: 'profile_page',component:ProfilePageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
