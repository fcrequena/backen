import * as  express from 'express';
import AUTHQueryService  from "../../helpers/db.helpers";
import { IUser } from "../../interfaces/db.interface";

export const AuthMiddleware = async (request, response, next: express.NextFunction) => {
    const usuarios = new AUTHQueryService();
    const users = await usuarios.loginUsers()
    
    request.isAuthenticated = false;

    //validamos si el usuario se encuentra registrado. 
    const authorizationHeader = request.headers.authorization;
    
    if (!authorizationHeader) {
        return next();
    }

    const existToken = users.find((usr) => usr.token === authorizationHeader)
    
    if (!existToken) {
        return next();
    }
    //validamos si sigue vigente
    let fecha = new Date()
    let vencimiento = new Date(existToken.vencimiento)
    
    
    if(vencimiento < fecha){
        return next()
    }

    //obtenemos roles
    const roles = await usuarios.rolUsers(existToken.codigo);
    const arrRoles = roles.map( rol => rol.nombre)
    existToken.roles = arrRoles
    
    const user = <IUser>(existToken)
    Object.assign(request, { user, isAuthenticated: true });

    next();

};
export default AuthMiddleware;