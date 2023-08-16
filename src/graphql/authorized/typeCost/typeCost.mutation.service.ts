import { ITypeCost } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class TypeCostMutationService {
    async deleteTypeCostById(params: ITypeCost): Promise<ITypeCost[]> {
        try {
            const {codigo} = params;
            const query = `DELETE FROM public.tig_tipo_gasto
                            WHERE tig_codigo=${codigo};`;
            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puede realizar la operacion para el tipo de costo, por ${error}`)
            return []
        }
    }
    async createTypeCost(params: ITypeCost): Promise<ITypeCost[]>{
        try {
            let {codigo, nombre, descripcion, es_gasto, activo} = params;

            const query = `INSERT INTO public.tig_tipo_gasto
                            (tig_nombre, tig_descripcion, tig_es_gasto, tig_activo)
                            VALUES('${nombre}', '${descripcion}', ${es_gasto}, ${activo});`;

            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puedo realizar la operacion para el tipo de gasto, por ${error}`)
            return []
        }
    }
    async updateTypeCost(params: ITypeCost): Promise<ITypeCost[]>{
        try {
            let {codigo, nombre, descripcion, es_gasto, activo} = params;
            const query = `UPDATE public.tig_tipo_gasto
                            SET tig_nombre='${nombre}', 
                                tig_descripcion='${descripcion}', 
                                tig_es_gasto=${es_gasto}, 
                                tig_activo=${activo}
                            WHERE tig_codigo=${codigo};`;
            const result = pool.query(query);
            return result.rows;
        } catch (error) {
            console.error(`No se puedo realizar la operacion para el tipo de gasto, por ${error}`)
            return []
        }
    }
}