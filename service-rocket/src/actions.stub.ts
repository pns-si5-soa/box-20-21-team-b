import {ModuleActionsClient} from "../rpc/actions_grpc_pb";
import {credentials} from "grpc";
import {PROBE_HOST, PROBE_PORT, BOOSTER_HOST, BOOSTER_PORT, STAGE_HOST, STAGE_PORT} from "./env_variables";

export const clientBooster = new ModuleActionsClient(
    BOOSTER_HOST+':'+BOOSTER_PORT,
    credentials.createInsecure()
);

export const clientProbe = new ModuleActionsClient(
    PROBE_HOST+':'+PROBE_PORT,
    credentials.createInsecure()
);

export const clientStage = new ModuleActionsClient(
    STAGE_HOST+':'+STAGE_PORT,
    credentials.createInsecure()
);