export interface LogAcceso {
    id: number;
    ip: string;
    accion: string;
    ciudad: string;
    pais: string;
    detalle: string;
    id_usuario: number;
    created_at: Date;
}
