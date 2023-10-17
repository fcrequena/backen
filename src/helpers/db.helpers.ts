// validamos la informacion de los usuairos
import  pool  from "../helpers/pg.conn";
import { IUser, IRol } from "../interfaces/db.interface";

export default class AUTHQueryService {

    async loginUsers(): Promise<IUser[]>{
        try {
            const query = `select 
                uu.usr_codigo as codigo, 
                uu.usr_nombre as nombre,
                uu.usr_correo as correo,
                uu.usr_activo as activo,
                '' as password,
                '' as roles,
                aa.acc_token as token,
                aa.acc_vencimiento as vencimiento, 
                aa.acc_fecha_inicio as inicio
            from usr_usuario uu 
                inner join acc_acceso aa on uu.usr_codigo = aa.acc_codusr 
                where aa.acc_vencimiento >= current_timestamp 
                `
            
            const result = await pool.query(query);
            
            return result.rows;
        } catch (error) {
            throw new Error(`helper: ${error}`); 
        }
    }

    async rolUsers(usrCodigo): Promise<IRol[]>{
        try {
            const query = `select 
            rol_nombre as nombre
        from rus_rol_usuario rru  
            inner join tir_tipo_rol tir on rru.rus_codtir= tir.tir_codigo
            inner join rol_roles rr on tir.tir_codigo  = rr.rol_codtir
            where rus_codusr = ${usrCodigo}`

            const result = await pool.query(query);

            return result.rows;

        } catch (error) {
            throw new Error(`rolUsers: ${error}`);
        }
    }
}
