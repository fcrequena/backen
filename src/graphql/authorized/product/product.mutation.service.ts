import pool from "../../../helpers/pg.conn";
import { IProduct } from "../../../interfaces/db.interface";

export default class ProductMutationService {
    async deleteProductById(params: IProduct): Promise<IProduct[]>{
        const { codigo } = params;
        try {

            const query = `UPDATE pro_producto
                            SET pro_activo = false
                            WHERE pro_codigo = ${codigo}
                            RETURNING pro_codigo as codigo, 
                                        pro_nombre as nombre,
                                        pro_descripcion as descripcion,
                                        pro_activo as activo,
                                        pro_codtip as tipo_producto;`;

            // const query = `DELETE FROM pro_producto
            //                 WHERE pro_codigo=${codigo}
            //                 RETURNING pro_codigo as codigo, 
            //                             pro_nombre as nombre,
            //                             pro_descripcion as descripcion,
            //                             pro_activo as activo,
            //                             pro_codtip as tipo_producto;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            throw new Error(`No fue posible realizar la accion solicitada para: Producto. ${error}`)
        }
    }
    async createProduct(params: IProduct): Promise<IProduct[]>{
        const { nombre, descripcion, activo, tipo_producto} = params
        try {
            const query = `INSERT INTO public.pro_producto
            (pro_nombre, pro_descripcion, pro_activo, pro_codtip)
            VALUES('${nombre}', '${descripcion}', ${activo}, ${tipo_producto})
            RETURNING pro_codigo as codigo, 
                        pro_nombre as nombre,
                        pro_descripcion as descripcion,
                        pro_activo as activo,
                        pro_codtip as tipo_producto;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            throw new Error(`No fue posible realizar la accion solicitada para: Producto. ${error}`)
        }
    }
    async updateProduct(params: IProduct): Promise<IProduct[]>{
        try {
            const {codigo, nombre, descripcion, activo, tipo_producto} = params

            const query = `UPDATE public.pro_producto
                SET pro_nombre='${nombre}', 
                    pro_descripcion='${descripcion}', 
                    pro_activo=${activo},
                    pro_codtip=${tipo_producto} 
                WHERE pro_codigo = ${codigo}
                RETURNING pro_codigo as codigo, 
                            pro_nombre as nombre,
                            pro_descripcion as descripcion,
                            pro_activo as activo,
                            pro_codtip as tipo_producto;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            throw new Error(`No fue posible realizar la accion solicitada para: Producto. ${error}`)
        }
    }
}