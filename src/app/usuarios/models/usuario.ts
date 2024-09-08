export interface Usuario {
    id: number;
    ci: string;
    nombres: string;
    apellidos: string;
    email: string;
    password: string;
    estado_logico: boolean;
    id_rol: number;
    created_at: Date;
}

interface InventoryStatus {
    label: string;
    value: string;
}
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: InventoryStatus;
    category?: string;
    image?: string;
    rating?: number;
}
