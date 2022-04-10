import { DomainEvent } from "./domainEvent";

export interface EventHandler<Response = void | any> {
    handle(event:DomainEvent): Promise<Response>;
}