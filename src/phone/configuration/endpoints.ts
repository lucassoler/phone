import asyncHandler from "express-async-handler";
import { Router } from 'express';
import { outcallStartController, outCallStateUpdateController } from "../writes/interface/webserver/outcall.controller";
import { Dependencies } from "../../../configuration/services/serviceLocator";

export const phoneEndpoints = (router: Router, services: Dependencies): void => {
    router.post('/outcall', asyncHandler(outcallStartController(services)));
    router.post('/outcall/status', asyncHandler(outCallStateUpdateController(services)));
}