import fs from 'fs/promises';
import request from 'supertest';
import app from '../app';
import { getDataPath } from '../utils/utils';

const cleanUserActions = async () => {
    const filePath = getDataPath();
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    jsonData.userActions = jsonData.userActions.slice(0, 2);
    jsonData.actionTypes = jsonData.actionTypes.map((actionType) => {
        actionType.currentCredits = actionType.maxCredits;
        return actionType;
    });

    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

};

describe('POST /api/actions/add', () => {
    afterEach(async () => {
        await cleanUserActions();
    });
    it('should handle the request to add an action', async () => {
        const response = await request(app)
            .post('/api/actions/add')
            .send({ actionTypeId: '1' });

        expect(response.statusCode).toBe(201);
    });
});
