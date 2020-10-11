// package: actions
// file: actions.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as actions_pb from "./actions_pb";

interface IModuleActionsService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    boom: IModuleActionsService_IBoom;
    detach: IModuleActionsService_IDetach;
    setThrustersSPeed: IModuleActionsService_ISetThrustersSPeed;
}

interface IModuleActionsService_IBoom extends grpc.MethodDefinition<actions_pb.Empty, actions_pb.BoomReply> {
    path: "/actions.ModuleActions/Boom";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<actions_pb.Empty>;
    requestDeserialize: grpc.deserialize<actions_pb.Empty>;
    responseSerialize: grpc.serialize<actions_pb.BoomReply>;
    responseDeserialize: grpc.deserialize<actions_pb.BoomReply>;
}
interface IModuleActionsService_IDetach extends grpc.MethodDefinition<actions_pb.Empty, actions_pb.Boolean> {
    path: "/actions.ModuleActions/Detach";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<actions_pb.Empty>;
    requestDeserialize: grpc.deserialize<actions_pb.Empty>;
    responseSerialize: grpc.serialize<actions_pb.Boolean>;
    responseDeserialize: grpc.deserialize<actions_pb.Boolean>;
}
interface IModuleActionsService_ISetThrustersSPeed extends grpc.MethodDefinition<actions_pb.Double, actions_pb.Empty> {
    path: "/actions.ModuleActions/SetThrustersSPeed";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<actions_pb.Double>;
    requestDeserialize: grpc.deserialize<actions_pb.Double>;
    responseSerialize: grpc.serialize<actions_pb.Empty>;
    responseDeserialize: grpc.deserialize<actions_pb.Empty>;
}

export const ModuleActionsService: IModuleActionsService;

export interface IModuleActionsServer {
    boom: grpc.handleUnaryCall<actions_pb.Empty, actions_pb.BoomReply>;
    detach: grpc.handleUnaryCall<actions_pb.Empty, actions_pb.Boolean>;
    setThrustersSPeed: grpc.handleUnaryCall<actions_pb.Double, actions_pb.Empty>;
}

export interface IModuleActionsClient {
    boom(request: actions_pb.Empty, callback: (error: grpc.ServiceError | null, response: actions_pb.BoomReply) => void): grpc.ClientUnaryCall;
    boom(request: actions_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: actions_pb.BoomReply) => void): grpc.ClientUnaryCall;
    boom(request: actions_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: actions_pb.BoomReply) => void): grpc.ClientUnaryCall;
    detach(request: actions_pb.Empty, callback: (error: grpc.ServiceError | null, response: actions_pb.Boolean) => void): grpc.ClientUnaryCall;
    detach(request: actions_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: actions_pb.Boolean) => void): grpc.ClientUnaryCall;
    detach(request: actions_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: actions_pb.Boolean) => void): grpc.ClientUnaryCall;
    setThrustersSPeed(request: actions_pb.Double, callback: (error: grpc.ServiceError | null, response: actions_pb.Empty) => void): grpc.ClientUnaryCall;
    setThrustersSPeed(request: actions_pb.Double, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: actions_pb.Empty) => void): grpc.ClientUnaryCall;
    setThrustersSPeed(request: actions_pb.Double, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: actions_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class ModuleActionsClient extends grpc.Client implements IModuleActionsClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public boom(request: actions_pb.Empty, callback: (error: grpc.ServiceError | null, response: actions_pb.BoomReply) => void): grpc.ClientUnaryCall;
    public boom(request: actions_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: actions_pb.BoomReply) => void): grpc.ClientUnaryCall;
    public boom(request: actions_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: actions_pb.BoomReply) => void): grpc.ClientUnaryCall;
    public detach(request: actions_pb.Empty, callback: (error: grpc.ServiceError | null, response: actions_pb.Boolean) => void): grpc.ClientUnaryCall;
    public detach(request: actions_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: actions_pb.Boolean) => void): grpc.ClientUnaryCall;
    public detach(request: actions_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: actions_pb.Boolean) => void): grpc.ClientUnaryCall;
    public setThrustersSPeed(request: actions_pb.Double, callback: (error: grpc.ServiceError | null, response: actions_pb.Empty) => void): grpc.ClientUnaryCall;
    public setThrustersSPeed(request: actions_pb.Double, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: actions_pb.Empty) => void): grpc.ClientUnaryCall;
    public setThrustersSPeed(request: actions_pb.Double, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: actions_pb.Empty) => void): grpc.ClientUnaryCall;
}
