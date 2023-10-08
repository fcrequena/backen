import UserQueryService  from "./user.query.service";
import UserMutationService from "./user.mutation.service";
import { middlewareCheck, MiddlewareType } from "../../../middlewares/middleware.check";
import PointSaleMutationService from "../point_sale/point_sale.mutation.service";
import { valUsers } from "../../../middlewares/middleware.validation";

const userQueryService = new UserQueryService();
const userMutationService = new UserMutationService();
const pointSaleMutationService = new PointSaleMutationService();

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
    User:{
        punto_venta: async (params) => {
            try {
                const point_sale = await pointSaleMutationService.getPointSaleById(params.codigo);
                console.log("puntos",point_sale)
                return point_sale;
            } catch (error) {
                console.log({error})
            }
        }
    },
    Mutation: {
        deleteSession(parent, {id}, ctx){
            if(id == ctx.codigo){
                throw new Error("No puede eliminar la session de otro usuario");
            }

            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['user_session_del']}], ctx)
            return userMutationService.deleteSession(id);
        },
        async createUser(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['user_create']}
            ], ctx);

            await valUsers(params, 'create');

            const result = await userMutationService.createUser(params);

            return result[0];
        },
        async updatePasswordUser(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['user_update_password']}
            ], ctx);
            
            await valUsers(params, 'check');

            const result = await userMutationService.updatePasswordUser(params);

            return result[0];

        },
        async updateUser(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['user_update']}
            ], ctx);

            await valUsers(params, 'update');

            const result = await userMutationService.updateUser(params);

            return result[0];
        },
        async deleteUser(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['user_update']}
            ], ctx);

            const result = await userMutationService.deleteUser(params);

            return result[0]
        },
        async createPointSaleUser(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['user_point_sale']}
            ], ctx);
            
            const result = await userMutationService.createPointSaleUser(params);
 
            return result;

        }
    }
}

export default userResolver;