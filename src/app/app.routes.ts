import { Routes } from '@angular/router';
import { NotfoundComponent } from './extra/notfound/notfound.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { RolesComponent } from './roles/roles.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Dashboards',
  },
  {
    path: '',
    component: AppLayoutComponent,
    title: 'Inicio',
    children: [
      {
        path: '',
        component: DashboardsComponent,
        title: 'Dashboards',
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        title: 'Usuarios',
      },
      {
        path: 'roles',
        component: RolesComponent,
        title: 'Roles',
      },
    ],
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: 'notfound' }
];
