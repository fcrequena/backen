// export interface IUser {
//     email: string;
//     token: string;
//     roles: string[];
//     password: string;
// }

export interface ITypeRol{
    codigo: number;
    mensaje: string; 
    activo: boolean;
}
export interface IMessage{
    codigo: number;
    mensaje: string; 
}

export interface IUser{
    codigo: number;
    nombre: string;
    correo: string;
    activo: boolean;
    password: string;
    roles: string[];
    token: string;
    vencimiento: string;
    inicio: string;
}

export interface IBook {
    id: number;
    title: string;
    author: string;
    pagesNumber: number;
}

export interface IRol {
    codigo: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
}

export interface ITypeProduct{
    codigo: number;
    nombre: string;
    descripcion: string;
    es_producto: boolean;
    activo: boolean;
}

export interface IProduct{
    codigo: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    tipo_producto: number;
}

export interface IPointSale{
    codigo: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    cantidad: number;
}

export interface IProductPointSale{
    codigo: number;
    producto: number;
    punto_venta: number;
    precio: number;
    activo: boolean;
}

export interface IJournal{
    codigo_punto_venta: number;
}


export interface IJournalDetail{
    codigo_dia: number;
}

export interface IRepJournal{
    codigo: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    cantidad: number;
    fecha: Date;
}

export interface IRepJournalDetail{
    codigo: number; 
    codigo_dia: number; 
    codigo_producto: number; 
    cantidad: number; 
    cantidad_personas: number; 
    descripcion: string;  
}

export interface IRepFondo{
    fon_codigo: number;
    fon_nombre: string; 
    fon_porcentaje: number;
    fon_es_fondo: boolean;
}