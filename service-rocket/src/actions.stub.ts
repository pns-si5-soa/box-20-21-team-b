import {ModuleActionsClient} from "../rpc/actions_grpc_pb";
import {credentials} from "grpc";
import {MODULE_BOOSTER_HOST, MODULES_PORT, MODULE_PAYLOAD_HOST, MODULE_MIDDLE_HOST} from "./env_variables";

export const clientBooster = new ModuleActionsClient(
    MODULE_BOOSTER_HOST+':'+MODULES_PORT,
    credentials.createInsecure()
);

export const clientProbe = new ModuleActionsClient(
    MODULE_PAYLOAD_HOST+':'+MODULES_PORT,
    credentials.createInsecure()
);

export const clientStage = new ModuleActionsClient(
    MODULE_MIDDLE_HOST+':'+MODULES_PORT,
    credentials.createInsecure()
);
