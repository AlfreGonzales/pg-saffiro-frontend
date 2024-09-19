import { Routes } from '@angular/router';
import { NotfoundComponent } from './extra/notfound/notfound.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { RolesComponent } from './roles/roles.component';
import { LoginComponent } from './auth/login/login.component';
import { loginGuard } from './auth/login/login.guard';
import { LogAccesosComponent } from './log-accesos/log-accesos.component';
import { authResolver } from './auth/auth.resolver';
import { ProyectosComponent } from './proyectos/proyectos.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: '',
    component: AppLayoutComponent,
    title: 'Inicio',
    resolve: { authInfo: authResolver },
    children: [
      {
        path: '',
        component: DashboardsComponent,
        title: 'Dashboards',
        canActivate: [loginGuard]
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        title: 'Usuarios',
        canActivate: [loginGuard]
      },
      {
        path: 'roles',
        component: RolesComponent,
        title: 'Roles',
        canActivate: [loginGuard]
      },
      {
        path: 'log-accesos',
        component: LogAccesosComponent,
        title: 'Log de accesos',
        canActivate: [loginGuard]
      },
      {
        path: 'proyectos',
        component: ProyectosComponent,
        title: 'Proyectos',
        canActivate: [loginGuard]
      }
    ],
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: 'notfound' }
];
