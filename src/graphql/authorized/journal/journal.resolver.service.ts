import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";
import JournalMutationService from "./journal.mutation.service";
import JournalQueryService from "./journal.query.service";

import TypeQueryService from "../typeProduct/typeProduct.query.service";

const journalMutationService = new JournalMutationService();
const journalQueryService = new JournalQueryService();
const typeQueryService = new TypeQueryService();

const journalResolve = {
    Query: {
        
    },
    Mutation: {
        getReportJournal(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['product_view']}
                ],
                ctx
            )
        
            return journalMutationService.getReportJournal(params);
        },
        async createJournal(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_create']}
            ], ctx)

            const result = await journalMutationService.createJournal(params);
            return result;
        },
        async createJournalDetail(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_create']}
            ], ctx)

            const result = await journalMutationService.createJournalDetail(params);

            return result;
        },
        async getJournalDetailForDay(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_create']}
            ], ctx)

            const result = await journalMutationService.getJournalDetailForDay(params);
            return result;

        },
        async deleteJournalDetail(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_create']}
            ], ctx)

            const result = await journalMutationService.deleteJournalDetail(params);

            return result;
        },
        async editJournalDetail(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_create']}
            ], ctx)

            const result = await journalMutationService.editJournalDetail(params);

            return result;
        }
    },
    RepJournal:{
        tipo_producto: async (parent, paramas, ctx, a)=> {
            const tipo_producto = await typeQueryService.getAllTypeProduct();
            return tipo_producto;
        },
        fondo: async (parent, paramas, ctx, a) =>{
            const fondo = await journalQueryService.getFondosGastos();
        
            return fondo;
        }
    },
    RepTypeProduct:{
        productos:async (parent, params, ctx, a) => {
            const parametros = a.variableValues;
            
            const detalle = await journalQueryService.getReportJournalDetail(parent, parametros);
        
            return detalle;
        }
    }
    
}

export default journalResolve;