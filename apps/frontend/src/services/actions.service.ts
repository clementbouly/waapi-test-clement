const BACKEND_URL = 'http://localhost:3000';

export const addActionToQueue = async (actionTypeId: string) => {
    const response = await fetch(`${BACKEND_URL}/api/actions/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionTypeId: actionTypeId }),
    });

    if (!response.ok) {
        throw new Error('Failed to add action to queue');
    }

    return response.json();
};
