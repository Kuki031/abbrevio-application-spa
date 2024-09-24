import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './auth-actions/login/login.component';
import { RegisterComponent } from './auth-actions/register/register.component';
import { authGuard } from './auth-actions/auth/guard.guard';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent, canActivate: [authGuard] },
    { path: "register", component: RegisterComponent, canActivate: [authGuard] }
];