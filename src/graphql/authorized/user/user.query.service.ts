import { IUser, IRol } from "../../../interfaces/db.interface";
import { MESSAGE_INVALID_PARAMETER } from "../../../helpers/messages";
import  pool  from "../../../helpers/pg.conn";

export default class UserQueryService {
    async getAllUser(): Promise<IUser[]>{
        try {
            const query = `
            SELECT 
                usr_codigo as codigo,
                usr_nombre as nombre,
                usr_correo as correo,
                usr_activo as activo,
                usr_password as password
            FROM usr_usuario`;

          const result = await pool.query(query);
          return result.rows;
        } catch (error) {
            console.error('Error en obtener usuarios', error);
            return []
        }
    }

    async getAllRol(): Promise<IRol[]>{
        try {
            const query = `SELECT
                rol_codigo as codigo, 
                rol_nombre as nombre, 
                rol_descripcion as descripcion,
                rol_activo as activo
            FROM rol_roles`

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener roles', error)
            return []
        }
    }
}

