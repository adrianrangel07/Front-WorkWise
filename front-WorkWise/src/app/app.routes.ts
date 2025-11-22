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
import { EditarOfertaComponent } from './Empresa/editar-oferta/editar-oferta.component';

// persona
import { authPersonaGuard } from './guards/auth-persona.guard';
import { PostulacionesPendientesComponent } from './Persona/postulaciones-pendientes/postulaciones-pendientes.component';
import { PostulacionesResueltasComponent } from './Persona/postulaciones-resueltas/postulaciones-resueltas.component';
import { RegisterComponent } from './Persona/register/register.component';
import { PerfilComponent } from './Persona/perfil/perfil.component';
import { personaLoginComponent } from './Persona/login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResourcesComponent } from './resources/resources.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';


export const routes: Routes = [
    // invitados
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { animation: 'HomePage' }
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'ofertasInicio',
        component: OfertasComponent,
        data: { animation: 'ofertasInicio' }
    },
    {
        path: 'estadisticas',
        component: EstadisticasComponent,
        data: { animation: 'estadisticas' }
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { animation: 'forgotPassword' }
    },

    {
        path: 'resources',
        component: ResourcesComponent,
        data: { animation: 'resources' }
    },

    // persona
    {
        path: 'loginPersona',
        component: personaLoginComponent,
        data: { animation: 'loginPersona' }
    },

    {
        path: 'registerPersona',
        component: RegisterComponent,
        data: { animation: 'registerPersona' }
    },

    {
        path: 'perfilPersona',
        component: PerfilComponent,
        canActivate: [authPersonaGuard],
        data: { animation: 'perfilPersona' }

    },
    {
        path: 'postulaciones-pendientes',
        component: PostulacionesPendientesComponent,
        canActivate: [authPersonaGuard],
        data: { animation: 'postulacionesPendientes' }
    },
    {
        path: 'postulaciones-resueltas',
        component: PostulacionesResueltasComponent,
        canActivate: [authPersonaGuard],
        data: { animation: 'postulacionesResueltas' }
    },

    // empresa
    {
        path: 'loginEmpresa',
        component: empresaLoginComponent,
        data: { animation: 'loginEmpresa' }
    },

    {
        path: 'RegisterEmpresa',
        component: EmpresaRegisterComponent,
        data: { animation: 'RegisterEmpresa' }
    },

    {
        path: 'ofertas-empresa',
        component: OfertasEmpresaComponent,
        canActivate: [authEmpresaGuard],
        data: { animation: 'ofertas-empresa' }
    },

    {
        path: 'crear-oferta',
        component: CrearOfertaComponent,
        canActivate: [authEmpresaGuard],
        data: { animation: 'crear-oferta' }
    },
    {
        path: 'editar-oferta',
        component: EditarOfertaComponent,
        canActivate: [authEmpresaGuard],
        data: { animation: 'editar-oferta' }
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