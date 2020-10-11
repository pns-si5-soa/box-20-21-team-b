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

    hasVal(): boolean;
    clearVal(): void;
    getVal(): boolean | undefined;
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
        val?: boolean,
    }
}

export class BoomReply extends jspb.Message { 

    hasContent(): boolean;
    clearContent(): void;
    getContent(): string | undefined;
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
        content?: string,
    }
}

export class Double extends jspb.Message { 

    hasVal(): boolean;
    clearVal(): void;
    getVal(): number | undefined;
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
        val?: number,
    }
}
