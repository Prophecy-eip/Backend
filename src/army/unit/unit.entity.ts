import { Entity, PrimaryColumn, Column, AfterLoad } from "typeorm";

import { Troop } from "./troop/troop.entity";
import { SpecialRuleUnitTroop } from "./troop/special-rule/special-rule-unit-troop.entity";
import { EquipmentUnitTroop } from "./troop/equipment/equipment-unit-troop.entity";
import { UnitOption } from "./option/unit-option.entity";
// import { ProphecyDatasource } from "@database/prophecy.datasource";

export class UnitCharacteristic {
    public type: string;
    public base: string;
    public height: string;
    public unitTypeId: string;
    public adv: string;
    public mar: string;
    public dis: string;
    public evoked: string;
    public hp: string;
    public def: string;
    public res: string;
    public arm: string;
    public aeg: string;
}

@Entity("units")
export class Unit {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({ name: "unit_category_id" })
    public unitCategoryId: number;

    @Column({ name: "principal_organisation_id" })
    public principalOrganisationId: number;

    @Column({ name: "min_size" })
    public minSize: number;

    @Column({ name: "max_size" })
    public maxSize: number;

    @Column({ name: "can_be_general_and_bsb" })
    public canBeGeneralAndBsb: boolean;

    @Column()
    public position: number;

    @Column()
    public magic: string; // todo: check type

    @Column()
    public notes: string; // todo: check type

    @Column({ name: "is_mount" })
    public isMount: boolean;

    @Column({ name: "unit_type_id" })
    public unitTypeId: number;

    @Column({ name: "army_organisation_id" })
    public armyOrganisationId: number;

    @Column({ name: "value_points" })
    public valuePoints: number;

    @Column({ name: "add_value_points" })
    public addValuePoints: number;

    @Column({ type: "json" })
    public characteristics: UnitCharacteristic;

    @Column({ name: "troop_ids", type: "int", array: true })
    public troopIds: number[];

    @Column({ name: "special_rule_unit_troop_ids", type: "int", array: true })
    public specialRuleUnitTroopIds: number[];

    @Column({ name: "equipment_unit_troop_ids", type: "int", array: true })
    public equipmentUnitTroopIds: number[];

    @Column({ name: "unit_option_ids", type: "int", array: true })
    public unitOptionIds: number[];

    public troops: Troop[] = [];
    public specialRuleUnitTroops: SpecialRuleUnitTroop[] = [];
    public equipmentUnitTroops: EquipmentUnitTroop[] = [];
    public unitOptions: UnitOption[] = [];

    @AfterLoad()
    private async load() {
        // let datasource: ProphecyDatasource = new ProphecyDatasource();
        //
        // await datasource.initialize();
        // for (const id of this.troopIds)
        //     this.troops.push(await datasource.getRepository(Troop).findOneBy({ id: id }));
        // for (const id of this.specialRuleUnitTroopIds)
        //     this.specialRuleUnitTroops.push(await datasource.getRepository(SpecialRuleUnitTroop).findOneBy({ id: id }));
        // for (const id of this.equipmentUnitTroopIds)
        //     this.equipmentUnitTroops.push(await datasource.getRepository(EquipmentUnitTroop).findOneBy({ id: id }));
        // for (const id of this.unitOptionIds)
        //     this.unitOptions.push(await datasource.getRepository(UnitOption).findOneBy({ id: id }));
        // await datasource.destroy();
    }
}
