import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";
import JournalMutationService from "./journal.mutation.service";
import JournalQueryService from "./journal.query.service";

const journalMutationService = new JournalMutationService();
const journalQueryService = new JournalQueryService();

const journalResolve = {
    Query: {
        getReportJournal(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['product_view']}
                ],
                ctx
            )
                
            return journalQueryService.getReportJournal(params.codigo_punto_venta);
        }
    },
    RepJournal:{
        productos:async (params) => {
            const detalle = await journalQueryService.getReportJournalDetail(params.codigo)
            return detalle
        }
    },
    Mutation: {
        async createJournal(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['product_create']}
            ], ctx)

            const result = await journalMutationService.createJournal(params);
            console.log({result})
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
    }
}

export default journalResolve;