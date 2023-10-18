import { IProductPointSale } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class ProductPointSaleQueryService {
    async getAllProductPointSale(): Promise<IProductPointSale[]>{
        try {
            const query = `SELECT 
                    ppv_codigo as codigo, 
                    ppv_codpro as producto,
                    ppv_codpuv as punto_venta,
                    ppv_precio as precio,
                    ppv_activo as activo
                FROM public.ppv_producto_punto_venta
                WHERE ppv_activo = true;
                `

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener puntos de venta ${error}`)
        }
    }
    async getProductPointSaleById(codigo: number): Promise<IProductPointSale[]>{
        try {
            const query = `SELECT 
                    ppv_codigo as codigo, 
                    ppv_codpro as producto,
                    ppv_codpuv as punto_venta,
                    ppv_precio as precio,
                    ppv_activo as activo
                FROM public.ppv_producto_punto_venta
                    where ppv_codigo = ${codigo};
                `

            const result = await pool.query(query);

            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener puntos de venta ${error}`)
        }
    }
    async getFindByPointSaleId(codigo: number): Promise<IProductPointSale[]>{
        try {
            const query = `SELECT 
                    ppv_codigo as codigo, 
                    ppv_codpro as producto,
                    ppv_codpuv as punto_venta,
                    ppv_precio as precio,
                    ppv_activo as activo
                FROM public.ppv_producto_punto_venta
                    where ppv_activo = true and ppv_codpuv = ${codigo};
                `

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener puntos de venta ${error}`)
        }
    }
}