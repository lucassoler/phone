import asyncHandler from "express-async-handler";
import { Router } from 'express';
import { outcallStartController } from "../writes/interface/webserver/outcall.controller";
import { Dependencies } from "../../../configuration/services/serviceLocator";

export const phoneEndpoints = (router: Router, services: Dependencies): void => {
    router.post('/outcall', asyncHandler(outcallStartController(services)));
}