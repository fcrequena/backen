import pool from "../../../helpers/pg.conn";
import { IJournal, IJournalDetail, IRepJournal } from "../../../interfaces/db.interface";
export default class JournalMutationService{
    async createJournal(params: IJournal): Promise<IJournal[]>{
        const {
            codigo_punto_venta
        } = params;
        
        try {
            if(codigo_punto_venta !== undefined){
                const qConsultaDia = `SELECT 
                            dia_codigo as codigo_dia,
                            dia_codpuv as codigo_punto_venta, 
                            dia_fecha as fecha,
                            dia_abierto as abierto
                        FROM public.dia_diario
                    WHERE dia_codpuv = ${codigo_punto_venta}
                        and date_trunc('day', dia_fecha) = date_trunc('day', now());`;

                const rConsultaDia = await pool.query(qConsultaDia);

                if(rConsultaDia.rowCount === 0 || rConsultaDia.rowCount === undefined){
                    
                    const qCreaDia = `INSERT INTO public.dia_diario
                        (dia_codpuv, dia_fecha, dia_abierto)
                    VALUES( ${codigo_punto_venta}, date_trunc('day', now()), true)
                    RETURNING dia_codigo as codigo_dia,
                    dia_codpuv as codigo_punto_venta, 
                    dia_fecha as fecha,
                    dia_abierto as abierto ;`
                    
                    const rCreaDia = await pool.query(qCreaDia);
                        
                        return rCreaDia.rows[0];
                }else {
                    return rConsultaDia.rows[0];
                }
                

            }else{
                throw new Error('Debe ingresar el codigo del punto de venta.')
            }
        } catch (error) {
            throw new Error(`No se pudo registrar el registro diarios ${error}`)
        }
    }
    async createJournalDetail(params): Promise<IJournal[]>{
        try {
            const {
                codigo_dia, codigo_producto, cantidad, cantidad_personas, descripcion
            } = params;

            const qCreateDetail =`
            INSERT INTO public.did_diario_detalle
            (did_coddia, did_codppv, did_cantidad, did_cantidad_persona, did_descripcion)
            VALUES(${codigo_dia}, ${codigo_producto}, ${cantidad}, ${cantidad_personas}, '${descripcion}')
            RETURNING did_codigo as codigo,
            did_coddia as codigo_dia, 
            did_codppv as codigo_producto, 
            did_cantidad as cantidad, 
            did_cantidad_persona as cantidad_personas, 
            did_descripcion as descripcion;
            `; 
        
            const rCreateDetail = await pool.query(qCreateDetail);
            
            return rCreateDetail.rows[0]
            
        } catch (error) {
            throw new Error(`No se pudo registrar el detalle registro diarios ${error}`);
            
        }
    }

    async editJournalDetail(params): Promise<IJournal[]>{
        try {
            const {
                codigo_detalle, codigo_dia, codigo_producto, cantidad, cantidad_personas, descripcion
            } = params;

            const qCreateDetail =`
                UPDATE public.did_diario_detalle
                SET did_cantidad = ${cantidad} ,
                    did_descripcion = '${descripcion}'
                WHERE did_coddia = ${codigo_dia}
                    and did_codigo = ${codigo_detalle}
                RETURNING did_codigo as codigo,
                    did_coddia as codigo_dia, 
                    did_codppv as codigo_producto, 
                    did_cantidad as cantidad, 
                    did_cantidad_persona as cantidad_personas, 
                    did_descripcion as descripcion;
            `; 
        
            const rCreateDetail = await pool.query(qCreateDetail);
            return rCreateDetail.rows[0]
            
        } catch (error) {
            throw new Error(`No se pudo editar el registro ${error}`);
            
        }
    }

    async deleteJournalDetail(params): Promise<IJournal[]>{
        try {
            const {
                codigo_detalle, codigo_dia, cantidad, cantidad_personas, descripcion
            } = params;

            const qDeleteDetail =`
            DELETE FROM public.did_diario_detalle
            WHERE did_coddia = ${codigo_dia} 
                and did_codigo = ${codigo_detalle}
            RETURNING did_codigo as codigo,
                did_coddia as codigo_dia, 
                did_codppv as codigo_producto, 
                did_cantidad as cantidad, 
                did_cantidad_persona as cantidad_personas, 
                did_descripcion as descripcion;
            `; 
            const rDeleteDetail = await pool.query(qDeleteDetail);
            
            return rDeleteDetail.rows[0]
            
        } catch (error) {
            throw new Error(`No se pudo editar el registro ${error}`);
            
        }
    }

    async getJournalDetailForDay(params): Promise<IJournalDetail[]>{
        try {

            const { codigo } = params;

            const qConsultaDetalle = `
            select
                did_codigo as codigo_detalle,
                pp.pro_codigo as codigo_producto,
                pp.pro_nombre as nombre_producto,
                ddd2.did_cantidad as cantidad,
                ddd2.did_descripcion as descripcion,
                pppv.ppv_precio as precio,
                ttp.tip_es_producto as tipo_producto
            from dia_diario dd
                inner join did_diario_detalle ddd2 on dd.dia_codigo = ddd2.did_coddia
                inner join ppv_producto_punto_venta pppv on ddd2.did_codppv = pppv.ppv_codigo 
                inner join pro_producto pp on pppv.ppv_codpro = pp.pro_codigo
                inner join tip_tipo_producto ttp on pp.pro_codtip = ttp.tip_codigo           		
            where dd.dia_codpuv = ${codigo}
            and date_trunc('day', dia_fecha) = date_trunc('day', now())
            `; 

            const rConsultaDetalle = await pool.query(qConsultaDetalle);
            
            return rConsultaDetalle.rows
        } catch (error) {
            throw new Error(`No se pudo consultar el detalle registro diarios ${error}`);
        }
    }

    async getReportJournal(params): Promise<IRepJournal[]>{
        try {

        const {codigo_punto_venta, fecha_inicio, fecha_fin} = params;

        const query = `select 
            ppv.puv_codigo as codigo,
            ppv.puv_nombre as nombre,
            ppv.puv_descripcion as descripcion,
            ppv.puv_activo as activo,
            ppv.puv_cantidad as cantidad,
            now() as fecha
        from puv_punto_venta ppv 
            where ppv.puv_codigo = ${codigo_punto_venta};`

             const result = await pool.query(query);
             return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener cabecera de reporte ${error}`) 
        }
    }

}