import { EventEmitter } from "events";

export interface IEventBus {
    emit<T>(event: string, payload: T): void;
    on<T>(event: string, handler: (payload: T) => void): void;
}

class LocalEventBus implements IEventBus {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    emit<T>(event: string, payload: T): void {
        this.eventEmitter.emit(event, payload);
    }

    on<T>(event: string, handler: (payload: T) => void): void {
        this.eventEmitter.on(event, handler);
    }
}

export const eventBus: IEventBus = new LocalEventBus();