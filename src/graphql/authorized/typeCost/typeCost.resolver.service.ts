import TypeCostMutationService from "./typeCost.mutation.service";
import TypeCostQueryService from "./typeCost.query.service";

import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";

const typeCostQueryService = new TypeCostQueryService();
const typeCostMutationService = new TypeCostMutationService();

const typeCostResolver = {
    query: {
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
        getTypeCostById(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['type_cost_search']}
                ],
                ctx
            )

            return typeCostQueryService.getTypeCostById(params);
        }
    },
    mutation: {
        deleteCostType(parent, params, ctx){
            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['type_cost_delete']}], ctx)

            return typeCostMutationService.deleteTypeCostById(params);
        },
        createCostType(parent, params, ctx){
            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['type_cost_create']}], ctx)

            return typeCostMutationService.createTypeCost(params);
        },
        updateCostType(parent, params, ctx){
            middlewareCheck([{type: MiddlewareType.AUTH}, {type: MiddlewareType.ACL, roles: ['type_cost_update']}], ctx)

            return typeCostMutationService.updateTypeCost(params);
        },
    }
}

export default typeCostResolver;