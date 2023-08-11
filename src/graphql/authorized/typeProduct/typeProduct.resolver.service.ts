import  TypeProductMutationService  from "./typeProduct.mutation.service";
import TypeProductQueryService from "./typeProduct.query.service";
import { middlewareCheck, MiddlewareType } from "../../../middlewares/middleware.check";
import {valTypeProduct} from "../../../middlewares/middleware.validation";

const typeProductMutationService = new TypeProductMutationService();
const typeProductQueryService = new TypeProductQueryService();

const typeProductResolver = {
    Query: {
        getAllTypeProduct(parent, _, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['type_product_view']}
            ],ctx)

            return typeProductQueryService.getAllTypeProduct();
        },
        getTypeProductById(parent, {codigo}, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['type_product_search']}
            ],ctx)

            return typeProductQueryService.getTypeProductById(codigo);
        }
    },
    Mutation: {
        async createTypeProduct(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['type_product_create']}
            ],ctx)

            await valTypeProduct(params, 'create');

            const resultado = await typeProductMutationService.createTypeProduct(params)
            return resultado;
        },
        async updateTypeProduct(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['type_product_create']}
            ],ctx)
        
            await valTypeProduct(params, 'insert');

            const result = await typeProductMutationService.updateTypeProduct(params);
            return result
        },
        async deleteTypeProductById(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['type_product_delete']
                }
            ], ctx)

            await valTypeProduct(params, 'delete');
            
            const result = await typeProductMutationService.deleteTypeProductById(params);
            return result;
        }
        
    }
}

export default typeProductResolver;