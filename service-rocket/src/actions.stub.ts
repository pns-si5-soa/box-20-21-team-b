import {ModuleActionsClient} from "../rpc/actions_grpc_pb";
import {credentials} from "grpc";
import {MODULES_HOST, MODULES_PORT} from "./env_variables";

export const clientBooster = new ModuleActionsClient(
    MODULES_HOST+':'+MODULES_PORT,
    credentials.createInsecure()
);

export const clientProbe = new ModuleActionsClient(
    MODULES_HOST+':'+MODULES_PORT,
    credentials.createInsecure()
);

export const clientStage = new ModuleActionsClient(
    MODULES_HOST+':'+MODULES_PORT,
    credentials.createInsecure()
);
