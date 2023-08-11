import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";
import PointSaleMutationService from "./point_sale.mutation.service";
import PointSaleQueryService from "./point_sale.query.service";
import { valPointSale } from "../../../middlewares/middleware.validation";

const pointSaleQueryService = new  PointSaleQueryService();
const pointSaleMutationService  = new  PointSaleMutationService();
const pointSaleResolver = {
    Query: {
        getAllPointSale(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['point_sale_view']}
                ],
                ctx
            )
            return pointSaleQueryService.getAllPointSale();
        },
        getPointSaleById(parent, {codigo}, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['point_sale_search']}
                ],
                ctx
            )
            return pointSaleQueryService.getPointSaleById(codigo);
        },
    },
    Mutation: {
        async deletePointSaleById(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_sale_delete']}
            ], ctx)
            
            await valPointSale(params, 'delete');

            const result = await pointSaleMutationService.deletePointSaleById(params);
            return result;
        },
        async createPointSale(parent, params, ctx){
            console.log({resolver: params})
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_sale_create']}
            ], ctx)
            
            await valPointSale(params, 'create');

            const result = await pointSaleMutationService.createPointSale(params);
            return result;
        },
        async updatePointSale(parent, params, ctx){
            
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_sale_update']}
            ], ctx)
            
            await valPointSale(params, 'update');

            const result = await pointSaleMutationService.updatePointSale(params);
            
            return result;
        },
    }
}

export default pointSaleResolver;