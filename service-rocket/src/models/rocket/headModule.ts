class HeadModule extends Module{
  fuel: number;
  payload: Payload;

  detachPayload(){
    this.payload = null;
  }
}
