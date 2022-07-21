import {tokenRepositories} from "../repositories/token-db-repositories";

export const tokenService={
    ///save to repo
    async saveTokenInBlacklist(token: string ) {
        const badToken= {
            token:token.split('=')[1],
        }
       const result = await tokenRepositories.addTokenInBlacklist(badToken)

        return result

    },

    ///check from repo

    async checkToken(refreshToken: string) {
        const result = await tokenRepositories.checkTokenInBlacklist(refreshToken)

        return result

    }
}