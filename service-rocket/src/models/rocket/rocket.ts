import { HeadModule } from './headModule';
import { Module } from './module';

export class Rocket {
  head: HeadModule;

  numberOfStages(): number{
    return this.head.numberOfStages();
  }

  detachLastModule(): void{
    this.head.detachLastModule();
    // TODO: catch exception
  }

  removeFuel(amount: number): void{
    this.head.getLastModule().removeFuel(amount);
  }

  addModule(module: Module): void{
    this.head.getLastModule().successor = module;
  }
}
