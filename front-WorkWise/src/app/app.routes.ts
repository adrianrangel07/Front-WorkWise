import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OfertasComponent } from './ofertas/ofertas.component';

// empresa
import { OfertasEmpresaComponent } from './Empresa/ofertas-empresa/ofertas-empresa.component';
import { EmpresaRegisterComponent } from './Empresa/empresa-register/empresa-register.component';
import { empresaLoginComponent } from './Empresa/login/login.component';
import { CrearOfertaComponent } from './Empresa/crear-oferta/crear-oferta.component';
import { authEmpresaGuard } from './guards/auth-empresa.guard';


// persona
import { authPersonaGuard } from './guards/auth-persona.guard';
import { PostulacionesPendientesComponent } from './Persona/postulaciones-pendientes/postulaciones-pendientes.component';
import { RegisterComponent } from './Persona/register/register.component';
import { PerfilComponent } from './Persona/perfil/perfil.component';
import { personaLoginComponent } from './Persona/login/login.component';


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
        component: personaLoginComponent,
    },

    {
        path: 'registerPersona',
        component: RegisterComponent,
    },

    {
        path: 'perfilPersona',
        component: PerfilComponent,
        canActivate: [authPersonaGuard]
    },
    {
        path: 'postulacionesPendientes',
        component: PostulacionesPendientesComponent,
        canActivate: [authPersonaGuard]
    },

    // empresa
    {
        path: 'loginEmpresa',
        component: empresaLoginComponent,
    },

    {
        path: 'RegisterEmpresa',
        component: EmpresaRegisterComponent,
    },

    {
        path: 'ofertas-empresa',
        component: OfertasEmpresaComponent,
        canActivate: [authEmpresaGuard]
    },

    {
        path: 'crear-oferta',
        component: CrearOfertaComponent,
        canActivate: [authEmpresaGuard]
    },

    // ⚠️ Ruta por defecto (404)
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }