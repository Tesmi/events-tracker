import { Request, Response, NextFunction } from 'express';
import { Event } from '../models/Event';

export const getSessions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const formattedSessions = sessions.map((s) => ({
      session_id: s._id as string,
      event_count: s.event_count as number,
      first_event: s.first_event as Date,
      last_event: s.last_event as Date
    }));

    res.json(formattedSessions);
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sessionId = req.params.sessionId as string;
    const events = await Event.find({ session_id: sessionId })
      .select('event_type page_url timestamp click_x click_y')
      .sort({ timestamp: 1 });

    res.json({
      session_id: sessionId,
      events: events.map((e) => ({
        event_type: e.event_type,
        page_url: e.page_url,
        timestamp: e.timestamp,
        click_x: e.click_x,
        click_y: e.click_y
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getHeatmapData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pageUrl = req.params.pageUrl as string;
    const clicks = await Event.find({
      page_url: decodeURIComponent(pageUrl),
      event_type: 'click'
    }).select('click_x click_y timestamp');

    res.json({
      page_url: pageUrl,
      clicks: clicks.map((c) => ({
        x: c.click_x ?? 0,
        y: c.click_y ?? 0,
        timestamp: c.timestamp
      }))
    });
  } catch (error) {
    next(error);
  }
};
