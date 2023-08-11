import pool from "../../../helpers/pg.conn";
import { IPointSale } from "../../../interfaces/db.interface";

export default class PointSaleMutationService {
    async deletePointSaleById(params: IPointSale): Promise<IPointSale[]>{
        const { codigo } = params;
        try {
            const query = `DELETE FROM puv_punto_venta
                            WHERE puv_codigo=${codigo}
                            RETURNING puv_codigo as codigo, 
                                        puv_nombre as nombre,
                                        puv_descripcion as descripcion,
                                        puv_activo as activo,
                                        puv_cantidad as cantidad;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            console.error(`No fue posible realizar la accion solicitada para: Punto de Venta. ${error}`)
            return []
        }
    }
    async createPointSale(params: IPointSale): Promise<IPointSale[]>{
        const { nombre, descripcion, activo, cantidad} = params
        try {
            const query = `INSERT INTO puv_punto_venta
            (puv_nombre, puv_descripcion, puv_activo, puv_cantidad)
            VALUES('${nombre}', '${descripcion}', ${activo}, ${cantidad})
            RETURNING puv_codigo as codigo, 
                        puv_nombre as nombre,
                        puv_descripcion as descripcion,
                        puv_activo as activo,
                        puv_cantidad as cantidad;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            console.error(`No fue posible realizar la accion solicitada para: Punto de Venta. ${error}`)
            return []
        }
    }
    async updatePointSale(params: IPointSale): Promise<IPointSale[]>{
        try {
            const {codigo, nombre, descripcion, activo, cantidad} = params

            const query = `UPDATE puv_punto_venta
                SET puv_nombre='${nombre}', 
                    puv_descripcion='${descripcion}', 
                    puv_activo=${activo},
                    puv_cantidad=${cantidad} 
                WHERE puv_codigo = ${codigo}
                RETURNING puv_codigo as codigo, 
                            puv_nombre as nombre,
                            puv_descripcion as descripcion,
                            puv_activo as activo,
                            puv_cantidad as cantidad;`;

            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            console.error(`No fue posible realizar la accion solicitada para: Punto de Venta. ${error}`)
            return []
        }
    }
}