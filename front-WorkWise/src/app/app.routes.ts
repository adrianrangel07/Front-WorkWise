import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { personaLoginComponent } from './Persona/login/login.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { RegisterComponent } from './Persona/register/register.component';
import { PerfilComponent } from './Persona/perfil/perfil.component';
import { empresaLoginComponent } from './Empresa/login/login.component';
import { PostulacionesPendientesComponent } from './Persona/postulaciones-pendientes/postulaciones-pendientes.component';

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
        component: personaLoginComponent
    },

    {
        path: 'registerPersona',
        component: RegisterComponent
    },

    {
        path: 'perfilPersona',
        component: PerfilComponent
    },
    {
        path: 'postulacionesPendientes',
        component: PostulacionesPendientesComponent
    },

    // empresa
    {
        path: 'loginEmpresa',
        component: empresaLoginComponent
    }
];
