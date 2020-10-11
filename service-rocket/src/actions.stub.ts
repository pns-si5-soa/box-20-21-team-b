import {ModuleActionsClient} from "../rpc/actions_grpc_pb";
import {credentials} from "grpc";
import {MODULE_ACTIONS_HOST, MODULE_ACTIONS_PORT} from "./env_variables";

export const client = new ModuleActionsClient(
    MODULE_ACTIONS_HOST+':'+MODULE_ACTIONS_PORT,
    credentials.createInsecure()
);