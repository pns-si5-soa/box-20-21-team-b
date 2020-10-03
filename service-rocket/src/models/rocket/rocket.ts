import { HeadModule } from './headModule';
import { Module } from './module';

export class Rocket {
  head: HeadModule;
  altitude: number;
  numberInitialStages: number

  constructor() {
    this.altitude = 0;
    this.numberInitialStages = 0;
  }

  setNumberInitialStages(): void{
    this.numberInitialStages = this.numberOfStages();
  }

  numberOfStages(): number{
    return this.head.numberOfStages();
  }

  detachPayload(): void{
    this.head.detachPayload();
  }

  detachLastModule(): void{
    this.head.detachLastModule();
    // TODO: catch exception
  }

  removeFuel(amount: number): void{
    this.head.getLastModule().removeFuel(amount);
  }

  getFuelAtLastModule(): number{
    return this.head.getLastModule().fuel;
  }

  setHeadModule(module: HeadModule): void{
    this.head = module;
  }

  addModule(module: Module): void{
    this.head.getLastModule().successor = module;
  }
}