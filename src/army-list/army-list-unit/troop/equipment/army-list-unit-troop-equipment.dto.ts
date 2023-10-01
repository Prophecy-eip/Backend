import { ArmyListUnitTroopEquipment } from "./army-list-unit-troop-equipment.entity";
import { IsDefined, IsNumber } from "class-validator";

export class ArmyListUnitTroopEquipmentDTO {
    public static fromArmyListUnitTroopEquipment(equipment: ArmyListUnitTroopEquipment): ArmyListUnitTroopEquipmentDTO {
        return {
            troopId: equipment.troopId,
            equipmentId: equipment.equipment.id
        };
    }

    @IsDefined()
    @IsNumber()
    public troopId: number;

    @IsDefined()
    @IsNumber()
    public equipmentId: number;
}
