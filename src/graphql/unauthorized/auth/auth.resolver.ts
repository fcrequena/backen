import AuthQueryService from "./auth.query.service";
import AuthMutationService from "./auth.mutation.service";
const authQueryService = new AuthQueryService();
const authMutationService = new AuthMutationService();

const authResolver = {
    Query: {
        login(parent, {email, password}, ctx) {
            return authQueryService.login(email, password);
        },
    },
    Mutation: {
        async login(parent, {email, password}, ctx){
            const result = await authMutationService.login(email, password);
            return result[0];
        }
    }
};

export default authResolver;