import mongoose, { Schema, Document } from 'mongoose';

export type EventType = 'page_view' | 'click';

export interface IEvent extends Document {
  session_id: string;
  event_type: EventType;
  page_url: string;
  timestamp: Date;
  click_x?: number;
  click_y?: number;
}

const eventSchema = new Schema<IEvent>({
  session_id: {
    type: String,
    required: true,
    index: true
  },
  event_type: {
    type: String,
    required: true,
    enum: ['page_view', 'click']
  },
  page_url: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  click_x: {
    type: Number,
    required: function() {
      return this.event_type === 'click';
    }
  },
  click_y: {
    type: Number,
    required: function() {
      return this.event_type === 'click';
    }
  }
});

export const Event = mongoose.model<IEvent>('Event', eventSchema);