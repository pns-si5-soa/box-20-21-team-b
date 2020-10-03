import { Module } from './module';
import { Payload } from '../payload';

export class HeadModule extends Module{
  payload: Payload;

  constructor(fuel: number, payload: Payload) {
    super(fuel);
    this.payload = payload;
  }

  public detachPayload(){
    this.payload = null;
  }
}