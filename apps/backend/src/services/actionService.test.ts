import { emitActionTypes, emitQueue } from '../manager/socketManager';
import { DATA_MOCK } from '../mocks/dataMock';
import {
    enqueueAction,
    getActions,
    processQueue,
    readData,
    regenerateCredits,
    writeData,
} from './actionService';

describe('getActions', () => {
    it('should read the file and return the parsed JSON', async () => {
        const data = DATA_MOCK;
        await writeData(data);

        const result = await getActions();

        expect(result).toEqual(DATA_MOCK.actionTypes);
    });
});

describe('enqueueAction', () => {
    jest.mock('../manager/socketManager', () => ({
        emitQueue: jest.fn(),
        emitActionTypes: jest.fn(),
    }));

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add an action to the queue', async () => {
        const data = DATA_MOCK;
        await writeData(data);

        const actionTypeId = '1';
        await enqueueAction(actionTypeId);

        const read = await readData();
        const action = read.userActions[read.userActions.length - 1];

        expect(action.actionTypeId).toBe(actionTypeId);

        // Verify that emitQueue and emitActionTypes are called
        expect(emitQueue).toHaveBeenCalled();
        expect(emitActionTypes).toHaveBeenCalled();
    });
});

describe('processQueue', () => {
    jest.mock('../manager/socketManager', () => ({
        emitQueue: jest.fn(),
        emitActionTypes: jest.fn(),
    }));

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should process the queue', async () => {
        const data = DATA_MOCK;
        await writeData(data);

        await processQueue();

        const read = await readData();
        const userActions = read.userActions;
        const currentAction = userActions[0];

        expect(userActions.length).toBe(1);
        expect(currentAction.id).toBe('153');

        expect(emitQueue).toHaveBeenCalled();
        expect(emitActionTypes).toHaveBeenCalled();
    });
});

describe('regenerateCredits', () => {
    jest.mock('../manager/socketManager', () => ({
        emitQueue: jest.fn(),
        emitActionTypes: jest.fn(),
    }));

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should regenerate credits at maxCredit value', async () => {
        const data = DATA_MOCK;
        const initialCredits = data.actionTypes[0].currentCredits;
        await writeData(data);

        await regenerateCredits();

        const read = await readData();
        const actionTypes = read.actionTypes;

        const action = actionTypes[0];

        expect(action.currentCredits).not.toBe(initialCredits);
        expect(emitActionTypes).toHaveBeenCalled();
    });
});
