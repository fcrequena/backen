import { coerceInputValue } from "graphql";
import  pool  from "../../../helpers/pg.conn";
import { IMessage, IUser } from "../../../interfaces/db.interface";

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
            const { nombre, correo, password} = params;

            let contrasena = await createHashPassword(password);

            const query = `INSERT INTO public.usr_usuario
            ( usr_nombre, usr_correo, usr_activo, usr_password)
            VALUES( '${nombre}', '${correo}', true , '${contrasena}')
            RETURNING usr_codigo as codigo, 
                        usr_nombre as nombre, 
                        usr_correo as correo,
                        usr_activo as activo,
                        usr_password as contrasena;`;

            const result = await pool.query(query);

            let mensaje =  'Usuario creado correctamente.';
            if(result.rowCount == 0){
                mensaje = 'No se puede crear el usuario.';
            }

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
            }];;   

        } catch (error) {
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

}