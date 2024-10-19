export interface Proyecto {
    id: number;
    nombre: string;
    descripcion: string;
    costo_estimado: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: string;
    id_equipo: number;
    created_at: Date;
}
