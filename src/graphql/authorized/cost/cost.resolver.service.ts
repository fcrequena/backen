import { ICost } from "../../../interfaces/db.interface";
import pool from "../../../helpers/pg.conn";
import { middlewareCheck, MiddlewareType } from "../../../middlewares/middleware.check";

import CostMutationService from "./cost.mutation.service";
import CostQueryService from "./cost.query.service";

const costMutationService = new CostMutationService;
const costQueryService = new CostQueryService;

const costResolver = {
    query: {
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
    mutation: {

    }
}

export default costResolver;