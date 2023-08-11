import UserQueryService  from "./user.query.service";
import UserMutationService from "./user.mutation.service";
import { middlewareCheck, MiddlewareType } from "../../../middlewares/middleware.check";

const userQueryService = new UserQueryService();
const userMutationService = new UserMutationService();

const userResolver = {
    Query: {
        getAllUsers(parent, _, ctx){
            middlewareCheck(
                [
                    { type: MiddlewareType.AUTH},
                    { type: MiddlewareType.ACL, 
                        roles: ['user_view']}
                ], 
                ctx)
                return userQueryService.getAllUser();
        },
        getAllRols(parent, _, ctx){
            middlewareCheck(
                [
                    { type: MiddlewareType.AUTH},
                    { type: MiddlewareType.ACL, 
                        roles: ['user_rol']}
                ], 
                ctx)
                return userQueryService.getAllRol();
        }
    },
    Mutation: {
        deleteSession(parent, {id}, ctx){
            if(id == ctx.codigo){
                throw new Error("No puede eliminar la session de otro usuario");
            }

            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['user_session_del']}], ctx)
            return userMutationService.deleteSession(id);
        }
    }
}

export default userResolver;