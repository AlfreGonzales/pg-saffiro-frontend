export interface Sprint {
    id: number;
    nombre: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    objetivo: string;
    id_usuario: number;
    id_proyecto: number;
    created_at: Date;
}