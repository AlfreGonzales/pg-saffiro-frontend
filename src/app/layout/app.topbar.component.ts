import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { LogAccesosService } from '../log-accesos/log-accesos.service';
import { LocalStorageService } from '../shared/services/local-storage.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private logAccesosService: LogAccesosService,
        private localStorageService: LocalStorageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.items = [
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: () => this.cerrarSesion()
            }
        ];
    }

    async cerrarSesion() {
        const resultado = await Swal.fire({
            title: "Desea cerrar sesión?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        });
        if (resultado.isConfirmed) {
            try {
                await this.crearLogAcceso();
                this.localStorageService.removeUsuario();
                await this.router.navigate(['auth/login']);
                Swal.fire({
                    title: "Correcto!",
                    text: "Ha cerrado sesión correctamente.",
                    icon: "success"
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    async crearLogAcceso() {
        try {
          const ipInfo: any = await firstValueFrom(this.logAccesosService.getIpInfo());
          const logAcceso: any = {
            ip: ipInfo.ip,
            accion: 'Cierre de sesión',
            ciudad: ipInfo.city,
            pais: ipInfo.country,
            detalle: navigator.appVersion,
            id_usuario: this.localStorageService.getUsuario().id
          }
          await firstValueFrom(this.logAccesosService.createLogAcceso(logAcceso));
        } catch (error) {
          console.error(error);
        }
    }
}
