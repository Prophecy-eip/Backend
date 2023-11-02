import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EquipmentUnitTroop } from "@army/unit/troop/equipment/equipment-unit-troop.entity";

@Injectable()
class EquipmentUnitTroopService {

    constructor(
        @InjectRepository(EquipmentUnitTroop)
        private repository: Repository<EquipmentUnitTroop>
    ) {}

    async findOneById(id: number): Promise<EquipmentUnitTroop> {
        return this.repository.findOneBy([{ id: id }]);
    }

    async findByIds(ids: number[]): Promise<EquipmentUnitTroop[]> {
        return Promise.all(ids.map(async (id: number): Promise<EquipmentUnitTroop> => this.repository.findOneBy([{ id: id }])));
    }
}

export default EquipmentUnitTroopService;
