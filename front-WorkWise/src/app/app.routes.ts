import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './Persona/login/login.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { RegisterComponent } from './Persona/register/register.component';
import { PerfilComponent } from './Persona/perfil/perfil.component';

export const routes: Routes = [
    // invitados
    { 
        path: 'dashboard', 
        component: DashboardComponent 
    },
    { 
        path: '', 
        redirectTo: '/dashboard', 
        pathMatch: 'full' 
    },
    {
        path: 'ofertasInicio',
        component: OfertasComponent
    },


    // persona
    {
        path: 'loginPersona',
        component: LoginComponent
    },

    {
        path: 'registerPersona',
        component: RegisterComponent
    },

    {
        path: 'perfilPersona',
        component: PerfilComponent
    }


];
