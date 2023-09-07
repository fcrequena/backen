import pool  from "../../../helpers/pg.conn";
import { ITypeProduct } from "../../../interfaces/db.interface";

export default class TypeProductMutationService {
    async deleteTypeProductById(params: ITypeProduct): Promise<ITypeProduct[]>{
        const {codigo} = params
        try {
            const query = `DELETE FROM tip_tipo_producto
                WHERE tip_codigo = ${codigo}
            RETURNING  tip_codigo as codigo, 
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
            console.error({deleteTypeProductById: error})
            return []
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
            console.error({createTypeProduct: error})
            return []
        }
    }
    async updateTypeProduct(params: ITypeProduct): Promise<ITypeProduct[]>{
        const { codigo, nombre, descripcion, es_producto, activo } = params

        try {
            const query = `UPDATE tip_tipo_producto
                SET 
                tip_nombre='${nombre}', 
                tip_descripcion='${descripcion}', 
                tip_es_producto='${es_producto}', 
                tip_activo='${activo}'
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
            console.error({updateTypeProduct: error})
            return []
        }
    }
}