import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MagicItem } from "@army/magic-item/magic-item.entity";

@Injectable()
class MagicItemService {

    constructor(
        @InjectRepository(MagicItem)
        private repository: Repository<MagicItem>
    ) {}

    async findOneById(id: number): Promise<MagicItem> {
        return this.repository.findOneBy([{ id: id }]);
    }
}

export default MagicItemService;
