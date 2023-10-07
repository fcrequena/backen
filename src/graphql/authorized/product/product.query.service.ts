import { IProduct } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class ProductQueryService {
    async getAllProduct(): Promise<IProduct[]>{
        try {
            const query = `SELECT 
                    pro_codigo as codigo, 
                    pro_nombre as nombre, 
                    pro_descripcion as descripcion, 
                    pro_activo as activo, 
                    pro_codtip as tipo_producto 
                FROM public.pro_producto
                where pro_activo = true;
                `

            const result = await pool.query(query);

            return result.rows;
        } catch (error) {
            console.error('Error al obtener productos', error)
            return []
        }
    }
    async getProductoById(codigo: number): Promise<IProduct[]>{
        try {
            const query = `SELECT 
                    pro_codigo as codigo, 
                    pro_nombre as nombre, 
                    pro_descripcion as descripcion, 
                    pro_activo as activo, 
                    pro_codtip as tipo_producto 
                FROM public.pro_producto
                    where pro_codigo = ${codigo};
                `

            const result = await pool.query(query);

            if(result.rows[0] == undefined)
                throw new Error("Registro no encontrado.");

            return result.rows;
        } catch (error) {
            throw new Error(error);
            return []
        }
    }

    async getProductoByTypeProductId(codigo: number): Promise<IProduct[]>{
        try {
            const query = `SELECT 
                            pro_codigo as codigo, 
                            pro_nombre as nombre, 
                            pro_descripcion as descripcion, 
                            pro_activo as activo, 
                            pro_codtip as tipo_producto 
                        FROM public.pro_producto
                            where pro_codtip = ${codigo};`
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            //console.error('Error al obtener productos', error)
            throw new Error(error);
            return []
        }
    }
}