class Rocket {
  head: HeadModule;

  numberOfStages(): number{
    return this.head.numberOfStages();
  }

  detachLastModule(): void{
    this.head.detachLastModule();
    // TODO: catch exception
  }
}
