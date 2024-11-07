import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { authInfoInterceptor } from './auth/auth-info.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { errorHandlerInterceptor } from './shared/interceptors/error-handler.interceptor';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { environment } from '../enviroments/environment';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule, SweetAlert2Module.forRoot()),
    provideHttpClient(withInterceptors([authInfoInterceptor, errorHandlerInterceptor])),
    MessageService,
    { provide: LOCALE_ID, useValue: 'es' },
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideDatabase(() => getDatabase())
  ]
};
