import { IUser, IRol, ITypeRol } from "../../../interfaces/db.interface";
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
            throw new Error(`Error en obtener usuarios ${error}`);
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
            throw new Error(`Error al obtener roles ${error}`)
        }
    }

    async getAllTypeRol(): Promise<ITypeRol[]>{
        try {
            const query = `select 
                    tir_codigo as codigo,  
                    tir_nombre as nombre, 
                    tir_activo as activo
                from tir_tipo_rol ttr;`

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error en obtener roles ${error}`)
        }
    }

    async getFindTypeRolUser(codigo: number): Promise<ITypeRol[]>{
        try {
            const query = `select 
                    tir_codigo as codigo,  
                    tir_nombre as nombre, 
                    tir_activo as activo
                    from tir_tipo_rol ttr
                    inner join rus_rol_usuario rru ON ttr.tir_codigo = rru.rus_codtir 
                    where rru.rus_codusr = ${codigo}; 
                    `

            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error en obtener roles del usuario ${error}`)
        }
    }

}

