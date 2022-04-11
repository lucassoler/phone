import { Router } from "express";
import { systemEndpoints } from "../../src/system/configuration/endpoints";

export const router = (): Router => {
    const router = Router();

    systemEndpoints(router);

    return router;
}