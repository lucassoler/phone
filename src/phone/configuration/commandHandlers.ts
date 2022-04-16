import { RegisteredCommandHandler } from "../../common/commandDispatcher"
import { EventPublisher } from "../../common/EventPublisher"
import { PhoneNumberFactory } from "../writes/domain/factories/phoneNumberFactory"
import { CallRepository } from "../writes/domain/repositories/callRepository"
import { IvrRepository } from "../writes/domain/repositories/IvrRepository"
import { Channels } from "../writes/domain/services/Channels"
import { AnswerChannelCommand, AnswerChannelCommandHandler } from "../writes/usecases/commands/AnswerChannelCommandHandler"
import { StartOutcallCommand, StartOutcallCommandHandler } from "../writes/usecases/commands/StartOutcallCommandHandler"

export const phoneCommandHandlers = (phoneNumberFactory: PhoneNumberFactory, callRepository: CallRepository, channels: Channels, ivrRepository: IvrRepository, eventPublisher: EventPublisher): RegisteredCommandHandler => {
    
    return {
        [StartOutcallCommand.name]: new StartOutcallCommandHandler(phoneNumberFactory, callRepository, channels,ivrRepository),
        [AnswerChannelCommand.name]: new AnswerChannelCommandHandler(callRepository, eventPublisher)
    }
}