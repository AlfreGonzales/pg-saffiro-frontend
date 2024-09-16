import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Modulos } from '../shared/enums/modulos';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private localStorageService: LocalStorageService
    ) { }

    ngOnInit() {
        const usuarioInfo = this.localStorageService.getUsuario();
        const permisos = usuarioInfo.permisos;

        this.model = [
            {
                label: 'Inicio',
                items: [
                    { id: Modulos.DASHBOARDS, label: 'Dashboards', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Administración',
                items: [
                    { id: Modulos.ROLES, label: 'Roles', icon: 'pi pi-fw pi-th-large', routerLink: ['/roles'] },
                    { id: Modulos.USUARIOS, label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/usuarios'] },
                    { id: Modulos.LOG_ACCESOS, label: 'Log de accesos', icon: 'pi pi-fw pi-history', routerLink: ['/log-accesos'] }
                ]
            },
            {
                label: 'Proyectos',
                items: [
                    { id: Modulos.TAREAS, label: 'Tareas', icon: 'pi pi-fw pi-book', routerLink: ['/tareas'] },
                    { id: Modulos.PROYECTOS, label: 'Proyectos', icon: 'pi pi-fw pi-th-large', routerLink: ['/proyectos'] },
                    { id: Modulos.EMPRESAS, label: 'Empresas', icon: 'pi pi-fw pi-building', routerLink: ['/empresas'] }
                ]
            }
        ].map(seccion => ({
            ...seccion,
            items: seccion.items.filter(item => permisos.includes(item.id))
        })).filter(seccion => seccion.items.length > 0);
    }
}
