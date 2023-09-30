import authResolver from "./unauthorized/auth/auth.resolver";

import userResolver  from "./authorized/user/user.resolver";
import typeProductResolver from "./authorized/typeProduct/typeProduct.resolver.service";
import productoResolver from "./authorized/product/product.resolver.service";

import pointSaleResolver from "./authorized/point_sale/point_sale.resolver.service";
import productoPointSaleResolver from "./authorized/productPointSale/productPointSale.resolver.service";

import journalResolve from "./authorized/journal/journal.resolver.service";

export const RESOLVERS = {
    authorized: [
        userResolver,
        typeProductResolver,
        productoResolver,
        pointSaleResolver,
        productoPointSaleResolver,
        journalResolve
    ],
    unauthorized: [
        authResolver
    ]
};