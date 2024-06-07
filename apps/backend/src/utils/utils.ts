import { ActionType, ActionsData } from '../models/actions';

// Get the actions that are not executed yet
export const getActionsTypeFromUserActions = (
    data: ActionsData
): ActionType[] => {
    return data.userActions
        .filter((action) => !action.executed)
        .map((userAction) => {
            const actionType = data.actionTypes.find(
                (type) => type.id === userAction.actionTypeId
            );
            if (actionType) {
                return {
                    ...actionType,
                    userActionId: userAction.id,
                };
            }
            return undefined;
        })
        .filter((type) => type !== undefined) as ActionType[];
};

export const isTestEnv = (): boolean => {
    return process.env.NODE_ENV === 'test';
};

export const MOCK_DATA_PATH = 'apps/backend/mocks/fakeData.json';
const DATA_PATH = 'apps/backend/data/actions.json';

export const getDataPath = (): string => {
    return isTestEnv()
        ? MOCK_DATA_PATH
        : DATA_PATH
};
