import { RegisteredCommandHandler } from "../../common/commandDispatcher"
import { PhoneNumberFactory } from "../writes/domain/factories/phoneNumberFactory"
import { CallRepository } from "../writes/domain/repositories/callRepository"
import { IvrRepository } from "../writes/domain/repositories/IvrRepository"
import { Channels } from "../writes/domain/services/Channels"
import { StartOutcallCommand, StartOutcallCommandHandler } from "../writes/usecases/commands/StartOutcallCommandHandler"

export const phoneCommandHandlers = (phoneNumberFactory: PhoneNumberFactory, callRepository: CallRepository, channels: Channels, ivrRepository: IvrRepository): RegisteredCommandHandler => {
    
    return {
        [StartOutcallCommand.name]: new StartOutcallCommandHandler(phoneNumberFactory, callRepository, channels,ivrRepository)
    }
}