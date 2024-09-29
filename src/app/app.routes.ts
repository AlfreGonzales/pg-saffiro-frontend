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
import { ListadoProyectosComponent } from './proyectos/listado-proyectos/listado-proyectos.component';
import { TableroProyectosComponent } from './proyectos/tablero-proyectos/tablero-proyectos.component';
import { TableroTareasComponent } from './tareas/tablero-tareas/tablero-tareas.component';
import { ListadoTareasComponent } from './tareas/listado-tareas/listado-tareas.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: '',
    component: AppLayoutComponent,
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
        children: [
          {
            path: 'tablero',
            component: TableroProyectosComponent,
            title: 'Tablero de proyectos',
            canActivate: [loginGuard]
          },
          {
            path: 'listado',
            component: ListadoProyectosComponent,
            title: 'Listado de proyectos',
            canActivate: [loginGuard]
          },
        ]
      },
      {
        path: 'tareas',
        children: [
          {
            path: 'tablero',
            component: TableroTareasComponent,
            title: 'Tablero de tareas',
            canActivate: [loginGuard]
          },
          {
            path: 'listado',
            component: ListadoTareasComponent,
            title: 'Listado de tareas',
            canActivate: [loginGuard]
          },
        ]
      },
    ],
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: 'notfound' }
];
