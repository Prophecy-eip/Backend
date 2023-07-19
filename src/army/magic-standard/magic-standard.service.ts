import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MagicStandard } from "@army/magic-standard/magic-standard.entity";

@Injectable()
class MagicStandardService {

    constructor(
        @InjectRepository(MagicStandard)
        private repository: Repository<MagicStandard>
    ) {}

    async findOneById(id: number): Promise<MagicStandard> {
        return this.repository.findOneBy([{ id: id }]);
    }
}

export default MagicStandardService;
