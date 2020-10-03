abstract class Module {
  successor: Module;

  numberOfStages(): number{
    if(this.successor){
      return 1+this.successor.numberOfStages();
    } else {
      return 1;
    }
  }

  detachLastModule(): void{
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
}
