import UserQueryService  from "./user.query.service";
import UserMutationService from "./user.mutation.service";
import { middlewareCheck, MiddlewareType } from "../../../middlewares/middleware.check";
import PointSaleMutationService from "../point_sale/point_sale.mutation.service";
import { valUsers } from "../../../middlewares/middleware.validation";

import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql";

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
        },
        getAllTypeRol(parent, _, ctx){
            middlewareCheck(
                [
                    { type: MiddlewareType.AUTH},
                    { type: MiddlewareType.ACL, 
                        roles: ['user_type_rol']}
                ], 
                ctx)
                return userQueryService.getAllTypeRol();
        }
    },
    User:{
        punto_venta: async (params) => {
            try {
                const point_sale = await pointSaleMutationService.getPointSaleById(params.codigo);
                
                return point_sale;
            } catch (error) {
                throw new Error(`Error al obtener puntos de venta ${error}`)
            }
        },
        roles: async (params) => {
            try {
                const type_roles = await userQueryService.getFindTypeRolUser(params.codigo);
                
                return type_roles;
            } catch (error) {
                throw new Error(`Error al obtener roles asociados al punto de venta ${error}`)
            }
        },
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    }),
    Mutation: {
        deleteSession(parent, {id}, ctx){
            if(id == ctx.codigo){
                throw new Error("No puede eliminar la session de otro usuario");
            }

            middlewareCheck([{type: MiddlewareType.AUTH}, 
                    {type: MiddlewareType.ACL, 
                    roles: ['user_session_del']}]
                    , ctx)
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
                    roles: ['user_delete']}
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

        },
        async createRolUser(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['user_rol']}
            ], ctx);
            
            const result = await userMutationService.createRolUser(params);
 
            return result;

        }
    }

}

export default userResolver;