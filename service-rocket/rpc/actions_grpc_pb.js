// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var rpc_actions_pb = require('../rpc/actions_pb.js');

function serialize_actions_Boolean(arg) {
  if (!(arg instanceof rpc_actions_pb.Boolean)) {
    throw new Error('Expected argument of type actions.Boolean');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_actions_Boolean(buffer_arg) {
  return rpc_actions_pb.Boolean.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_actions_BoomReply(arg) {
  if (!(arg instanceof rpc_actions_pb.BoomReply)) {
    throw new Error('Expected argument of type actions.BoomReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_actions_BoomReply(buffer_arg) {
  return rpc_actions_pb.BoomReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_actions_Double(arg) {
  if (!(arg instanceof rpc_actions_pb.Double)) {
    throw new Error('Expected argument of type actions.Double');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_actions_Double(buffer_arg) {
  return rpc_actions_pb.Double.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_actions_Empty(arg) {
  if (!(arg instanceof rpc_actions_pb.Empty)) {
    throw new Error('Expected argument of type actions.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_actions_Empty(buffer_arg) {
  return rpc_actions_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_actions_OkReply(arg) {
  if (!(arg instanceof rpc_actions_pb.OkReply)) {
    throw new Error('Expected argument of type actions.OkReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_actions_OkReply(buffer_arg) {
  return rpc_actions_pb.OkReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_actions_RunningReply(arg) {
  if (!(arg instanceof rpc_actions_pb.RunningReply)) {
    throw new Error('Expected argument of type actions.RunningReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_actions_RunningReply(buffer_arg) {
  return rpc_actions_pb.RunningReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_actions_SetThrustersSpeedReply(arg) {
  if (!(arg instanceof rpc_actions_pb.SetThrustersSpeedReply)) {
    throw new Error('Expected argument of type actions.SetThrustersSpeedReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_actions_SetThrustersSpeedReply(buffer_arg) {
  return rpc_actions_pb.SetThrustersSpeedReply.deserializeBinary(new Uint8Array(buffer_arg));
}


var ModuleActionsService = exports.ModuleActionsService = {
  boom: {
    path: '/actions.ModuleActions/Boom',
    requestStream: false,
    responseStream: false,
    requestType: rpc_actions_pb.Empty,
    responseType: rpc_actions_pb.BoomReply,
    requestSerialize: serialize_actions_Empty,
    requestDeserialize: deserialize_actions_Empty,
    responseSerialize: serialize_actions_BoomReply,
    responseDeserialize: deserialize_actions_BoomReply,
  },
  detach: {
    path: '/actions.ModuleActions/Detach',
    requestStream: false,
    responseStream: false,
    requestType: rpc_actions_pb.Empty,
    responseType: rpc_actions_pb.Boolean,
    requestSerialize: serialize_actions_Empty,
    requestDeserialize: deserialize_actions_Empty,
    responseSerialize: serialize_actions_Boolean,
    responseDeserialize: deserialize_actions_Boolean,
  },
  setThrustersSpeed: {
    path: '/actions.ModuleActions/SetThrustersSpeed',
    requestStream: false,
    responseStream: false,
    requestType: rpc_actions_pb.Double,
    responseType: rpc_actions_pb.SetThrustersSpeedReply,
    requestSerialize: serialize_actions_Double,
    requestDeserialize: deserialize_actions_Double,
    responseSerialize: serialize_actions_SetThrustersSpeedReply,
    responseDeserialize: deserialize_actions_SetThrustersSpeedReply,
  },
  ok: {
    path: '/actions.ModuleActions/Ok',
    requestStream: false,
    responseStream: false,
    requestType: rpc_actions_pb.Empty,
    responseType: rpc_actions_pb.OkReply,
    requestSerialize: serialize_actions_Empty,
    requestDeserialize: deserialize_actions_Empty,
    responseSerialize: serialize_actions_OkReply,
    responseDeserialize: deserialize_actions_OkReply,
  },
  toggleRunning: {
    path: '/actions.ModuleActions/ToggleRunning',
    requestStream: false,
    responseStream: false,
    requestType: rpc_actions_pb.Empty,
    responseType: rpc_actions_pb.RunningReply,
    requestSerialize: serialize_actions_Empty,
    requestDeserialize: deserialize_actions_Empty,
    responseSerialize: serialize_actions_RunningReply,
    responseDeserialize: deserialize_actions_RunningReply,
  },
};

exports.ModuleActionsClient = grpc.makeGenericClientConstructor(ModuleActionsService);
