import { Module } from "@nestjs/common";

import { HeartbeatController } from "./heartbeat.controller";

/**
 * @class HeartbeatModule
 * @brief Module that defines the requirements for heartbeat
 */
@Module({
    imports: [],
    providers: [],
    exports: [],
    controllers: [HeartbeatController]
})
export class HeartbeatModule {}
