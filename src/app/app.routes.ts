import { Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './auth-actions/login/login.component';
import { RegisterComponent } from './auth-actions/register/register.component';
import { authGuard, redirectIfAuthenticatedGuard } from './auth-actions/auth/guard.guard';
import { AbbreviationListComponent } from './abbreviation/abbreviation-list/abbreviation-list.component';
import { ProfileComponent } from './auth-actions/profile/profile.component';
import { AbbrevationFormComponent } from './abbreviation/abbrevation-form/abbrevation-form.component';
import { CreateModalComponent } from './modals/create-modal/create-modal.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent, canActivate: [redirectIfAuthenticatedGuard] },
    { path: "register", component: RegisterComponent, canActivate: [redirectIfAuthenticatedGuard] },
    { path: "abbreviations", component: AbbreviationListComponent, canActivate: [authGuard] },
    { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
    { path: "abbreviations/new", component: AbbrevationFormComponent, canActivate: [authGuard] },
    { path: "abbreviations/update/:id", component: AbbrevationFormComponent, canActivate: [authGuard] }
];