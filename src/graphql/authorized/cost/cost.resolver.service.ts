import { ICost } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";
import { middlewareCheck, MiddlewareType } from "../../../middlewares/middleware.check";

import CostMutationService from "./cost.mutation.service";
import CostQueryService from "./cost.query.service";

const costMutationService = new CostMutationService;
const costQueryService = new CostQueryService;

const costResolver = {
    Query: {
        getAllCost(parent, params, ctx): Promise<ICost[]>{
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['cost_view']}
                ],
                ctx
            )
            
            return costQueryService.getAllCost(params);
        },
        getCostById(parent, params, ctx): Promise<ICost[]>{
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['cost_search']}
                ],
                ctx
            )
            
            return costQueryService.getCostByID(params);
        }
    },
    Mutation: {
        async deleteCost(parent, params, ctx): Promise<ICost[]>{
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_delete']}
            ], ctx)
            
            const resultado = await costMutationService.deleteCost(params);
            return resultado;
        },
        async createCost(parent, params, ctx): Promise<ICost[]>{
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_delete']}
            ], ctx)
            
            const resultado = await costMutationService.createCost(params);
            return resultado;
        },
        async updateCost(parent, params, ctx): Promise<ICost[]>{
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_delete']}
            ], ctx)
            
            const resultado = await costMutationService.updateCost(params);
            return resultado;
        },
    }
}

export default costResolver;