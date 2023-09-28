import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";
import ProductMutationService from "./product.mutation.service";
import ProductQueryService from "./product.query.service";
import { valProduct } from "../../../middlewares/middleware.validation";
const productQueryService = new ProductQueryService();
const productMutationSerivce  = new ProductMutationService();
const productResolve = {
    Query: {
        getAllProduct(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['product_view']}
                ],
                ctx
            )

            return productQueryService.getAllProduct();
        },
        getProductById(parent, {codigo}, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['product_search']}
                ],
                ctx
            )
            return productQueryService.getProductoById(codigo);
        },
    },
    Mutation: {
        async deleteProductById(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_delete']}
            ], ctx)
            
            await valProduct(params, 'delete');

            const result = await productMutationSerivce.deleteProductById(params);
            return result;
        },
        async createProduct(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_create']}
            ], ctx)
            
            await valProduct(params, 'create');

            const result = await productMutationSerivce.createProduct(params);
            return result;
        },
        async updateProduct(parent, params, ctx){
            
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_update']}
            ], ctx)
            
            await valProduct(params, 'update');

            const result = await productMutationSerivce.updateProduct(params);
            
            return result;
        },
    }
}

export default productResolve;