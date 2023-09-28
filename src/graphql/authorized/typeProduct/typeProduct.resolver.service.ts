import  TypeProductMutationService  from "./typeProduct.mutation.service";
import TypeProductQueryService from "./typeProduct.query.service";
import { middlewareCheck, MiddlewareType } from "../../../middlewares/middleware.check";
import {valTypeProduct} from "../../../middlewares/middleware.validation";

import ProductQueryService from "../product/product.query.service";

const typeProductMutationService = new TypeProductMutationService();
const typeProductQueryService = new TypeProductQueryService();
const productQueryService = new ProductQueryService();

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
    TypeProduct:{
        productos: async (params) => {
            const producto = await productQueryService.getProductoByTypeProductId(params.codigo)
            let arrayProductos = [];// = new Array<IProduct> ;

            producto.forEach(vProducto => {
                arrayProductos.push(
                    {
                        codigo: vProducto.codigo,
                        nombre: vProducto.nombre,
                        descripcion: vProducto.descripcion,
                        activo: vProducto.activo,
                        tipo_producto: vProducto.tipo_producto
                    }
                )
            })

            return arrayProductos
            
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