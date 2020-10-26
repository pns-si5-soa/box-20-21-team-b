export const PORT = process.env.PORT ? process.env.PORT : 3001;

export const MONGO_HOST = process.env.MONGO_HOST ? process.env.MONGO_HOST : 'localhost'
export const MONGO_PORT = process.env.MONGO_PORT ? process.env.MONGO_PORT : 27017
export const MONGO_DB = process.env.MONGO_DB ? process.env.MONGO_DB : 'blue_origin'

// array containing tuple (id of rocket, id of module)
export const MODULES = process.env.MODULES ? process.env.MODULES : '1,1,booster,1,2,middle,1,3,payload,2,1,booster,2,2,middle,2,3,payload'

export const MODULES_PORT = process.env.MODULES_PORT ? process.env.MODULES_PORT : 80
