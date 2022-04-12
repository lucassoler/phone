import { Router } from "express";
import { systemEndpoints } from "../../src/system/configuration/endpoints";
import { AwilixContainer } from "awilix";

export const router = (services: AwilixContainer): Router => {
    const router = Router();

    systemEndpoints(router, services);

    return router;
}