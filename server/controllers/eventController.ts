import { Request, Response, NextFunction } from 'express';
import { Event, IEvent } from '../models/Event';

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const eventData: IEvent = req.body;
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};
