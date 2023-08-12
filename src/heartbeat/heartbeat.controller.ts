import { Controller, HttpCode, Get, HttpStatus } from "@nestjs/common";

/**
 * @class HeartbeatController
 * @brief Controller that defines the heartbeat route
 */
@Controller("/heartbeat")
export class HeartbeatController {

    /**
     * @brief Returns 200 (OK) if the server is up
     */
    @HttpCode(HttpStatus.OK)
    @Get("")
    async heartbeat() {}
}
