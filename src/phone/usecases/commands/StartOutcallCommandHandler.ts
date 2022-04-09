import { Command } from "../../../common/command";
import { CommandHandler } from "../../../common/commandHandler";
import { Channel, ChannelId } from "../../domain/aggregates/entities/Channel";
import { Outcall } from "../../domain/aggregates/Outcall";
import { PhoneNumber } from "../../domain/aggregates/value-objects/PhoneNumber";
import { PhoneNumberFactory } from "../../domain/factories/phoneNumberFactory";
import { CallRepository } from "../../domain/repositories/callRepository";
import { Channels } from "../../domain/services/Channels";
import { UuidGenerator } from "../services/uuidGenerator";

export class StartOutcallCommandHandler implements CommandHandler {

    constructor(private readonly phoneNumberFactory: PhoneNumberFactory,
        private readonly uuidGenerator: UuidGenerator,
        private readonly repository: CallRepository,
        private readonly channels: Channels) {
    }

    async handle(command: StartOutcallCommand): Promise<void> {
        const call = this.initiateOutcall(command);
        await call.start();
        await this.repository.save(call);
    }

    private initiateOutcall(command: StartOutcallCommand) {
        const callId = this.repository.nextCallId();
        const customer = Channel.from(
            PhoneNumber.Generate(this.phoneNumberFactory, command.customer), 
            ChannelId.from(callId.id)
        );
        
        return Outcall.from(callId, customer, this.channels);
    }
}

export class StartOutcallCommand implements Command {
    readonly customer: string;

    constructor(customer: string) {
        this.customer = customer;
    }
}  