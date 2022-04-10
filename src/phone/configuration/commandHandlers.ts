import { RegisteredCommandHandler } from "../../common/commandDispatcher"
import { AwesomePhoneNumberFactory } from "../infrastructure/factories/awesomePhoneNumberFactory"
import { CallRepositoryInMemory } from "../infrastructure/repositories/callRepositoryInMemory"
import { IvrRepositoryInMemory } from "../infrastructure/repositories/IvrRepositoryInMemory"
import { FakeChannels } from "../infrastructure/services/FakeChannels"
import { DEFAULT_ID } from "../tests/helpers/OutcallBuilder"
import { StartOutcallCommand, StartOutcallCommandHandler } from "../usecases/commands/StartOutcallCommandHandler"

export const commandHandlers = (): RegisteredCommandHandler => ({
    [typeof StartOutcallCommand]: new StartOutcallCommandHandler(new AwesomePhoneNumberFactory(), new CallRepositoryInMemory(DEFAULT_ID, new IvrRepositoryInMemory(), new FakeChannels()), new FakeChannels(), new IvrRepositoryInMemory())
})