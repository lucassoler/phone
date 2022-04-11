import { Command } from "../../../../common/command";
import { CommandHandler } from "../../../../common/commandHandler";
import { Channel, ChannelId } from "../../domain/aggregates/entities/Channel";
import { Ivr, IvrId } from "../../domain/aggregates/entities/Ivr";
import { Outcall } from "../../domain/aggregates/Outcall";
import { CallId } from "../../domain/aggregates/value-objects/CallId";
import { PhoneNumber } from "../../domain/aggregates/value-objects/PhoneNumber";
import { PhoneNumberFactory } from "../../domain/factories/phoneNumberFactory";
import { CallRepository } from "../../domain/repositories/callRepository";
import { IvrRepository } from "../../domain/repositories/IvrRepository";
import { Channels } from "../../domain/services/Channels";

export class StartOutcallCommandHandler implements CommandHandler {

    constructor(private readonly phoneNumberFactory: PhoneNumberFactory,
        private readonly repository: CallRepository,
        private readonly channels: Channels,
        private readonly ivrRepository: IvrRepository) {
    }

    async handle(command: StartOutcallCommand): Promise<void> {
        const callId = this.repository.nextCallId();
        const channelId = ChannelId.from(callId.id);
        try {
            const customer = this.initiateCustomerChannel(command.customer, channelId);
            const ivr = await this.ivrRepository.load(command.ivrId);
            const call = await this.startOutcall(callId, customer, ivr);
            await this.repository.save(call);
        } catch (error) {
            await this.channels.close(channelId)
            throw error;
        }
    }

    private async startOutcall(callId: CallId, customer: Channel, ivr: Ivr) {
        const call = this.initiateOutcall(callId, customer, ivr);
        await call.start();
        return call;
    }

    private initiateCustomerChannel(number: string, channelId: ChannelId) {
        return Channel.from(
            PhoneNumber.Generate(this.phoneNumberFactory, number),
            channelId
        );
    }

    private initiateOutcall(callId: CallId, customer: Channel, ivr: Ivr) {
        return Outcall.from(callId, customer, ivr, this.channels);
    }
}

export class StartOutcallCommand implements Command {
    constructor(readonly customer: string, readonly ivrId: IvrId) {
    }
}  