import { ITypeCost } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class TypeCostQueryService{
    async getAllTypeCost(): Promise<ITypeCost[]>{
        try {
            const query = `select 
                        tig_codigo as codigo,
                        tig_nombre as nombre,
                        tig_descripcion as descripcion,
                        tig_es_gasto as es_gasto,
                        tig_activo as activo 
                    from tig_tipo_gasto`
        
            const result = await pool.query(query);
            return result.rows
        } catch (error) {
            console.error(`No se puede realizar la consultar para el tipo de costo, por ${error}`)
            return []
        }
    }
    async getTypeCostById(codigo: number): Promise<ITypeCost[]>{
        try {
            const query = `select 
                            tig_codigo as codigo,
                            tig_nombre as nombre,
                            tig_descripcion as descripcion,
                            tig_es_gasto as es_gasto,
                            tig_activo as activo 
                        from tig_tipo_gasto
                        where tig_codigo = ${codigo}`

            const result = await pool.query(query);
            return result.rows
        } catch (error) {
            console.error(`No se puede realizar la consultar para el tipo de costo, por ${error}`)
            return []
        }
    }
}
