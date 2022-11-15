import { Module } from "@nestjs/common";

import { HeartbeatController } from "./heartbeat.controller";

@Module({
    imports: [],
    providers: [],
    exports: [],
    controllers: [HeartbeatController]
})
export class HeartbeatModule {}
