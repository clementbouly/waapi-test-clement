export interface ActionType {
    id: string;
    name: string;
    maxCredits: number;
    currentCredits: number;
}

export interface UserAction {
    id: string;
    actionTypeId: string;
    scheduledExecution: string;
    executed: boolean;
}

export interface ActionsData {
    actionTypes: ActionType[];
    userActions: UserAction[];
}
