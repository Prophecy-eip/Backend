import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

import { ProphecyDatasource } from "@database/prophecy.datasource";
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

    @Column({ name: "troop_ids", type: "int", array: true })
    public troopIds: number[];

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

    // TODO: many to many
    public troops: Troop[] = [];

    @OneToMany(() => ArmyListUnitTroopSpecialRule, (rule: ArmyListUnitTroopSpecialRule) => rule.armyListUnit)
    public specialRuleTroops: ArmyListUnitTroopSpecialRule[];

    @OneToMany(() => ArmyListUnitTroopEquipment, (equipment: ArmyListUnitTroopEquipment) => equipment.armyListUnit)
    public equipmentTroops: ArmyListUnitTroopEquipment[];

    @AfterLoad()
    public async load() {
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize();
        for (const id of this.troopIds) {
            this.troops.push(await dataSource.getRepository(Troop).findOneBy({ id: id }));
        }
        await dataSource.destroy();
    }
}
