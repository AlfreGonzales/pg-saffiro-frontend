import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Administración',
                items: [
                    { label: 'Roles', icon: 'pi pi-fw pi-th-large', routerLink: ['/roles'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/usuarios'] },
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
        ];
    }
}
