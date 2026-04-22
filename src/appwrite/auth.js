import rootConfig from "../lib/rootConfig";
import { Client, Account, ID, Teams } from "appwrite";

// create a class
export class AuthService {
    client = new Client();
    account;
    teams;
    // create a constructor
    constructor() {
        this.client
            .setEndpoint(rootConfig.appWriteUrl)
            .setProject(rootConfig.appWriteProjectId);
        this.account = new Account(this.client);
        this.teams = new Teams(this.client);
    }

    // create account method
    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(
              ID.unique(),
              email,
              password,
              name,
            );
            if (userAccount) {
                // call another method
                console.log("Account Created Successfully");
                return true;
            }
            return userAccount;
        } catch (error) {
            console.log("Error in Account Creation");
            throw error;
        }
    }
    // login method
    async login({email, password}) {
        try {
            const loginAccount =  await this.account.createEmailPasswordSession(
              email,
              password,
            );
            if(loginAccount){
                console.log("Login Successfully");
                return true;
            }
            return loginAccount;
        } catch (error) {
            console.log("Error in Login");
            throw error;
        }
    }
    // get current user method
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Error in Getting Current User");
            throw error;
        }
    }
    // logout method
    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }

    // list teams method
    async listTeams() {
        try {
            return await this.teams.list();
        } catch (error) {
            console.log("Appwrite service :: listTeams :: error", error);
            throw error;
        }
    }
}

// create a instance of authservice
const authService = new AuthService();

// export the authservice
export default authService;