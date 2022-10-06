import { Injectable } from "@nestjs/common";
import {Repository} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Army } from "./army.entity";

@Injectable()
export class ArmyService {
    constructor(
        @InjectRepository(Army)
        private repository: Repository<Army>
    ) {}

    async getAll() : Promise<Army[]>{
        let query = this.repository
            .createQueryBuilder("armies")
            .select("armies");
        return await query.getMany();
    }
}

