import pool  from "../../../helpers/pg.conn";
import { ITypeProduct } from "../../../interfaces/db.interface";

export default class TypeProductMutationService {
    async deleteTypeProductById(params: ITypeProduct): Promise<ITypeProduct[]>{
        const {codigo} = params
        try {
            const query = `UPDATE tip_tipo_producto
                SET tip_activo = false
                WHERE tip_codigo = ${codigo}
            RETURNING  tip_codigo as codigo, 
                        tip_nombre as nombre, 
                        tip_descripcion as descripcion, 
                        tip_es_producto as es_producto, 
                        tip_activo as activo;`
            // const query = `DELETE FROM tip_tipo_producto
            //     WHERE tip_codigo = ${codigo}
            // RETURNING  tip_codigo as codigo, 
            //             tip_nombre as nombre, 
            //             tip_descripcion as descripcion, 
            //             tip_es_producto as es_producto, 
            //             tip_activo as activo;`

            const result = await pool.query(query);
            if(result.rowCount == 0 ){
                return []
            }

            return result.rows[0]
        } catch (error) {
            throw new Error(`Error al realizar la accion sobre el producto ${error}`)
        }
    }
    async createTypeProduct(params: ITypeProduct): Promise<ITypeProduct[]>{

        const {nombre, descripcion, es_producto, activo} = params

        
        try {
            const query = `INSERT INTO tip_tipo_producto
                        (tip_nombre,tip_descripcion,tip_es_producto,tip_activo)
                VALUES('${nombre}', '${descripcion}', ${es_producto}, ${activo})
            RETURNING tip_codigo as codigo, 
                tip_nombre as nombre, 
                tip_descripcion as descripcion, 
                tip_es_producto as es_producto, 
                tip_activo as activo;`

            const result = await pool.query(query);
            if(result.rowCount == 0 ){
                return []
            }
            return result.rows[0]
        } catch (error) {
            throw new Error(`Error al realizar la accion sobre el producto ${error}`)
        }
    }
    async updateTypeProduct(params: ITypeProduct): Promise<ITypeProduct[]>{
        const { codigo, nombre, descripcion, es_producto, activo } = params

        try {
            //tip_activo='${activo}'
            const query = `UPDATE tip_tipo_producto
                SET 
                tip_nombre='${nombre}', 
                tip_descripcion='${descripcion}', 
                tip_es_producto='${es_producto}',
                tip_activo = tip_activo
                WHERE tip_codigo=${codigo}
            RETURNING 
                tip_codigo as codigo, 
                tip_nombre as nombre, 
                tip_descripcion as descripcion, 
                tip_es_producto as es_producto, 
                tip_activo as activo;`

            const result = await pool.query(query);

            if(result.rowCount == 0 ){
                return []
            }

            return result.rows[0]
        } catch (error) {
            throw new Error(`Error al realizar la accion sobre el producto ${error}`)
        }
    }
}