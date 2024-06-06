import { ActionType, ActionsData } from '../models/actions';

export const getActionsTypeFromUserActions = (
    data: ActionsData
): ActionType[] => {
    return data.userActions
        .filter((action) => !action.executed)
        .map((action) => {
            return data.actionTypes.find((type) => type.id === action.actionTypeId);
        })
        .filter((type) => type !== undefined) as ActionType[];
};
