import { DomainEvent } from "./domainEvent";
import { EventHandler } from "./eventHandler";

export interface EventPublisher {
    publish(event: DomainEvent): Promise<void>;
    registerHandlers(handlers: RegisteredEventHandler): EventPublisher;
}

export interface RegisteredEventHandler {
    [event: string]: EventHandler
} 

export class InternalEventPublisher implements EventPublisher {
    private handlers: RegisteredEventHandler = {};
    
    registerHandlers(handlers: RegisteredEventHandler): EventPublisher {
        this.handlers = handlers;
        return this;
    }

    async publish(events: Array<DomainEvent>): Promise<void> {
        for (const event of events) {
            if (this.handlers[event.constructor.name] !== undefined) {
                await this.handlers[event.constructor.name].handle(event);
            }
        }

        return Promise.resolve();
    }
}