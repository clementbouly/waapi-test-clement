import fs from 'fs/promises';
import request from 'supertest';
import app from '../app';
import { MOCK_DATA_PATH } from '../utils/utils';

export const resetMockDatabase = async () => {
    const filePath = MOCK_DATA_PATH
    const data = await fs.readFile(filePath, 'utf8');
    if (data.trim()) {
        const jsonData = JSON.parse(data);
        jsonData.userActions = jsonData.userActions.slice(0, 2);
        jsonData.actionTypes = jsonData.actionTypes.map((actionType) => {
            actionType.currentCredits = actionType.maxCredits;
            return actionType;
        });

        await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
    }
};

describe('POST /api/actions/add', () => {
    afterEach(async () => {
        await resetMockDatabase();
    });
    it('should handle the request to add an action', async () => {
        const response = await request(app)
            .post('/api/actions/add')
            .send({ actionTypeId: '1' });

        expect(response.statusCode).toBe(201);
    });
});
