import { io } from '../main';
import { ActionType } from '../models/actions';

export function emitActionTypes(actionTypes: ActionType[]) {
    io.emit('getAllActions', actionTypes);
}

export function emitQueue(queue: ActionType[]) {
    io.emit('getQueue', queue);
}

export function emitError(error: string) {
    io.emit('error', error);
}

export function emitQueueTimer(time: number) {
    io.emit('queueTimer', time);
}
