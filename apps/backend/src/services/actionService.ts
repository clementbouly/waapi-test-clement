import fs from 'fs/promises';
import { emitActionTypes, emitQueue } from '../manager/socketManager';
import { ActionType, ActionsData, UserAction } from '../models/actions';
import { getActionsTypeFromUserActions } from '../utils/utils';

const DATA_PATH = 'apps/backend/data/actions.json';

export const readData = async (): Promise<ActionsData> => {
    try {
        const jsonData = await fs.readFile(DATA_PATH, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Failed to read data:', error);
        throw error;
    }
};

const writeData = async (data: ActionsData): Promise<void> => {
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
        const data = await fs.readFile(DATA_PATH, { encoding: 'utf-8' });
        const json = JSON.parse(data);
        return json.actionTypes;
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
        const randomId = Math.floor(Math.random() * 1000);

        const newAction = {
            id: randomId.toString(),
            actionTypeId: actionTypeId,
            scheduledExecution: new Date().toISOString(),
            executed: false,
        };

        // Decrement the currentCredits of the actionType
        data.actionTypes.forEach((actionType) => {
            if (actionType.id === actionTypeId) {
                if (actionType.currentCredits === 0) return;
                actionType.currentCredits -= 1;
            }
        });

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

    const actionToExecute = data.userActions.find((action) => {
        const actionType = data.actionTypes.find(
            (type) => type.id === action.actionTypeId
        );
        return (
            new Date(action.scheduledExecution) <= now &&
            !action.executed &&
            actionType &&
            actionType.currentCredits > 0
        );
    });

    if (actionToExecute) {
        const actionType = data.actionTypes.find(
            (type) => type.id === actionToExecute.actionTypeId
        );
        if (actionType && actionType.currentCredits > 0) {
            console.log(`Executing action: ${actionToExecute.id}`);
            actionToExecute.executed = true;

            // Delete the action from the queue
            data.userActions = data.userActions.filter(
                (action) => action.id !== actionToExecute.id
            );

            writeData(data);

            // Emit the updated queue and actionTypes
            emitActionTypes(data.actionTypes);
            const queue = getActionsTypeFromUserActions(data);
            emitQueue(queue);
        } else {
            console.log(
                'Insufficient credits or action type not found:',
                actionToExecute.id
            );
        }
    } else {
        console.log('No executable action found at this time.');
    }
};

// Check the queue every 5 seconds
setInterval(processQueue, 3000);

// Regenerate credits for all actionTypes
const regenerateCredits = async () => {
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

    console.log('Credits regenerated');
    writeData(data);
};

// Regenerate credits every 100 seconds
setInterval(regenerateCredits, 100000);
