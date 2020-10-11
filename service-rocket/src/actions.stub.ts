import {ModuleActionsClient} from "../rpc/actions_grpc_pb";
import {credentials} from "grpc";

export const client = new ModuleActionsClient(
    'localhost:3005',
    credentials.createInsecure()
);