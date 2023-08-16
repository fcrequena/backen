import { ICost } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class CostMutationService {
    async deleteCost(params: ICost): Promise<ICost[]>{
        try {
            const { codigo } = params;
            const query = `DELETE FROM public.gas_gasto
                        WHERE gas_codigo=${codigo};`
            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puedo realizar la acción sobre los Gastos por: ${error}`)
            return []    
        }
    }
    async createCost(params: ICost): Promise<ICost[]>{
        try {
            const { codigo, nombre, descripcion, activo, tipo_gasto } = params;
            const query = `INSERT INTO public.gas_gasto
                                (gas_nombre, 
                                gas_descripcion, 
                                gas_es_gasto, 
                                gas_activo, 
                                gas_codtig)
                                VALUES('${nombre}', '${descripcion}', true, ${activo}, ${tipo_gasto});`
            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puedo realizar la acción sobre los Gastos por: ${error}`)
            return []    
        }
        
    }
    async updateCost(params: ICost): Promise<ICost[]>{
        try {
            const { codigo, nombre, descripcion, activo, tipo_gasto } = params;
            const query = `UPDATE public.gas_gasto
                            SET gas_nombre='${nombre}', 
                            gas_descripcion='${descripcion}', 
                            gas_es_gasto=true, 
                            gas_activo=${activo}, 
                            gas_codtig=${tipo_gasto}
                            WHERE gas_codigo = ${codigo};`
            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puedo realizar la acción sobre los Gastos por: ${error}`)
            return []    
        }
        
    }

}