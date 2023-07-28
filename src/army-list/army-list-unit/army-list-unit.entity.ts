import {
    Column,
    Entity,
    JoinColumn, ManyToMany,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    JoinTable
} from "typeorm";

import { ArmyListUnitMagicItem } from "./magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitMagicStandard } from "./magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "./option/army-list-unit-option.entity";
import { Troop } from "@army/unit/troop/troop.entity";
import { ArmyListUnitTroopSpecialRule } from "./troop/special-rule/army-list-unit-troop-special-rule.entity";
import { ArmyListUnitTroopEquipment } from "./troop/equipment/army-list-unit-troop-equipment.entity";
import { Unit } from "@army/unit/unit.entity";
import { ArmyList } from "@army-list/army-list.entity";

@Entity("army_list_units")
export class ArmyListUnit {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ type: "int" })
    public quantity: number;

    @Column({ type: "varchar" })
    public formation: string;

    @ManyToOne(() => ArmyList, (armyList: ArmyList) => armyList.units)
    @JoinColumn({ name: "army_list_id" })
    public armyList: ArmyList;

    @ManyToOne(() => Unit)
    @JoinColumn({ name: "unit_id" })
    public unit: Unit;

    @OneToMany(() => ArmyListUnitMagicItem, (item: ArmyListUnitMagicItem) => item.armyListUnit)
    public magicItems: ArmyListUnitMagicItem[];

    @OneToMany(() => ArmyListUnitMagicStandard, (standard: ArmyListUnitMagicStandard) => standard.armyListUnit)
    public magicStandards: ArmyListUnitMagicStandard[];

    @OneToMany(() => ArmyListUnitOption, (option: ArmyListUnitOption) => option.armyListUnit)
    public options: ArmyListUnitOption[];

    @ManyToMany(() => Troop)
    @JoinTable({
        name: "army_list_units_troops",
        joinColumn: {
            name: "army_list_unit_id",
            referencedColumnName: "id"
        }, inverseJoinColumn: {
            name: "troop_id",
            referencedColumnName: "id"
        }
    })
    public troops: Troop[];

    @OneToMany(() => ArmyListUnitTroopSpecialRule, (rule: ArmyListUnitTroopSpecialRule) => rule.armyListUnit)
    public specialRuleTroops: ArmyListUnitTroopSpecialRule[];

    @OneToMany(() => ArmyListUnitTroopEquipment, (equipment: ArmyListUnitTroopEquipment) => equipment.armyListUnit)
    public equipmentTroops: ArmyListUnitTroopEquipment[];
}
