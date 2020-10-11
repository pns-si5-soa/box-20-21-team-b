import * as mongoose from 'mongoose'

export const RocketMetricSchema = new mongoose.Schema({
    altitude: { type : Number, required : true},
    fuel : { type : Number, required: true},
    pressure : { type : Number, required: true},
    attached : { type : Boolean, required: true },
    speed : { type : Number, required: true },
    latitude : { type : Number, required: true },
    longitude : { type : Number, required: true },
    timestamp : { type : String, required: true },

});

export interface RocketMetric {
    altitude : number;
    fuel : number;
    pressure : number;
    attached : boolean;
    speed: number;
    latitude : number;
    longitude : number;
    timestamp : number;
}