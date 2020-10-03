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
}
