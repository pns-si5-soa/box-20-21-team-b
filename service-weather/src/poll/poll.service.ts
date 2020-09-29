import {HttpService, Injectable} from '@nestjs/common';
import {Observable} from "rxjs";
import {MISSION_HOST, MISSION_PORT} from "../env_variables";

@Injectable()
export class PollService {
    constructor(private httpService: HttpService) {
    }

    sendAnswerToMission(go: boolean): Observable<any> {
        return this.httpService.post('http://' + MISSION_HOST + ':' + MISSION_PORT + '/poll/weather', {ready: go});
    }
}
