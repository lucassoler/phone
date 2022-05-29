import { EventHandler } from "../../../../common/eventHandler";
import { ChannelAnswered } from "../../domain/aggregates/events/ChannelAnswered";
import { CallRepository } from "../../domain/repositories/callRepository";

export class StartIvrOnChannelAnsweredEventHandler implements EventHandler {
    constructor(private readonly repository: CallRepository) {
        
    }

    async handle(event: ChannelAnswered): Promise<void> {
        const call = await this.repository.byId(event.id);
        await call.startIvr();
        await this.repository.save(call);
    }
}