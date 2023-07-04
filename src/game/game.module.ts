import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "@app/game/game.entity";
import { GameService } from "@app/game/game.service";
import { GameController } from "@app/game/game.controller";
import { ArmyList } from "@army-list/army-list.entity";
import { ArmyListService } from "@army-list/army-list.service";
import { Profile } from "@profile/profile.entity";
import { ProfileService } from "@profile/profile.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Game,
            ArmyList,
            Profile
        ])
    ],
    providers: [
        GameService,
        ArmyListService,
        ProfileService
    ],
    exports: [
        GameService,
        ArmyListService,
        ProfileService
    ],
    controllers: [GameController]
})

export class GameModule {}
