import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";
import CostPointSaleMutationService from "./costPointSale.mutation.service";
import CostPointSaleQueryService from "./costPointSale.query.service";
import { valCostPointSale } from "../../../middlewares/middleware.validation";

import ProductQueryService from "../product/product.query.service";

const costPointSaleQueryService = new  CostPointSaleQueryService();
const costPointSaleMutationService  = new  CostPointSaleMutationService();

const productQueryService = new ProductQueryService();

const costPointSaleResolver = {
    Query: {
        getAllcostPointSale(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['point_cost_view']}
                ],
                ctx
            )
            return costPointSaleQueryService.getAllCostPointSale();
        },
        getCostPointSaleById(parent, {codigo}, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['point_cost_search']}
                ],
                ctx
            )
            return costPointSaleQueryService.getCostPointSaleById(codigo);
        },
        // getFindByPointSaleId(parent, {codigo}, ctx){
        //     middlewareCheck(
        //         [
        //             {type: MiddlewareType.AUTH},
        //             {type: MiddlewareType.ACL, 
        //                 roles: ['point_cost_search']}
        //         ],
        //         ctx
        //     )
        //     return costPointSaleQueryService.getFindByPointSaleId(codigo);
        // }
    },
    // costPointSale:{
    //     producto: (parent) => {
    //         const products = productQueryService.getProductoById(parent.producto)
    //         return products
    //     }
    // },
    Mutation: {
        async deletecostPointSaleById(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_cost_delete']}
            ], ctx)
            
            await valCostPointSale(params, 'delete');

            const result = await costPointSaleMutationService.deleteCostPointSaleById(params);
            return result;
        },
        async createcostPointSale(parent, params, ctx){
            console.log({resolver: params})
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_cost_create']}
            ], ctx)
            
            await valCostPointSale(params, 'create');

            const result = await costPointSaleMutationService.createCostPointSale(params);
            return result;
        },
        async updatecostPointSale(parent, params, ctx){
            
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_cost_update']}
            ], ctx)
            
            await valCostPointSale(params, 'update');

            const result = await costPointSaleMutationService.updateCostPointSale(params);
            
            return result;
        },
    }
}

export default costPointSaleResolver;