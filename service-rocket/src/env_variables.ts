export const PORT = process.env.PORT ? process.env.PORT : 3001;
export const WEATHER_PORT = process.env.WEATHER_PORT ? process.env.WEATHER_PORT : 3000;
export const MISSION_PORT = process.env.MISSION_PORT ? process.env.MISSION_PORT : 3002;

export const WEATHER_HOST = process.env.WEATHER_HOST ? process.env.WEATHER_HOST : 'localhost';
export const MISSION_HOST = process.env.MISSION_HOST ? process.env.MISSION_HOST : 'localhost';

export const MONGO_HOST =  process.env.MONGO_HOST ?  process.env.MONGO_HOST : "localhost"
export const MONGO_PORT =  process.env.MONGO_PORT ?  process.env.MONGO_PORT : 27017
export const MONGO_DB =  process.env.MONGO_DB ?  process.env.MONGO_DB : "nest"
