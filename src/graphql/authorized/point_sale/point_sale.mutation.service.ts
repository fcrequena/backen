import pool from "../../../helpers/pg.conn";
import { IPointSale } from "../../../interfaces/db.interface";

export default class PointSaleMutationService {
    async deletePointSaleById(params: IPointSale): Promise<IPointSale[]>{
        const { codigo } = params;
        try {
            const query = `UPDATE puv_punto_venta
                                SET puv_activo = false
                            WHERE puv_codigo=${codigo}
                            RETURNING puv_codigo as codigo, 
                                        puv_nombre as nombre,
                                        puv_descripcion as descripcion,
                                        puv_activo as activo,
                                        puv_cantidad as cantidad;`;
        // const query = `DELETE FROM puv_punto_venta
        // WHERE puv_codigo=${codigo}
        // RETURNING puv_codigo as codigo, 
        //             puv_nombre as nombre,
        //             puv_descripcion as descripcion,
        //             puv_activo as activo,
        //             puv_cantidad as cantidad;`;
            const result = await pool.query(query);

            if(result.rowCount == 0){
                return []
            }
            return result.rows[0]
        } catch (error) {
            throw new Error(`No fue posible realizar la accion solicitada para: Punto de Venta. ${error}`)
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
            throw new Error(`No fue posible realizar la accion solicitada para: Punto de Venta. ${error}`)
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
            throw new Error(`No fue posible realizar la accion solicitada para: Punto de Venta. ${error}`)
        }
    }
    async getPointSaleById(codigo: number): Promise<IPointSale[]>{
        try {
            const query = `SELECT 
                    puv_codigo as codigo, 
                    puv_nombre as nombre, 
                    puv_descripcion as descripcion, 
                    puv_activo as activo, 
                    puv_cantidad as cantidad 
                FROM public.puv_punto_venta
                inner join upv_usuario_punto_venta on puv_codigo = upv_codpuv
                where upv_codusr = ${codigo};
                `

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener puntos de venta ${error}`)
        }
    }
}