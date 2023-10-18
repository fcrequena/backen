import pool from "../../../helpers/pg.conn";
import { IProductPointSale } from "../../../interfaces/db.interface";

export default class ProductPointSaleMutationService {
    async deleteProductPointSaleById(params: IProductPointSale): Promise<IProductPointSale[]>{
        const { codigo } = params;
        try {
            // const query = `UPDATE ppv_producto_punto_venta 
            //                 SET ppv_activo = false
            //                 WHERE ppv_codigo = ${codigo}
            //                 RETURNING ppv_codigo as codigo, 
            //                             ppv_codpro as producto,
            //                             ppv_codpuv as punto_venta,
            //                             ppv_precio as precio,
            //                             ppv_activo as activo;`;

            const query = `DELETE FROM ppv_producto_punto_venta 
            WHERE ppv_codigo = ${codigo}
            RETURNING ppv_codigo as codigo, 
                        ppv_codpro as producto,
                        ppv_codpuv as punto_venta,
                        ppv_precio as precio,
                        ppv_activo as activo;`;
            

            const result = await pool.query(query);
            // if(result.rowCount == 0){
            //     return []
            // }
            console.log(result)
            return result.rows[0]
        } catch (error) {
            throw new Error(`No fue posible realizar la accion solicitada para: Producto asociados al punto de venta. ${error}`)
        }
    }
    async createProductPointSale(params: IProductPointSale): Promise<IProductPointSale[]>{
        const { producto, punto_venta, precio, activo } = params
        try {
            const query = `INSERT INTO ppv_producto_punto_venta
            (ppv_codpro, ppv_codpuv, ppv_precio, ppv_activo)
            VALUES('${producto}', '${punto_venta}', ${precio}, ${activo})
            RETURNING ppv_codigo as codigo, 
                        ppv_codpro as producto,
                        ppv_codpuv as punto_venta,
                        ppv_precio as precio,
                        ppv_activo as activo;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            throw new Error(`No fue posible realizar la accion solicitada para: Producto asociados al punto de venta. ${error}`)
        }
    }
    async updateProductPointSale(params: IProductPointSale): Promise<IProductPointSale[]>{
        try {
            const {codigo, producto, punto_venta, precio, activo} = params

            const query = `UPDATE ppv_producto_punto_venta
                SET ppv_codpro='${producto}', 
                    ppv_activo=${activo},
                    ppv_precio=${precio} 
                WHERE ppv_codigo = ${codigo}
                RETURNING ppv_codigo as codigo, 
                        ppv_codpro as producto,
                        ppv_codpuv as punto_venta,
                        ppv_precio as precio,
                        ppv_activo as activo;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            throw new Error(`No fue posible realizar la accion solicitada para: Producto asociados al punto de venta. ${error}`)
        }
    }
}