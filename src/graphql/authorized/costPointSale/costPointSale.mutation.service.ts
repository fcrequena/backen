import pool from "../../../helpers/pg.conn";
import { ICostPointSale } from "../../../interfaces/db.interface";

export default class CostPointSaleMutationService {
    async deleteCostPointSaleById(params: ICostPointSale): Promise<ICostPointSale[]>{
        const { codigo } = params;
        try {
            const query = `DELETE FROM gpv_gasto_punto_venta 
                            WHERE gpv_codigo = ${codigo}
                            RETURNING gpv_codigo as codigo, 
                                        gpv_codgas as gasto,
                                        gpv_codpuv as punto_venta,
                                        gpv_precio as precio,
                                        gpv_activo as activo;`;

            const result = await pool.query(query);
            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            console.error(`No fue posible realizar la accion solicitada para: asociar un gasto al punto de venta. ${error}`)
            return []
        }
    }
    async createCostPointSale(params: ICostPointSale): Promise<ICostPointSale[]>{
        const { gasto, punto_venta, precio, activo } = params
        try {
            const query = `INSERT INTO gpv_gasto_punto_venta
            (gpv_codgas, gpv_codpuv, gpv_precio, gpv_activo)
            VALUES('${gasto}', '${punto_venta}', ${precio}, ${activo})
            RETURNING gpv_codigo as codigo, 
                        gpv_codgas as gasto,
                        gpv_codpuv as punto_venta,
                        gpv_precio as precio,
                        gpv_activo as activo;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            console.error(`No fue posible realizar la accion solicitada para: asociar un gasto al punto de venta. ${error}`)
            return []
        }
    }
    async updateCostPointSale(params: ICostPointSale): Promise<ICostPointSale[]>{
        try {
            const {codigo, gasto, punto_venta, precio, activo} = params

            const query = `UPDATE gpv_gasto_punto_venta
                SET gpv_codgas='${gasto}', 
                    gpv_codpuv='${punto_venta}', 
                    gpv_activo=${activo},
                    gpv_precio=${precio} 
                WHERE gpv_codigo = ${codigo}
                RETURNING gpv_codigo as codigo, 
                        gpv_codgas as gasto,
                        gpv_codpuv as punto_venta,
                        gpv_precio as precio,
                        gpv_activo as activo;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            console.error(`No fue posible realizar la accion solicitada para: asociar un gasto al punto de venta. ${error}`)
            return []
        }
    }
}