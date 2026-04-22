import { Client, Account, Databases, Teams } from "appwrite";
import config from "./rootConfig";

const client = new Client();

client
  .setEndpoint(config.appWriteUrl)
  .setProject(config.appWriteProjectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);
