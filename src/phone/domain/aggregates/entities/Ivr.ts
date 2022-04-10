import { Outcall } from "../Outcall";

export class Ivr {
    state: IvrState = IvrState.Initied;

    constructor(readonly id : IvrId, readonly actions: Array<IvrAction>) {
        
    }

    async start(call: Outcall): Promise<void> {
        const action = this.actions[0];
        if (!action) {
            return await call.hangUp();
        }

        if (action.type == IvrActionType.Say) {
            await call.say(action.message);
        }
    }
}

export class IvrAction {
    constructor(readonly type: IvrActionType, readonly message: string) {
        
    }
}


export enum IvrActionType {
    Say
}


export enum IvrState {
    Initied,
    Started
}

export class IvrId {
    constructor(public readonly id: string) {
        
    }
    sameAs(ivrId: string): boolean {
        return this.id == ivrId;
    }
}