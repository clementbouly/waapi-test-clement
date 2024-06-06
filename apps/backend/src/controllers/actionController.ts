import { Request, Response } from 'express';
import {
    emitActionTypes,
    emitError,
    emitQueue,
} from '../manager/socketManager';
import { enqueueAction, getActions, readData } from '../services/actionService';
import { getActionsTypeFromUserActions } from '../utils/utils';

export const getAllActions = async () => {
    try {
        const actions = await getActions();
        emitActionTypes(actions);
    } catch (error) {
        emitError('Error retrieving actions');
    }
};

export const getQueue = async () => {
    try {
        const data = await readData();
        const queue = getActionsTypeFromUserActions(data);

        emitQueue(queue);
    } catch (error) {
        emitError('Error retrieving queue');
    }
};

export const addActionToQueue = async (req: Request, res: Response) => {
    try {
        const { actionTypeId } = req.body;
        const result = await enqueueAction(actionTypeId);
        res.status(201).json(result);
    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error adding action to queue', error: error.message });
    }
};
