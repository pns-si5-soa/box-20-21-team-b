import * as mongoose from 'mongoose'

export const RocketEventSchema = new mongoose.Schema({
    process: { type: String, required: true },
    timestamp: { type: String, required: true },

});

export interface RocketEventModel {
    process: string;
    timestamp: number;
}