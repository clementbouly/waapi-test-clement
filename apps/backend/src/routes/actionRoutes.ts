import express from 'express';
import { addActionToQueue } from '../controllers/actionController';

const router = express.Router();

router.post('/actions/add', addActionToQueue);

export default router;
