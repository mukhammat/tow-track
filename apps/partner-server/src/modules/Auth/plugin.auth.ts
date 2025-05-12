import { FastifyPluginAsync } from "fastify";
import { db } from "@db"
import {AuthController, AuthService} from ".";
import { HttpResponse } from "@utils";

export const authPlugin: FastifyPluginAsync = async (fastify, _options)=> {
    const authService = new AuthService(db);
    const httpResponse = new HttpResponse();
    new AuthController(fastify, authService, httpResponse);
};