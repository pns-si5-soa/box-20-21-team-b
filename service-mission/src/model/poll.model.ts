export class Poll{
    isPolling: boolean
    rocketId: number
    weatherOk: boolean
    rocketOk: boolean

    constructor(rocketId: number) {
        this.isPolling = false;
        this.rocketId = rocketId
        this.weatherOk = false
        this.rocketOk = false
    }

}
