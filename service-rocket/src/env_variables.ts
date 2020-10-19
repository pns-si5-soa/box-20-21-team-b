export const PORT = process.env.PORT ? process.env.PORT : 3001;

export const MONGO_HOST = process.env.MONGO_HOST ? process.env.MONGO_HOST : "localhost"
export const MONGO_PORT = process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017
export const MONGO_DB = process.env.MONGO_DB ? process.env.MONGO_DB : "blue_origin"

export const MODULE_BOOSTER_HOST = process.env.MODULE_BOOSTER_HOST ? process.env.MODULE_BOOSTER_HOST : "module-actions-booster"
export const MODULE_MIDDLE_HOST = process.env.MODULE_MIDDLE_HOST ? process.env.MODULE_MIDDLE_HOST : "module-actions-middle"
export const MODULE_PAYLOAD_HOST = process.env.MODULE_PAYLOAD_HOST ? process.env.MODULE_PAYLOAD_HOST : "module-actions-payload"

export const MODULES_PORT = process.env.MODULES_PORT ? process.env.MODULES_PORT : 80
