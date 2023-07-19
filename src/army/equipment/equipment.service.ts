import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Equipment } from "@army/equipment/equipment.entity";

@Injectable()
class EquipmentService {

    constructor(
        @InjectRepository(Equipment)
        private repository: Repository<Equipment>
    ) {}

    async findOneById(id: number): Promise<Equipment> {
        return this.repository.findOneBy([{ id: id }]);
    }
}

export default EquipmentService;
