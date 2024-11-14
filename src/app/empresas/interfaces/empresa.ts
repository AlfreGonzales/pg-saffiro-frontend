export interface Empresa {
    id: number;
    nit: string;
    nombre: string;
    descripcion: string;
    direccion: string;
    contacto: string;
    representante: string;
    estado_logico: boolean;
    created_at: Date;
}
