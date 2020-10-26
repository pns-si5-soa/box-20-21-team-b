// package: actions
// file: actions.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Empty extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Empty.AsObject;
    static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Empty;
    static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
    export type AsObject = {
    }
}

export class Boolean extends jspb.Message { 
    getVal(): boolean;
    setVal(value: boolean): Boolean;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Boolean.AsObject;
    static toObject(includeInstance: boolean, msg: Boolean): Boolean.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Boolean, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Boolean;
    static deserializeBinaryFromReader(message: Boolean, reader: jspb.BinaryReader): Boolean;
}

export namespace Boolean {
    export type AsObject = {
        val: boolean,
    }
}

export class BoomReply extends jspb.Message { 
    getContent(): string;
    setContent(value: string): BoomReply;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BoomReply.AsObject;
    static toObject(includeInstance: boolean, msg: BoomReply): BoomReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BoomReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BoomReply;
    static deserializeBinaryFromReader(message: BoomReply, reader: jspb.BinaryReader): BoomReply;
}

export namespace BoomReply {
    export type AsObject = {
        content: string,
    }
}

export class SetThrustersSpeedReply extends jspb.Message { 
    getContent(): string;
    setContent(value: string): SetThrustersSpeedReply;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetThrustersSpeedReply.AsObject;
    static toObject(includeInstance: boolean, msg: SetThrustersSpeedReply): SetThrustersSpeedReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetThrustersSpeedReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetThrustersSpeedReply;
    static deserializeBinaryFromReader(message: SetThrustersSpeedReply, reader: jspb.BinaryReader): SetThrustersSpeedReply;
}

export namespace SetThrustersSpeedReply {
    export type AsObject = {
        content: string,
    }
}

export class Double extends jspb.Message { 
    getVal(): number;
    setVal(value: number): Double;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Double.AsObject;
    static toObject(includeInstance: boolean, msg: Double): Double.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Double, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Double;
    static deserializeBinaryFromReader(message: Double, reader: jspb.BinaryReader): Double;
}

export namespace Double {
    export type AsObject = {
        val: number,
    }
}

export class OkReply extends jspb.Message { 
    getContent(): string;
    setContent(value: string): OkReply;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OkReply.AsObject;
    static toObject(includeInstance: boolean, msg: OkReply): OkReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OkReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OkReply;
    static deserializeBinaryFromReader(message: OkReply, reader: jspb.BinaryReader): OkReply;
}

export namespace OkReply {
    export type AsObject = {
        content: string,
    }
}

export class RunningReply extends jspb.Message { 
    getContent(): string;
    setContent(value: string): RunningReply;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RunningReply.AsObject;
    static toObject(includeInstance: boolean, msg: RunningReply): RunningReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RunningReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RunningReply;
    static deserializeBinaryFromReader(message: RunningReply, reader: jspb.BinaryReader): RunningReply;
}

export namespace RunningReply {
    export type AsObject = {
        content: string,
    }
}

export class SetAltitudeToDetachReply extends jspb.Message { 
    getContent(): string;
    setContent(value: string): SetAltitudeToDetachReply;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetAltitudeToDetachReply.AsObject;
    static toObject(includeInstance: boolean, msg: SetAltitudeToDetachReply): SetAltitudeToDetachReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetAltitudeToDetachReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetAltitudeToDetachReply;
    static deserializeBinaryFromReader(message: SetAltitudeToDetachReply, reader: jspb.BinaryReader): SetAltitudeToDetachReply;
}

export namespace SetAltitudeToDetachReply {
    export type AsObject = {
        content: string,
    }
}
