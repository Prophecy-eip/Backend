import { AfterLoad, Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

import { ProphecyDatasource } from "@database/prophecy.datasource";
import { ArmyListUnitMagicItem } from "./magic-item/army-list-unit-magic-item.entity";
import { ArmyListUnitMagicStandard } from "./magic-standard/army-list-unit-magic-standard.entity";
import { ArmyListUnitOption } from "./option/army-list-unit-option.entity";
import { Troop } from "@army/unit/troop/troop.entity";
import { ArmyListUnitTroopSpecialRule } from "./troop/special-rule/army-list-unit-troop-special-rule.entity";
import { ArmyListUnitTroopEquipment } from "./troop/equipment/army-list-unit-troop-equipment.entity";
import { Unit } from "@army/unit/unit.entity";

@Entity("army_list_units")
export class ArmyListUnit {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ type: "int", name: "unit_id" })
    @JoinColumn({ name: "units", referencedColumnName: "id" })
    public unitId: number;

    @Column({ type: "int" })
    public quantity: number;

    @Column({ type: "varchar" })
    public formation: string;

    @Column({ name: "army_list_id", type: "varchar" })
    public armyListId: string;

    @Column({ name: "troop_ids", type: "int", array: true })
    public troopIds: number[];

    public unit: Unit;
    public magicItems: ArmyListUnitMagicItem[] = [];
    public magicStandards: ArmyListUnitMagicStandard[] = [];
    public options: ArmyListUnitOption[] = [];
    public troops: Troop[] = [];
    public specialRuleTroops: ArmyListUnitTroopSpecialRule[] = [];
    public equipmentTroops: ArmyListUnitTroopEquipment[] = [];

    @AfterLoad()
    public async load() {
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize();
        this.unit = await dataSource.getRepository(Unit).findOneBy({ id: this.unitId });
        for (const id of this.troopIds) {
            this.troops.push(await dataSource.getRepository(Troop).findOneBy({ id: id }));
        }
        this.magicItems = await dataSource.getRepository(ArmyListUnitMagicItem).findBy({ armyListUnitId: this.id });
        this.options = await dataSource.getRepository(ArmyListUnitOption).findBy({ armyListUnitId: this.id });
        this.magicStandards = await dataSource.getRepository(ArmyListUnitMagicStandard).findBy({ armyListUnitId: this.id });
        this.specialRuleTroops = await dataSource.getRepository(ArmyListUnitTroopSpecialRule).findBy({ armyListUnitId: this.id });
        this.equipmentTroops = await dataSource.getRepository(ArmyListUnitTroopEquipment).findBy({ armyListUnitId: this.id });
        await dataSource.destroy();
    }
}
