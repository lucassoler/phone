import { Command } from "../../../common/command";
import { CommandHandler } from "../../../common/commandHandler";
import { EventPublisher } from "../../../common/EventPublisher";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallRepository } from "../../domain/repositories/callRepository";
import { Channels } from "../../domain/services/Channels";

export class AnswerChannelCommandHandler implements CommandHandler {
    constructor(private readonly repository: CallRepository,
        private readonly eventPublisher: EventPublisher) {
    }

    async handle(command: AnswerChannelCommand): Promise<void> {
        const call = await this.repository.byId(command.callId);
        call.answerCustomer();
        await this.repository.save(call);
        await this.eventPublisher.publish(call.uncommitedEvents);
    }

}

export class AnswerChannelCommand implements Command {
    constructor(readonly callId: CallId) {
        
    }
}