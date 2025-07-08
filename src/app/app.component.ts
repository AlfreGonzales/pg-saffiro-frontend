import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutModule } from './layout/app.layout.module'; //SI QUITO DA ERROR XD
import { PrimeNGConfig } from 'primeng/api';
import { AppConfig, LayoutService } from './layout/service/app.layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pg-saffiro-frontend';

  constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    // Traducción al español
    this.primengConfig.setTranslation({
      accept: 'Aceptar',
      reject: 'Rechazar',
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
                        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar',
      weak: 'Débil',
      medium: 'Medio',
      strong: 'Fuerte',
      passwordPrompt: 'Ingresa una contraseña',
      emptyMessage: 'No se encontraron resultados',
      emptyFilterMessage: 'No se encontraron coincidencias'
    });

    //NOTA: configuracion de estilos de la app
    const config: AppConfig = {
        ripple: true,                       //efecto animacion de ondas en los botones
        inputStyle: 'outlined',             //estilo de fondo de los inputs "outlined" o "filled"
        menuMode: 'static',                 //menu lateral "static" o "overlay"
        colorScheme: 'light',               //tema "light" o "dark" va asociado con el siguiente parametro
        theme: 'lara-light-indigo',         //tema por defecto, aun no se cambiar de tema (en styles.scss)
        scale: 14                           //tamaño de letra global, va desde el "12" al "16"
    };
    this.layoutService.config.set(config);
}
}
