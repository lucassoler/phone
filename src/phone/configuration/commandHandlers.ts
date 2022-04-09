import { RegisteredCommandHandler } from "../../common/commandDispatcher"
import { AwesomePhoneNumberFactory } from "../infrastructure/factories/awesomePhoneNumberFactory"
import { CallRepositoryInMemory } from "../infrastructure/repositories/callRepositoryInMemory"
import { FakeChannels } from "../infrastructure/services/FakeChannels"
import { CallIncomingCommand, CallIncomingCommandHandler } from "../usecases/commands/callIncomingCommandHandler"

export const commandHandlers = (): RegisteredCommandHandler => {
    return {
        [typeof CallIncomingCommand]: new CallIncomingCommandHandler(new CallRepositoryInMemory(), new AwesomePhoneNumberFactory(), new FakeChannels())
    }
}