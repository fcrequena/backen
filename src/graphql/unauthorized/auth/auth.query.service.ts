import  pool  from "../../../helpers/pg.conn";
import { validarHashPassword } from "../../../helpers/security";
var format = require('date-format');
import { IUser } from "../../../interfaces/db.interface";

export default class AuthQueryService {
    async login(email: string, password: string): Promise<IUser[]>{
        try {
            const query = `SELECT 
                    usr_codigo as codigo,
                    usr_nombre as nombre,
                    usr_correo as correo,
                    usr_activo as activo,
                    usr_password as password
                FROM usr_usuario
                WHERE usr_correo = '${email}'`

            const result = await pool.query(query);
            const usuario = result.rows[0]

            if(usuario == undefined){
                throw new Error("El usuario no existe en el sistema.");
                
            }
            const passValido = await validarHashPassword(usuario.nombre, password, usuario.password, usuario.codigo)
            
            if(passValido.response === false){
                return passValido.message
            }
            
            const queryToken = `select 
                    acc_codigo codigo,
                    case when acc_vencimiento >= current_timestamp THEN 1 else 0 END vigente,
                    acc_token as token,
                    acc_vencimiento as vencimiento,
                    acc_fecha_inicio as inicio
                from acc_acceso
            where acc_codusr = ${usuario.codigo}`

            let token = '', inicio = '', vencimiento = ''
           
            const resultQueryToken = await pool.query(queryToken);
            const exiteToken = resultQueryToken.rows[0];

            if(exiteToken){
                
                if(exiteToken.vigente == 0){
                    const insQuery = `UPDATE public.acc_acceso
                    SET acc_token = '${passValido.message}', 
                        acc_vencimiento = CURRENT_TIMESTAMP + '1 hours', 
                        acc_fecha_inicio = CURRENT_TIMESTAMP
                    WHERE acc_codusr = ${usuario.codigo}
                    RETURNING acc_vencimiento as vencimiento,
                                acc_fecha_inicio as inicio;
                    `
                    const insResult = await pool.query(insQuery);

                    if(insResult.rowCount >=1 ){
                        token = passValido.message;
                        inicio = insResult.rows[0].inicio;
                        vencimiento = insResult.rows[0].vencimiento;
                     }
                }

                if(exiteToken.vigente == 1){
                    token = exiteToken.token;
                    inicio = exiteToken.inicio;
                    vencimiento = exiteToken.vencimiento;
                }
            }else{
                const insQuery = `INSERT INTO public.acc_acceso
                (acc_codusr, acc_token, acc_vencimiento, acc_fecha_inicio)
                VALUES(${usuario.codigo}, '${passValido.message}', CURRENT_TIMESTAMP + '1 hours', CURRENT_TIMESTAMP)
                RETURNING acc_vencimiento as vencimiento,
                                acc_fecha_inicio as inicio;;
                `
                const insResult = await pool.query(insQuery);

                if(insResult.rowCount >=1 ){
                    token = passValido.message;
                    inicio = insResult.rows[0].inicio;
                    vencimiento = insResult.rows[0].vencimiento;
                 }
            }
            
            //return token
            return [{
                codigo: usuario.codigo,
                nombre: usuario.nombre,
                correo: usuario.correo,
                activo: usuario.activo,
                password: "",
                roles: [],
                token: token,
                vencimiento: vencimiento,
                inicio: inicio
            }];

        } catch (error) {
            throw new Error(`Error al obtener puntos de venta ${error}`)
        }
        //const user = users.find((item) => item.correo === email && item.password === password);

        // if (!user) {
        //     throw new Error(MESSAGE_INVALID_CREDENTIALS);
        // }
        //return user.token;
    }
}