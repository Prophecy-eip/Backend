import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArmyListUnitTroopEquipment } from "./army-list-unit-troop-equipment.entity";
import { Repository } from "typeorm";
import { randomUUID } from "crypto";

@Injectable()
export class ArmyListUnitTroopEquipmentService {
    constructor(
        @InjectRepository(ArmyListUnitTroopEquipment)
        private repository: Repository<ArmyListUnitTroopEquipment>
    ) {}

    async create(armyListUnitId: string, troopId: number, equipmentId: number): Promise<ArmyListUnitTroopEquipment> {
        const id: string = randomUUID();

        return this.repository.create({ id,  armyListUnitId, troopId, equipmentId });
    }

    async save(equipment: ArmyListUnitTroopEquipment): Promise<ArmyListUnitTroopEquipment> {
        return this.repository.save(equipment);
    }
}
