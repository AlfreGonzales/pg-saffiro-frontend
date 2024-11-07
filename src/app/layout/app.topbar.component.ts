import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { LogAccesosService } from '../log-accesos/log-accesos.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { NotificacionesService } from './service/notificaciones.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [DatePipe, NotificacionesService]
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    notificaciones: any[] = [];

    noLeido = 0;

    constructor(
        public layoutService: LayoutService,
        private logAccesosService: LogAccesosService,
        private localStorageService: LocalStorageService,
        private router: Router,
        private notificacionesService: NotificacionesService,
        private datePipe: DatePipe
    ) {
        this.notificacionesService.getNotificaciones().subscribe(iNotificacion => {
            this.notificaciones.unshift(iNotificacion);
        });

        this.notificacionesService.getUnreadCount().subscribe(iNoLeido => {
            this.noLeido = iNoLeido;
        });
    }

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

    diffFechas(fecha: string) {
        const fechaNotificacion = new Date(fecha);
        const fechaActual = new Date();
        const diff = fechaActual.getTime() - fechaNotificacion.getTime();
        const diffMinutos = diff / (1000 * 60);
        if (diffMinutos < 1) {
            return 'Hace unos segundos';
        } else if (diffMinutos < 60) {
            return `Hace ${Math.floor(diffMinutos)} minuto(s)`;
        } else {
            const diffHoras = diffMinutos / 60;
            if (diffHoras < 24) {
                return `Hace ${Math.floor(diffHoras)} hora(s)`;
            } else {
                const diffDias = diffHoras / 24;
                if (diffDias < 30) {
                    return `Hace ${Math.floor(diffDias)} día(s)`;
                } else {
                    return this.datePipe.transform(fechaNotificacion, 'dd/MM/yyyy');
                }
            }
        }
    }

    notificacionLeida(notification: any) {
        const readNotifications = JSON.parse(localStorage.getItem('readNotifications') ?? '[]');
        if (!readNotifications.includes(notification.id)) {
            readNotifications.push(notification.id);
            localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
            this.notificaciones = this.notificaciones.map(iNotificacion => {
                if (iNotificacion.id === notification.id) {
                    iNotificacion.read = true;
                }
                return iNotificacion;
            });
            this.notificacionesService.notiLeida();
        }

        if (notification.link) {
            this.localStorageService.setIdProyecto(notification.extra_info[0]);
            this.localStorageService.setIdSprint(notification.extra_info[1]);
            this.router.navigate([notification.link], {
                queryParams: { id_elemento: notification.id_elemento }
            });
        }
    }
}
