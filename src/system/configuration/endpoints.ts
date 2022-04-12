import asyncHandler from "express-async-handler";
import { Router } from 'express';
import { healthController } from "../reads/interface/webserver/health.controller";
import { AwilixContainer } from "awilix";

export const systemEndpoints= (router: Router, services: AwilixContainer): void => {
    router.get('/health', asyncHandler(healthController()));
}