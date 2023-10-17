import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";
import ProductPointSaleMutationService from "./producPointSale.mutation.service";
import ProductPointSaleQueryService from "./productPointSale.query.service";
import { valProductPointSale } from "../../../middlewares/middleware.validation";

import ProductQueryService from "../product/product.query.service";

const productPointSaleQueryService = new  ProductPointSaleQueryService();
const productPointSaleMutationService  = new  ProductPointSaleMutationService();

const productQueryService = new ProductQueryService();

const productoPointSaleResolver = {
    Query: {
        getAllProductPointSale(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['prod_sale_view']}
                ],
                ctx
            )
            return productPointSaleQueryService.getAllProductPointSale();
        },
        getProductPointSaleById(parent, {codigo}, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['prod_sale_search']}
                ],
                ctx
            )
            return productPointSaleQueryService.getProductPointSaleById(codigo);
        },
        getFindByPointSaleId(parent, {codigo}, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['prod_sale_search']}
                ],
                ctx
            )
            return productPointSaleQueryService.getFindByPointSaleId(codigo);
        }
    },
    Mutation: {
        async deleteProductPointSaleById(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['prod_sale_delete']}
            ], ctx)
            
            await valProductPointSale(params, 'delete');

            const result = await productPointSaleMutationService.deleteProductPointSaleById(params);
            return result;
        },
        async createProductPointSale(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['prod_sale_create']}
            ], ctx)
            
            await valProductPointSale(params, 'create');

            const result = await productPointSaleMutationService.createProductPointSale(params);
            return result;
        },
        async updateProductPointSale(parent, params, ctx){
            
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['prod_sale_update']}
            ], ctx)
            
            await valProductPointSale(params, 'update');

            const result = await productPointSaleMutationService.updateProductPointSale(params);
            
            return result;
        },
    }
}

export default productoPointSaleResolver;