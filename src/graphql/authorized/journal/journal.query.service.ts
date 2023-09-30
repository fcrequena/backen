import { IRepJournal, IRepJournalDetail } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";
import { query } from "express";

export default class ProductQueryService {
    async getReportJournal(codigo_punto_venta: number): Promise<IRepJournal[]>{
        try {
            const query = `select 
            ppv.puv_codigo as codigo,
            ppv.puv_nombre as nombre,
            ppv.puv_descripcion as descripcion,
            ppv.puv_activo as activo,
            ppv.puv_cantidad as cantidad,
            now() as fecha
        from puv_punto_venta ppv 
            where ppv.puv_codigo = ${codigo_punto_venta};
                `

             const result = await pool.query(query);
             return result.rows;
        } catch (error) {
            console.error('Error al obtener cabecera de reporte', error)
            return []
        }
    }
    async getReportJournalDetail(codigo: number): Promise<IRepJournalDetail[]>{
        try {

            const queryDias = `select 
			dd.dia_codpuv codigo_punto_venta,
            did_codppv codigo_producto,
            sum(did_cantidad) as cantidad
        from dia_diario dd 
        left outer join did_diario_detalle ddd on dd.dia_codigo = ddd.did_coddia
        where date_trunc('day', dia_fecha) >= current_date - interval '16 day' 
        and dd.dia_codpuv = ${codigo}
        group by dd.dia_codpuv,
                    did_codppv;`

            const resDias = await pool.query(queryDias);
            const ventas = resDias.rows;

            const queryProductos = `select
            pppv.ppv_codpuv as codigo_punto_venta,
                tip_codigo as codigo_tipo, 
                tip_nombre as nombre_tipo, 
                pppv.ppv_codigo  as codigo_producto, 
                pp.pro_nombre as nombre_producto,  
                pppv.ppv_precio as precio  

            from tip_tipo_producto ttp
             inner join pro_producto pp on ttp.tip_codigo = pp.pro_codtip
                    inner join ppv_producto_punto_venta pppv on pp.pro_codigo = pppv.ppv_codpro 
                    where pppv.ppv_codpuv = ${codigo}
            `
            const resProductos = await pool.query(queryProductos)
            const arrayProductos = resProductos.rows;
            // console.log(resDias.rows)
            // console.log(resProductos.rows)

            // const resultado = a.map(objA => {
            //     const objetoB = b.find(objB => objB.id === objA.id);
            //     if (objetoB) {
            //       // Combina los objetos utilizando Object.assign
            //       return Object.assign({}, objA, objetoB);
            //       // O utilizando el operador de propagación
            //       // return { ...objA, ...objetoB };
            //     }
            //     return objA; // Si no se encuentra en b, devuelve el objeto de a
            //   });

            const productos = arrayProductos.map(producto => {
                const ventasPorProducto = ventas.find(ventaProducto => ventaProducto.codigo_producto === producto.codigo_producto);
                if(ventasPorProducto){
                    return Object.assign({}, producto, ventasPorProducto)
                }
                return producto;
            })

            let resultadoProductos = [];// = new Array<IProduct> ;

            productos.forEach(vProducto => {
                let cantidadProducto = vProducto.cantidad === undefined ? 0 : vProducto.cantidad
                resultadoProductos.push(
                    {
                        codigo_punto_venta: vProducto.codigo_punto_venta,
                        codigo_tipo_producto: vProducto.codigo_tipo,
                        nombre_tipo_producto: vProducto.nombre_tipo,
                        codigo_producto: vProducto.codigo_producto,
                        nombre_producto: vProducto.nombre_producto,
                        precio: vProducto.precio,
                        cantidad: cantidadProducto,
                        total: vProducto.precio * cantidadProducto
                    }
                )
            })


            const totalDia = resultadoProductos.reduce((acumulador, producto) => {
                // Convierte el salario a número (si es una cadena)
                const suma = parseFloat(producto.total);
                
                // Suma el salario al acumulador
                return acumulador + suma;
              }, 0); // El segundo argumento de reduce es el valor inicial del acumulador
              

            const qFondos = `select 
                                fon_codigo as codigo, 
                                fon_nombre as nombre, 
                                fon_porcentaje as porcentaje,  
                                fon_es_fondo as es_fondo
                            from fon_fondos ff `

            const resFondo = await pool.query(qFondos);
            const fondos = resFondo.rows;

            fondos.forEach(vFondos => {
                let totalFondo = (vFondos.porcentaje * totalDia)/100;
                resultadoProductos.push(
                    {
                        codigo_punto_venta: codigo,
                        codigo_tipo_producto: vFondos.es_fondo,
                        nombre_tipo_producto: vFondos.es_fondo === true ? "Fondo" : "Gasto",
                        codigo_producto: vFondos.codigo,
                        nombre_producto: vFondos.nombre,
                        precio: 0,
                        cantidad: 1,
                        total: totalFondo
                    }
                )
            })

            return resultadoProductos

        } catch (error) {
            console.error(`Error al obtener detalles ${error}`)
            return []
        }
    }

}