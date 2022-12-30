import { ArmyListUnitTroopEquipment } from "./army-list-unit-troop-equipment.entity";

export class ArmyListUnitTroopEquipmentDTO {
    constructor(equipment: ArmyListUnitTroopEquipment) {
        this.troopId = equipment.troopId;
        this.equipmentId = equipment.equipmentId;
    }

    public troopId: number;
    public equipmentId: number;
}
