import { Module } from './module';

export class Rocket {
  id: number
  modules: Module[]

  constructor(id: number) {
    this.id = id;
    this.modules = []
  }

  addModule(module: Module): void{
    this.modules.push(module)
  }

  getModuleWithId(id: number){
    for (const module of this.modules) {
      if(module.id == id)
        return module;
    }
    return null;
  }
}
