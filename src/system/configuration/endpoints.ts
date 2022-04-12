import asyncHandler from "express-async-handler";
import { Router } from 'express';
import { healthController } from "../reads/interface/webserver/health.controller";
import { Dependencies } from "../../../configuration/services/serviceLocator";

export const systemEndpoints= (router: Router, services: Dependencies): void => {
    router.get('/health', asyncHandler(healthController()));
}