import { Router } from 'express';
import { createEvent } from '../controllers/eventController';
import { getSessions, getSessionById, getHeatmapData } from '../controllers/sessionController';

const router = Router();

// Events
router.post('/events', createEvent);

// Sessions
router.get('/sessions', getSessions);
router.get('/sessions/:sessionId', getSessionById);

// Heatmap
router.get('/heatmap/:pageUrl', getHeatmapData);

export default router;
