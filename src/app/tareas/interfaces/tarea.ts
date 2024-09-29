export interface Tarea {
    id: number;
    id_tarea: number;
    id_usuario_dev: number;
    id_usuario_qa: number;
    estado: string;
    tarea: {
        id: number;
        nombre: string;
        descripcion: string;
        tipo: number;
        tiempo_estimado: number;
        peso: number;
        bugs_permitidos: number;
        prioridad: number;
        id_tarea: number;
        created_at: Date;
        tarea: {
            nombre: string;
        }
    }
    usuario_dev: {
        nombres: string;
    }
    usuario_qa: {
        nombres: string;
    }
}

/* export interface Tarea {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: number;
    tiempo_estimado: number;
    peso: number;
    bugs_permitidos: number;
    prioridad: number;
    id_tarea: number;
    created_at: Date;
}

export interface SprintTarea {
    id: number;
    id_tarea: number;
    id_usuario_dev: number;
    id_usuario_qa: number;
    estado: string;
}

export interface TareaCompleta extends Tarea {
    sprint_tarea: SprintTarea[];
} */
