import { Entity, PrimaryColumn, Column } from "typeorm";
import { ArmyOrganisation } from "./organisation/army-organisation.entity";
import { ProphecyDatasource } from "@database/prophecy.datasource";
import { MagicItemCategory } from "./magic-item/category/magic-item-category.entity";
import { MagicItem } from "./magic-item/magic-item.entity";
import { MagicStandard } from "./magic-standard/magic-standard.entity";
import { Equipment } from "./equipment/equipment.entity";
import { SpecialRule } from "./special-rule/special-rule.entity";
import { Unit } from "./unit/unit.entity";

@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column({ name: "category_id" })
    public categoryId: number;

    @Column()
    public source: string;

    @Column({ name: "equipment_limits" })
    public equipmentLimits: string;

    @Column({ name: "special_rule_limits" })
    public specialRuleLimits: string;

    @Column({ name: "organisation_ids", type: "int", array: true })
    public organisationIds: number[];

    @Column({ name: "magic_item_category_ids", type: "int", array: true })
    public magicItemCategoryIds: number[];

    @Column({ name: "magic_item_ids", type: "int", array: true })
    public magicItemIds: number[];

    @Column({ name: "magic_standard_ids", type: "int", array: true })
    public magicStandardIds: number[];

    @Column({ name: "equipment_ids", type: "int", array: true })
    public equipmentIds: number[];

    @Column({ name: "rule_ids", type: "int", array: true })
    public ruleIds: number[];

    @Column({ name: "unit_ids", type: "int", array: true })
    public unitIds: number[];

    public organisations: ArmyOrganisation[] = [];
    public magicItemCategories: MagicItemCategory[] = [];
    public magicItems: MagicItem[] = [];
    public magicStandards: MagicStandard[] = [];
    public equipments: Equipment[] = [];
    public specialRules: SpecialRule[] = [];
    public units: Unit[] = [];

    public async load() {
        let datasource: ProphecyDatasource = new ProphecyDatasource();

        await datasource.initialize();
        this.organisations = await Promise.all(this.organisationIds.map(
            async (value: number): Promise<ArmyOrganisation> => await datasource.getRepository(ArmyOrganisation).findOneBy({ id: value })));
        this.magicItemCategories = await Promise.all(this.magicItemCategoryIds.map(
            async (value: number): Promise<MagicItemCategory> => await datasource.getRepository(MagicItemCategory).findOneBy({ id: value })));
        this.magicItems = await Promise.all(this.magicItemIds.map(
            async (value: number): Promise<MagicItem> => await datasource.getRepository(MagicItem).findOneBy({ id: value })));
        this.magicStandards = await Promise.all(this.magicStandardIds.map(
            async (value: number): Promise<MagicStandard> => await datasource.getRepository(MagicStandard).findOneBy({ id: value })));
        this.equipments = await Promise.all(this.equipmentIds.map(
            async (value: number): Promise<Equipment> => await datasource.getRepository(Equipment).findOneBy({ id: value })));
        this.specialRules = await Promise.all(this.equipmentIds.map(
            async (value: number): Promise<SpecialRule> => await datasource.getRepository(SpecialRule).findOneBy({ id: value })));
        this.units = await Promise.all(this.unitIds.map(
            async (value: number): Promise<Unit> => await datasource.getRepository(Unit).findOneBy({ id: value })));
        await datasource.destroy();
    }
}
