export const PORT = process.env.PORT ? process.env.PORT : 3001;
export const SOCKET_PORT = process.env.SOCKET_PORT ? process.env.SOCKET_PORT : 30011;

export const MISSION_PORT = process.env.MISSION_PORT ? process.env.MISSION_PORT : 3002;
export const MISSION_HOST = process.env.MISSION_HOST ? process.env.MISSION_HOST : 'localhost';

export const MONGO_HOST = process.env.MONGO_HOST ? process.env.MONGO_HOST : "localhost"
export const MONGO_PORT = process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017
export const MONGO_DB = process.env.MONGO_DB ? process.env.MONGO_DB : "blue_origin"

export const PROBE_HOST = process.env.PROBE_HOST ? process.env.PROBE_HOST : "localhost"
export const PROBE_PORT = process.env.PROBE_PORT ? process.env.PROBE_PORT : 3015
export const STAGE_HOST = process.env.STAGE_HOST ? process.env.STAGE_HOST : "localhost"
export const STAGE_PORT = process.env.STAGE_PORT ? process.env.STAGE_PORT : 3025
export const BOOSTER_HOST = process.env.BOOSTER_HOST ? process.env.BOOSTER_HOST : "localhost"
export const BOOSTER_PORT = process.env.BOOSTER_PORT ? process.env.BOOSTER_PORT : 3035
