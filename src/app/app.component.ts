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
