import { IRepJournal, IRepJournalDetail, IRepFondo } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";

export default class ProductQueryService {
    async getReportJournalDetail(parent, parametros): Promise<IRepJournalDetail[]>{
        const codigo_tipo_producto = parent.codigo;
        // console.log({codigo_tipo_producto, nombre: parent.nombre, parametros})

        const { codigo_punto_venta, fecha_inicio, fecha_fin } = parametros;
        try {

            const queryDias = `
            select
                pppv.ppv_codpuv as codigo_punto_venta,
                tip_codigo as codigo_tipo, 
                tip_nombre as nombre_tipo, 
                pro_codigo  as codigo_producto, 
                pp.pro_nombre as nombre_producto,  
                case when pppv.ppv_precio is null then 0 else pppv.ppv_precio end as precio,
                sum(did_cantidad) cantidad
            from tip_tipo_producto ttp
                inner join pro_producto pp on ttp.tip_codigo = pp.pro_codtip
                left outer join ppv_producto_punto_venta pppv on pp.pro_codigo = pppv.ppv_codpro 
                left outer join  did_diario_detalle ddd on pppv.ppv_codigo = ddd.did_codppv 
                left outer join dia_diario dd on ddd.did_coddia  = dd.dia_codigo 
            where ttp.tip_codigo = ${codigo_tipo_producto}
                and date_trunc('day', dia_fecha) between '${fecha_inicio}' and '${fecha_fin}'
                and dd.dia_codpuv = ${codigo_punto_venta}
            group by pppv.ppv_codpuv,
                tip_codigo, 
                tip_nombre, 
                pro_codigo, 
                pp.pro_nombre,  
                case when pppv.ppv_precio is null then 0 else pppv.ppv_precio end
            order by pro_nombre desc;`
            const resDias = await pool.query(queryDias);
            const ventas = resDias.rows;
                    
            const queryProductos = `
            select
                tip_codigo as codigo_tipo_producto, 
                tip_nombre as nombre_tipo_producto, 
                pp.pro_codigo as codigo_producto,
                pp.pro_nombre as nombre_producto
            from tip_tipo_producto ttp
                inner join pro_producto pp on ttp.tip_codigo = pp.pro_codtip
            where ttp.tip_codigo = ${codigo_tipo_producto}
            order by pro_nombre desc;
            `
            
            const resProductos = await pool.query(queryProductos)
            const arrayProductos = resProductos.rows;


            const productos = arrayProductos.map(producto => {
                const ventasPorProducto = ventas.find(ventaProducto => ventaProducto.codigo_producto === producto.codigo_producto);
                if(ventasPorProducto){
                    return Object.assign({}, producto, ventasPorProducto)
                }
                return producto;
            })

            let resultadoProductos = [];
            let totalIngresos = 0;
            productos.forEach(vProducto => {
                let cantidadProducto = vProducto.cantidad === undefined ? 0 : vProducto.cantidad
                totalIngresos = totalIngresos + ((vProducto.precio ? vProducto.precio : 0) * cantidadProducto)
                resultadoProductos.push(
                    {
                        codigo_producto: vProducto.codigo_producto,
                        nombre_producto: vProducto.nombre_producto,
                        precio: vProducto.precio ? vProducto.precio : 0,
                        cantidad: cantidadProducto,
                        total: (vProducto.precio ? vProducto.precio : 0) * cantidadProducto
                    }
                )
            })

            console.log({totalIngresos, resultadoProductos})
            return resultadoProductos

        } catch (error) {
            throw new Error(`Error al obtener detalles ${error}`)
        }
    }
    async getFondosGastos(): Promise<IRepFondo[]>{
        try {

            const qFondos = `select 
                                fon_codigo, 
                                fon_nombre, 
                                fon_porcentaje,  
                                fon_es_fondo
                            from fon_fondos ff
                            where fon_activo = true;
                            `
            
            const resFondo = await pool.query(qFondos);
            const fondos = resFondo.rows;

            return fondos;

        } catch (error) {
            throw new Error(`Error al obtener detalles ${error}`)
        }
    }

}