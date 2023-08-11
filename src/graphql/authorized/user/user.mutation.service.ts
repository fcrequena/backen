import  pool  from "../../../helpers/pg.conn";
import { IMessage } from "../../../interfaces/db.interface";

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
}