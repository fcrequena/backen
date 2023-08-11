import { ITypeProduct } from "../../../interfaces/db.interface";
import pool  from "../../../helpers/pg.conn";

export default class TypeQueryService {
    async getAllTypeProduct(): Promise<ITypeProduct[]> {
        try {
            const query = `SELECT
                tip_codigo as codigo,
                tip_nombre as nombre,
                tip_descripcion as descripcion,
                tip_es_producto as es_producto, 
                tip_activo as activo
            FROM tip_tipo_producto`
            const result = await pool.query(query);
            return result.rows;
            
        } catch (error) {
            console.error('Erro al obtener Tipo de producto', error);
            return []
        }
        
    }

    async getTypeProductById(codigo): Promise<ITypeProduct[]> {
        try {
            const query = `SELECT
                    tip_codigo as codigo,
                    tip_nombre as nombre,
                    tip_descripcion as descripcion,
                    tip_es_producto as es_producto, 
                    tip_activo as activo
                FROM tip_tipo_producto
                WHERE tip_codigo = ${codigo}`

            const result = await pool.query(query);
            return result.rows;
            
        } catch (error) {
            console.error('Erro al obtener Tipo de producto', error);
            return []
        }
    }
}