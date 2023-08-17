import TypeCostMutationService from "./typeCost.mutation.service";
import TypeCostQueryService from "./typeCost.query.service";

import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";

const typeCostQueryService = new TypeCostQueryService();
const typeCostMutationService = new TypeCostMutationService();

const typeCostResolver = {
    Query: {
        getAllTypeCost(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['type_cost_view']}
                ],
                ctx
            )

            return typeCostQueryService.getAllTypeCost();
        },
        getTypeCostById(parent, {codigo}, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['type_cost_search']}
                ],
                ctx
            )

            return typeCostQueryService.getTypeCostById(codigo);
        }
    },
    Mutation: {
        deleteTypeCost(parent, params, ctx){
            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['type_cost_delete']}], ctx)

            return typeCostMutationService.deleteTypeCostById(params);
        },
        createTypeCost(parent, params, ctx){
            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['type_cost_create']}], ctx)

            return typeCostMutationService.createTypeCost(params);
        },
        updateTypeCost(parent, params, ctx){
            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['type_cost_update']}], ctx)

            return typeCostMutationService.updateTypeCost(params);
        },
    }
}

export default typeCostResolver;