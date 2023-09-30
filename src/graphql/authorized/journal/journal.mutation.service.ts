import pool from "../../../helpers/pg.conn";
import { IJournal } from "../../../interfaces/db.interface";
export default class JournalMutationService{
    async createJournal(params: IJournal): Promise<IJournal[]>{
        const {
            codigo, codigo_dia, codigo_producto, cantidad, cantidad_personas, descripcion
        } = params;

        try {
            if(codigo_dia === undefined){
                const qDia = `select dia_codigo,
                                    dia_codpuv, 
                                    dia_fecha,
                                    dia_abierto
                            from dia_diario dd
                            where date_trunc('day', dia_fecha) = date_trunc('day', now());`
                const rDia = await pool.query(qDia);

                if(rDia.rowCount == 0 ){

                    const qProducto = `SELECT ppv_codigo as codigo, 
                                        ppv_codpro as producto, 
                                        ppv_codpuv as punto_venta, 
                                        ppv_precio, 
                                        ppv_activo
                    FROM public.ppv_producto_punto_venta;
                        where ppv_codpro = ${codigo_producto}
                    ;`

                    const rProducto = await pool.query(qProducto);
                    const codigo_punto_venta = rProducto.rows[0];

                    const qCreaDia = `INSERT INTO public.dia_diario
                    (dia_codpuv, dia_fecha, dia_abierto)
                    VALUES( ${codigo_punto_venta.punto_venta}, now(), true);`

                    const rCreaDia = await pool.query(qCreaDia);

                }

            }

            return []
        } catch (error) {
            console.error(`No se pudo registrar el registro diarios ${error}`)
            return []
        }
    }      
}