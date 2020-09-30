import { Injectable, HttpService } from '@nestjs/common';
import {ROCKET_HOST, ROCKET_PORT} from "./env_variables";
import {Observable} from "rxjs";

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {
  }

  initRocketConnection(): Observable<any> {
    return this.httpService.get('http://' + ROCKET_HOST + ':' + ROCKET_PORT + '/rocket/connect-telemetry');
  }
}
