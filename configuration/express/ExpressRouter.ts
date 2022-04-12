import { Router } from "express";
import { systemEndpoints } from "../../src/system/configuration/endpoints";
import { phoneEndpoints } from "../../src/phone/configuration/endpoints";
import { Dependencies } from "../services/serviceLocator";

export const router = (services: Dependencies): Router => {
    const router = Router();

    systemEndpoints(router, services);
    phoneEndpoints(router, services);

    return router;
}