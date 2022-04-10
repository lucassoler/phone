export class Ivr {
    state: IvrState = IvrState.Initied;

    constructor(readonly id : IvrId) {
        
    }
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