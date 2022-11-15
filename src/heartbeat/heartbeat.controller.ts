import { Controller, HttpCode, Get, HttpStatus } from "@nestjs/common";

@Controller("/heartbeat")
export class HeartbeatController {

    @HttpCode(HttpStatus.OK)
    @Get("")
    async heartbeat() {}
}
