import { Command } from "../../../common/command";
import { CommandHandler } from "../../../common/commandHandler";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { CallRepository } from "../../domain/repositories/callRepository";

export class CallHangingUpCommandHandler implements CommandHandler {
    private readonly repository: CallRepository;

    constructor(callRepository: CallRepository) {
        this.repository = callRepository;
    }
    
    async handle(command: CallHangingUpCommand): Promise<void> {
        const call = await this.repository.byId(CallId.from(command.callId));
        await call.hangUp();
        await this.repository.save(call);
    }
}

export class CallHangingUpCommand implements Command {
    callId: string;

    constructor(callId: string) {
        this.callId = callId
    }
}