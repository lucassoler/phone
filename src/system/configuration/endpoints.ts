import asyncHandler from "express-async-handler";
import { Router } from 'express';
import { healthController } from "../reads/interface/webserver/health.controller";

export const systemEndpoints= (router: Router): void => {
    router.get('/health', asyncHandler(healthController()));
}