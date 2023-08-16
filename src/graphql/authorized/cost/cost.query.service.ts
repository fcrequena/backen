import { ICost } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class CostQueryService {
    async getAllCost(params: ICost): Promise<ICost[]>{
        try {
            const query = `SELECT 
                                gas_codigo as codigo, 
                                gas_nombre as nombre, 
                                gas_descripcion as descripcion, 
                                gas_es_gasto as es_gasto, 
                                gas_activo as activo, 
                                gas_codtig as tipo_gasto
                            FROM public.gas_gasto;`
            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puedo realizar la acción sobre los Gastos por: ${error}`)
            return []    
        }
    }
    async getCostByID(params: ICost): Promise<ICost[]>{
        try {
            const { codigo } = params;
            const query = `SELECT 
                                gas_codigo as codigo, 
                                gas_nombre as nombre, 
                                gas_descripcion as descripcion, 
                                gas_es_gasto as es_gasto, 
                                gas_activo as activo, 
                                gas_codtig as tipo_gasto
                            FROM public.gas_gasto
                            WHERE gas_codigo = ${codigo};`
            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puedo realizar la acción sobre los Gastos por: ${error}`)
            return []    
        }
        
    }

}