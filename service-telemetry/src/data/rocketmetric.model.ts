import * as mongoose from 'mongoose'

enum RocketMetricTopic {
    PROCESSUS, POSITION
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