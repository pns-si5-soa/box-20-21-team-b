import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {

    getStatus(): string {
        return 'Rocket is ready to take off !';
    }

    requestLaunch() {
        return "Sayounarada roketto-san";
    }
}
