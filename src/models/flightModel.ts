import mongoose, { Schema, Document, model } from 'mongoose';

export interface IFlight extends Document {
  flightNumber: string;
  origin: string;
  destination: string;
  scheduledTime: Date;
  departureTime: Date;
    arrivalTime: Date;
  status: 'Scheduled' | 'In-flight' | 'Cancelled' | 'Delayed';
  type: 'Commercial' | 'Military' | 'Private';
}

const FlightSchema = new Schema<IFlight>(
  {
    flightNumber: { type: String, required: true, unique: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    departureTime: { type: Date }, 
    arrivalTime: { type: Date },
    status: {
      type: String,
      enum: ['Scheduled', 'In-flight', 'Cancelled', 'Delayed'],
      default: 'Scheduled',
    },
    type: {
      type: String,
      enum: ['Commercial', 'Military', 'Private'],
      required: true,
    },
  },
  { timestamps: true }
);

const FlightModel = mongoose.models?.Flight || model<IFlight>('Flight', FlightSchema);

export default FlightModel;