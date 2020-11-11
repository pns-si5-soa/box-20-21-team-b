import {ModuleActionsClient} from "../../../rpc/actions_grpc_pb";

export class Module {
  id: number
  moduleAction: ModuleActionsClient
  moduleName: string

  constructor(id: number, moduleAction: ModuleActionsClient, moduleName: string) {
    this.id = id;
    this.moduleAction = moduleAction
    this.moduleName = moduleName
  }
}
