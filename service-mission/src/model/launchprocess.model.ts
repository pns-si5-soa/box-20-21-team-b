import * as mongoose from 'mongoose'

export const LaunchProcessSchema = new mongoose.Schema({
    process: { type: String, required: true },
    timestamp: { type: String, required: true },

});

export interface LaunchProcessModel {
    process: string;
    timestamp: number;
}
