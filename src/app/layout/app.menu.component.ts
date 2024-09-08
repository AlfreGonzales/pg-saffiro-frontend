import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Modulos } from '../shared/enums/modulos';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        const storage = localStorage.getItem('usuario');
        const usuarioInfo = JSON.parse(storage!);
        const accesosPermitidos = usuarioInfo.rol.modulos.split(', ');

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
                    { label: 'Log de accesos', icon: 'pi pi-fw pi-history', routerLink: ['/log-accesos'] }
                ]
            },
            {
                label: 'Proyectos',
                items: [
                    { label: 'Tareas', icon: 'pi pi-fw pi-book', routerLink: ['/tareas'] },
                    { label: 'Proyectos', icon: 'pi pi-fw pi-th-large', routerLink: ['/proyectos'] },
                    { label: 'Empresas', icon: 'pi pi-fw pi-building', routerLink: ['/empresas'] }
                ]
            }
        ].map(seccion => ({
            ...seccion,
            items: seccion.items.filter(item => accesosPermitidos.includes(item.id))
        })).filter(seccion => seccion.items.length > 0);
    }
}
