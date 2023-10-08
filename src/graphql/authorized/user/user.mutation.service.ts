
import  pool  from "../../../helpers/pg.conn";
import { IMessage, IUser, IPointSale } from "../../../interfaces/db.interface";

import { createHashPassword } from "../../../helpers/security";

export default class UserMutationService {
    async deleteSession(id: number): Promise<String>{
        try {
            const query = `UPDATE acc_acceso
                SET acc_vencimiento = CURRENT_TIMESTAMP, 
                    acc_fecha_inicio = CURRENT_TIMESTAMP
                WHERE acc_codusr = ${id}
                RETURNING *;`;

            const result = await pool.query(query);

            let mensaje =  'Session cerrada exitosamente.';
            if(result.rowCount == 0){
                mensaje = 'No se puede cerrar la session.';
            }

            return mensaje;   

        } catch (error) {
            return error;
        }
    }

    async createUser(params): Promise<IUser[]>{
        try {
            const { nombre, correo, contrasena, rol} = params;
            console.log({rolDelUsuario: rol})
            let nuevaContrasena = await createHashPassword(contrasena);

            const query = `INSERT INTO public.usr_usuario
            ( usr_nombre, usr_correo, usr_activo, usr_password)
            VALUES( '${nombre}', '${correo}', true , '${nuevaContrasena}')
            RETURNING usr_codigo as codigo,
                        usr_nombre as nombre,
                        usr_correo as correo,
                        usr_activo as estado, 
                        usr_password as contrasena;`;

            const result = await pool.query(query);
            return [{
                codigo: result.rows[0].codigo,
                nombre: result.rows[0].nombre,
                correo: result.rows[0].correo,
                activo: result.rows[0].estado,
                password: "",
                roles: [],
                token: "",
                vencimiento: "",
                inicio: ""
            }];

        } catch (error) {
            console.error(`Error al crear usuario ${error}`)
            return error;
        }
    }

    async updateUser(params): Promise<IUser[]>{
        try {
            const {codigo, nombre, correo, contrasena, estado} = params;

            const query = `UPDATE public.usr_usuario
            SET usr_nombre='${nombre}', 
                usr_correo='${correo}', 
                usr_activo=${estado}
            WHERE usr_codigo=${codigo}
            RETURNING usr_codigo as codigo,
                        usr_nombre as nombre,
                        usr_correo as correo,
                        usr_activo as estado, 
                        usr_password as contrasena;`

            const result = await pool.query(query);
                
            return [{
                codigo: result.rows[0].codigo,
                nombre: result.rows[0].nombre,
                correo: result.rows[0].correo,
                activo: result.rows[0].estado,
                password: "",
                roles: [],
                token: "",
                vencimiento: "",
                inicio: ""
            }];
        } catch (error) {
            console.error(`Error al actualizar usuario ${error}`)
            return error;
        }
    }

    async updatePasswordUser(params): Promise<IUser[]>{
        try {
            const {codigo, contrasena} = params;

            let nuevaContrasena = await createHashPassword(contrasena);

            const query = `UPDATE public.usr_usuario
            SET usr_password='${nuevaContrasena}'
            WHERE usr_codigo=${codigo}
            RETURNING usr_codigo as codigo,
                        usr_nombre as nombre,
                        usr_correo as correo,
                        usr_activo as estado, 
                        usr_password as contrasena;`

            const result = await pool.query(query);

            return [{
                codigo: result.rows[0].codigo,
                nombre: result.rows[0].nombre,
                correo: result.rows[0].correo,
                activo: result.rows[0].estado,
                password: "",
                roles: [],
                token: "",
                vencimiento: "",
                inicio: ""
            }];
        } catch (error) {
            console.error(`Error al actualizar contraseña del usuario ${error}`)
            return error;
        }
    }

    async deleteUser(params): Promise<IUser[]>{
        try {
            const {codigo, nombre, correo, contrasena, rol} = params;
            
            const query = `UPDATE public.usr_usuario
                            SET usr_activo = false
                            WHERE usr_codigo = ${codigo}
                    RETURNING usr_codigo as codigo,
                                usr_nombre as nombre,
                                usr_correo as correo,
                                usr_activo as estado, 
                                usr_password as contrasena;`;

            const result = await pool.query(query);
            return [{
                codigo: result.rows[0].codigo,
                nombre: result.rows[0].nombre,
                correo: result.rows[0].correo,
                activo: result.rows[0].estado,
                password: "",
                roles: [],
                token: "",
                vencimiento: "",
                inicio: ""
            }];

        } catch (error) {
            console.error(`Error al crear usuario ${error}`)
            return error;
        }
    }

    async createPointSaleUser(params): Promise<IPointSale[]>{
        try {
            const { codigo, puntos_venta} = params;

            // /**Eliminamos los puntos de venta */
            const queryDelete = ` DELETE FROM public.upv_usuario_punto_venta WHERE upv_codusr = ${codigo}`;
            const resultDelete = await pool.query(queryDelete);

             const val = puntos_venta.map( async(punto_venta)  => {
                const querySelect = `SELECT puv_codigo as codigo, 
                                            puv_nombre as nombre,
                                            puv_descripcion as descripcion,
                                            puv_activo as activo,
                                            puv_cantidad as cantidad
                FROM public.puv_punto_venta WHERE puv_nombre = '${punto_venta}'; `

                const resultSelect = await pool.query(querySelect);

                if(resultSelect.rowCount !== 0){
                    const rPuntoVenta = resultSelect.rows[0];
    
                    const query = `INSERT INTO public.upv_usuario_punto_venta
                    ( upv_codusr, upv_codpuv)
                    VALUES( ${codigo}, ${rPuntoVenta.codigo});`

                    const rQuery = await pool.query(query);

                    return rPuntoVenta;

                }
            })

            let valor = <IPointSale[]> await Promise.all(val)
            .then((resultados) => {
                
                return resultados; // Esto imprimirá un array con los resultados de todas las promesas
            })
            .catch((error) => {
                throw new Error (error);
            });
 
            return valor;
        } catch (error) {
            throw new Error ("Error al asociar punto de venta con el usuario" + error)
        }
    }

}