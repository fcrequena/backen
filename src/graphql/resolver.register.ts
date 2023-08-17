import authResolver from "./unauthorized/auth/auth.resolver";

import userResolver  from "./authorized/user/user.resolver";
import typeProductResolver from "./authorized/typeProduct/typeProduct.resolver.service";
import productoResolver from "./authorized/product/product.resolver.service";

import pointSaleResolver from "./authorized/point_sale/point_sale.resolver.service";
import productoPointSaleResolver from "./authorized/productPointSale/productPointSale.resolver.service";

import typeCostResolver from "./authorized/typeCost/typeCost.resolver.service";
import costResolver from "./authorized/cost/cost.resolver.service";
import costPointSaleResolver from "./authorized/costPointSale/costPointSale.resolver.service";

export const RESOLVERS = {
    authorized: [
        userResolver,
        typeProductResolver,
        productoResolver,
        pointSaleResolver,
        productoPointSaleResolver,
        typeCostResolver,
        costResolver,
        costPointSaleResolver
    ],
    unauthorized: [
        authResolver
    ]
};