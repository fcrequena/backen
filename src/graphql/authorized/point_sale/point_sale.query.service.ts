import { IPointSale } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class PointSaleQueryService {
    async getAllPointSale(): Promise<IPointSale[]>{
        try {
            const query = `SELECT 
                    puv_codigo as codigo, 
                    puv_nombre as nombre, 
                    puv_descripcion as descripcion, 
                    puv_activo as activo, 
                    puv_cantidad as cantidad 
                FROM public.puv_punto_venta
                where puv_activo = true;
                `

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener puntos de venta', error)
            return []
        }
    }
    async getPointSaleById(codigo: number): Promise<IPointSale[]>{
        try {
            const query = `SELECT 
                    puv_codigo as codigo, 
                    puv_nombre as nombre, 
                    puv_descripcion as descripcion, 
                    puv_activo as activo, 
                    puv_cantidad as cantidad 
                FROM public.puv_punto_venta
                    where puv_codigo = ${codigo};
                `

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener puntos de venta', error)
            return []
        }
    }
}