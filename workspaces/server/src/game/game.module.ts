import { Module } from '@nestjs/common';
import { GameGateway } from '@server/game/game.gateway';

@Module({
    providers: [
        GameGateway,
    ],
})
export class GameModule {}