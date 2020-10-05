export abstract class Module {
  successor: Module;
  fuel: number;

  protected constructor(fuel: number) {
    this.fuel = fuel;
  }

  public numberOfStages(): number{
    if(this.successor){
      return 1+this.successor.numberOfStages();
    } else {
      return 1;
    }
  }

  public detachLastModule(): void{
    if(this.successor){
      if(this.successor.successor){
        this.successor.detachLastModule();
      } else {
        this.successor = null;
      }
    } else {
      //TODO: throw exception: cannot detach module because there is none
    }
  }

  public getLastModule(): Module{
    if(this.successor){
      return this.successor.getLastModule();
    } else {
      return this;
    }
  }

  public removeFuel(amount: number): void{
    this.fuel -= amount;
    if(this.fuel < 0)
      this.fuel = 0;
  }
}
