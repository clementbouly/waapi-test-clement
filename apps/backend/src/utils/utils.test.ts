import { DATA_MOCK } from '../mocks/dataMock';
import { getActionsTypeFromUserActions, getDataPath } from './utils';

describe('getActionsTypeFromUserActions', () => {
    it('should return an array of action types', () => {
        const data = DATA_MOCK;

        const expectedActionTypes = [
            {
                id: '1',
                name: 'faire les courses',
                maxCredits: 10,
                currentCredits: 4,
                userActionId: '970',
            },
            {
                id: '2',
                name: 'manger des pommes',
                maxCredits: 5,
                currentCredits: 4,
                userActionId: '153',
            },
        ];

        const actionTypes = getActionsTypeFromUserActions(data);

        expect(actionTypes).toEqual(expectedActionTypes);
    });
});


describe('getDataPath', () => {
    it('should return the correct data path', () => {
        process.env.NODE_ENV = 'test';

        const dataPath = getDataPath();

        expect(dataPath).toBe('apps/backend/mocks/fakeData.json');
    });

    it('should return the correct data path', () => {
        process.env.NODE_ENV = 'production';

        const dataPath = getDataPath();

        expect(dataPath).toBe('apps/backend/data/actions.json');
    });
});