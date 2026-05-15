import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Event, IEvent } from './models/Event';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

interface SessionResponse {
  session_id: string;
  event_count: number;
  first_event: Date;
  last_event: Date;
}

interface SessionDetailResponse {
  session_id: string;
  events: Array<{
    event_type: string;
    page_url: string;
    timestamp: Date;
    click_x?: number;
    click_y?: number;
  }>;
}

interface HeatmapResponse {
  page_url: string;
  clicks: Array<{
    x: number;
    y: number;
    timestamp: Date;
  }>;
}

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/events', async (req: Request, res: Response) => {
  try {
    const eventData: IEvent = req.body;
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

app.get('/api/sessions', async (_req: Request, res: Response) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: '$session_id',
          event_count: { $sum: 1 },
          first_event: { $min: '$timestamp' },
          last_event: { $max: '$timestamp' }
        }
      },
      { $sort: { last_event: -1 } }
    ]);

    const formattedSessions: SessionResponse[] = sessions.map((s) => ({
      session_id: s._id as string,
      event_count: s.event_count as number,
      first_event: s.first_event as Date,
      last_event: s.last_event as Date
    }));

    res.json(formattedSessions);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId as string;
    const events = await Event.find({ session_id: sessionId })
      .select('event_type page_url timestamp click_x click_y')
      .sort({ timestamp: 1 });

    const response: SessionDetailResponse = {
      session_id: sessionId,
      events: events.map((e) => ({
        event_type: e.event_type,
        page_url: e.page_url,
        timestamp: e.timestamp,
        click_x: e.click_x,
        click_y: e.click_y
      }))
    };

    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/heatmap/:pageUrl', async (req: Request, res: Response) => {
  try {
    const pageUrl = req.params.pageUrl as string;
    const clicks = await Event.find({
      page_url: decodeURIComponent(pageUrl),
      event_type: 'click'
    }).select('click_x click_y timestamp');

    const response: HeatmapResponse = {
      page_url: pageUrl,
      clicks: clicks.map((c) => ({
        x: c.click_x ?? 0,
        y: c.click_y ?? 0,
        timestamp: c.timestamp
      }))
    };

    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});