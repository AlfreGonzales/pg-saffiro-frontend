import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

export const sharedImports = [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToolbarModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    RadioButtonModule,
    DialogModule,
    TagModule,
    SweetAlert2Module
];

export const sharedProviders = [
    // Proveedores comunes como servicios
];
