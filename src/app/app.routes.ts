import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './auth-actions/login/login.component';
import { RegisterComponent } from './auth-actions/register/register.component';
import { authGuard, redirectIfAuthenticatedGuard } from './auth-actions/auth/guard.guard';
import { AbbreviationListComponent } from './abbreviation/abbreviation-list/abbreviation-list.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent, canActivate: [redirectIfAuthenticatedGuard] },
    { path: "register", component: RegisterComponent, canActivate: [redirectIfAuthenticatedGuard] },
    { path: "abbreviations", component: AbbreviationListComponent, canActivate: [authGuard] }
];