import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Troop } from "@army/unit/troop/troop.entity";
import { Repository } from "typeorm";

@Injectable()
export class TroopService {
    constructor(
        @InjectRepository(Troop)
        private readonly repository: Repository<Troop>
    ) {}

    public async findByIds(ids: number[]): Promise<Troop[]> {
        return Promise.all(ids.map(async (id: number): Promise<Troop> => this.repository.findOneBy([{ id: id }])));
    }
}
