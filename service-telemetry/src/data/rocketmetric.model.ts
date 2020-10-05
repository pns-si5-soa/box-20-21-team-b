import * as mongoose from 'mongoose'

export enum RocketMetricTopic {
    PROCESSUS = "Mission Processus", POSITION="Rocket Position"
}

export const RocketMetricSchema = new mongoose.Schema({
    topic: { type : RocketMetricTopic, required : true},
    description : { type : String, required: true},
    timestamp : { type : String, required: true},
    altitude : { type : Number, required: false }
});

export interface RocketMetric {
    topic : string;
    description : string;
    timestamp : string;
    altitude : number;

}