import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArmyListUnitTroopEquipment } from "./army-list-unit-troop-equipment.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";
import { ArmyListUnit } from "@army-list/army-list-unit/army-list-unit.entity";
import {
    ArmyListUnitTroopEquipmentDTO
} from "@army-list/army-list-unit/troop/equipment/army-list-unit-troop-equipment.dto";

@Injectable()
export class ArmyListUnitTroopEquipmentService {
    constructor(
        @InjectRepository(ArmyListUnitTroopEquipment)
        private repository: Repository<ArmyListUnitTroopEquipment>
    ) {}

    async create(armyListUnit: ArmyListUnit, equipment: ArmyListUnitTroopEquipmentDTO): Promise<ArmyListUnitTroopEquipment> {
        const id: string = randomUUID();

        return this.repository.create({
            id,
            armyListUnit,
            troopId: equipment.troopId,
            equipmentId: equipment.equipmentId
        });
    }

    async save(equipment: ArmyListUnitTroopEquipment): Promise<ArmyListUnitTroopEquipment> {
        return this.repository.save(equipment);
    }
}
