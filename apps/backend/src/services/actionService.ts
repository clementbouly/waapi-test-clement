import crypto from 'crypto';
import fs from 'fs/promises';
import {
    emitActionTypes,
    emitQueue,
    emitQueueTimer,
} from '../manager/socketManager';
import { ActionType, ActionsData, UserAction } from '../models/actions';
import { getActionsTypeFromUserActions, getDataPath } from '../utils/utils';

const DATA_PATH = getDataPath();
const QUEUE_INTERVAL_SECONDS = 15;
const CREDITS_REGENERATION_INTERVAL_MINUTES = 10;
let timer = new Date();

export const readData = async (): Promise<ActionsData> => {
    try {
        const jsonData = await fs.readFile(DATA_PATH, 'utf8');
        // check if jsonData has a valid JSON format
        if (jsonData.trim()) {
            return JSON.parse(jsonData);
        }
        return { actionTypes: [], userActions: [] };
    } catch (error) {
        console.error('Failed to read data:', error);
        throw error;
    }
};

export const writeData = async (data: ActionsData): Promise<void> => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(DATA_PATH, jsonData, 'utf8');
    } catch (error) {
        console.error('Failed to write data:', error);
        throw error;
    }
};

export const getActions = async (): Promise<ActionType[]> => {
    try {
        const data = await fs.readFile(DATA_PATH, 'utf8');
        // check if jsonData has a valid JSON format
        if (data.trim()) {
            const json = JSON.parse(data);
            return json.actionTypes;
        }
        return [];
    } catch (error) {
        console.error('Failed to read or parse actions:', error);
        throw error;
    }
};

// Add an action to the queue
export const enqueueAction = async (
    actionTypeId: string
): Promise<UserAction> => {
    const data = await readData();
    return new Promise((resolve, _) => {
        const uuid = crypto.randomUUID();

        const newAction = {
            id: uuid.toString(),
            actionTypeId: actionTypeId,
            scheduledExecution: new Date().toISOString(),
            executed: false,
        };

        data.userActions.push(newAction);
        writeData(data);

        const queue = getActionsTypeFromUserActions(data);
        emitQueue(queue);
        emitActionTypes(data.actionTypes);

        resolve(newAction);
    });
};

export const processQueue = async () => {
    const data = await readData();
    const now = new Date();
    timer = now;

    // Map action types for quick lookup
    const actionTypes = data.actionTypes.reduce((acc, type) => {
        acc[type.id] = type;
        return acc;
    }, {});

    // Iterate over userActions to find the first executable action
    const index = data.userActions.findIndex((action) => {
        const actionType = actionTypes[action.actionTypeId];
        return (
            new Date(action.scheduledExecution) <= now &&
            !action.executed &&
            actionType &&
            actionType.currentCredits > 0
        );
    });

    if (index !== -1) {
        const actionToExecute = data.userActions[index];
        executeAction(actionToExecute, actionTypes);
        // Remove the executed action from the queue
        data.userActions.splice(index, 1);
        await writeData(data);
        emitUpdatedData(data);
    } else {
        console.log('No executable action found at this time.');
    }
};

const executeAction = (action, actionTypes) => {
    const actionType = actionTypes[action.actionTypeId];
    if (actionType && actionType.currentCredits > 0) {
        console.log(`Executing action: ${action.id}`);
        action.executed = true;
        actionType.currentCredits -= 1;
    } else {
        console.log('Insufficient credits or action type not found:', action.id);
    }
};

const emitUpdatedData = (data) => {
    const queue = getActionsTypeFromUserActions(data);
    emitActionTypes(data.actionTypes);
    emitQueue(queue);
};

setInterval(processQueue, QUEUE_INTERVAL_SECONDS * 1000);

// Emit the remaining time in secondes for the next queue processing
const emitRemainingTime = async () => {
    const now = new Date();

    const remainingTimeInSeconds = Math.floor(
        (now.getTime() - timer.getTime()) / 1000
    );

    emitQueueTimer(QUEUE_INTERVAL_SECONDS - remainingTimeInSeconds);
};

setInterval(emitRemainingTime, 1000);

// Regenerate credits for all actionTypes
export const regenerateCredits = async () => {
    const data = await readData();

    data.actionTypes.forEach((actionType) => {
        const randomPercentage = 0.8 + Math.random() * 0.2;
        const regeneratedCredits = Math.floor(
            actionType.maxCredits * randomPercentage
        );
        actionType.currentCredits = Math.min(
            actionType.maxCredits,
            regeneratedCredits
        );
    });
    emitActionTypes(data.actionTypes);

    console.log('Credits regenerated');
    writeData(data);
};

setInterval(
    regenerateCredits,
    CREDITS_REGENERATION_INTERVAL_MINUTES * 60 * 1000
);
