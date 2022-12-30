import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Army } from "./army.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArmyService {
    constructor(
        @InjectRepository(Army)
        private repository: Repository<Army>,
    ) {}

    async getAll(): Promise<Army[]> {
        let query = this.repository
            .createQueryBuilder("armies")
            .select("armies");

        return await query.getMany();
    }

    async findOneById(id: number): Promise<Army> {
        return await this.repository.findOneBy([{ id: id }]);
    }
}
