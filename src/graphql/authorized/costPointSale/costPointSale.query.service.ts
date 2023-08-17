import { ICostPointSale } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class CostPointSaleQueryService {
    async getAllCostPointSale(): Promise<ICostPointSale[]>{
        try {
            const query = `SELECT 
                    gpv_codigo as codigo, 
                    gpv_codgas as gasto,
                    gpv_codpuv as punto_venta,
                    gpv_precio as precio,
                    gpv_activo as activo
                FROM public.gpv_gasto_punto_venta;`

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener los gastos asociados al puntos de venta', error)
            return []
        }
    }
    async getCostPointSaleById(codigo: number): Promise<ICostPointSale[]>{
        try {
            const query = `SELECT 
                    gpv_codigo as codigo, 
                    gpv_codgas as producto,
                    gpv_codpuv as punto_venta,
                    gpv_precio as precio,
                    gpv_activo as activo
                FROM public.gpv_gasto_punto_venta
                    where gpv_codigo = ${codigo};
                `

            const result = await pool.query(query);

            return result.rows;
        } catch (error) {
            console.error('Error al obtener los gastos asociados al puntos de venta', error)
            return []
        }
    }
}