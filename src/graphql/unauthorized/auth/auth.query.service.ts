import  pool  from "../../../helpers/pg.conn";
import { validarHashPassword } from "../../../helpers/security";
var format = require('date-format');
import { jwt } from "jsonwebtoken";

export default class AuthQueryService {
    async login(email: string, password: string): Promise<string> {
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
            const passValido = await validarHashPassword(usuario.nombre, password, usuario.password)
            
            if(passValido.response === false){
                return passValido.message
            }
            
            const queryToken = `select 
                    acc_codigo codigo,
                    case when acc_vencimiento >= current_timestamp THEN 1 else 0 END vigente,
                    acc_token as token 	  
                from acc_acceso
            where acc_codusr = ${usuario.codigo}`

            const resultQueryToken = await pool.query(queryToken);
            const exiteToken = resultQueryToken.rows[0];
            let token = ''

            if(exiteToken){
                
                if(exiteToken.vigente == 0){
                    const insQuery = `UPDATE public.acc_acceso
                    SET acc_token = '${passValido.message}', 
                        acc_vencimiento = CURRENT_TIMESTAMP + '1 hours', 
                        acc_fecha_inicio = CURRENT_TIMESTAMP
                    WHERE acc_codusr = ${usuario.codigo}
                    `
                    const insResult = await pool.query(insQuery);
    
                    if(insResult.rowCount >=1 ){
                        token = passValido.message;
                     }
                }

                if(exiteToken.vigente == 1){
                    token = exiteToken.token;
                }
            }else{
                const insQuery = `INSERT INTO public.acc_acceso
                (acc_codusr, acc_token, acc_vencimiento, acc_fecha_inicio)
                VALUES(${usuario.codigo}, '${passValido.message}', CURRENT_TIMESTAMP + '1 hours', CURRENT_TIMESTAMP);
                `
                const insResult = await pool.query(insQuery);

                if(insResult.rowCount >=1 ){
                    token = passValido.message;
                 }
            }
            
            return token

        } catch (error) {
            console.log({autQuery: error})
            throw new Error(error);
        }
        //const user = users.find((item) => item.correo === email && item.password === password);

        // if (!user) {
        //     throw new Error(MESSAGE_INVALID_CREDENTIALS);
        // }
        //return user.token;
    }
}

const fechaActual = (fecha, horas = 0) => {
    fecha.setHours(fecha.getHours() + horas);

    fecha = fecha.toISOString();
    let fecha_date = fecha.split('T');
    let fecha_time = fecha_date[1]
    fecha_time = fecha_time.replace('Z','')
    fecha_date = fecha_date[0];

	fecha = fecha_date+' '+fecha_time;
  
    return fecha
}