import { ProphecyDatasource } from "../../src/database/prophecy.datasource";
import { Army } from "../../src/army/army.entity";
import { ArmyOrganisation } from "../../src/army/organisation/army-organisation.entity";
import { ArmyOrganisationGroup } from "../../src/army/organisation/group/army-organisation-group.entity";
import { stringify } from "ts-jest";
import { MagicItemCategory } from "../../src/army/magic-item/category/magic-item-category.entity";
import { MagicItem } from "../../src/army/magic-item/magic-item.entity";
import { MagicStandard } from "../../src/army/magic-standard/magic-standard.entity";
import { Equipment } from "../../src/army/equipment/equipment.entity";
import { EquipmentCategory } from "../../src/army/equipment/category/equipment-category.entity";
import { SpecialRule } from "../../src/army/special-rule/special-rule.entity";
import { SelectQueryBuilder } from "typeorm";
import { Unit } from "../../src/army/unit/unit.entity";
import { Troop } from "../../src/army/unit/troop/troop.entity";
import { SpecialRuleUnitTroop } from "../../src/army/unit/troop/special-rule/special-rule-unit-troop.entity";
import { EquipmentUnitTroop } from "../../src/army/unit/troop/equipment/equipment-unit-troop.entity";
import { UnitOption } from "../../src/army/unit/option/unit-option.entity";
import any = jasmine.any;

class ArmyCredentials {
    id: number;
    name: string;
    version_id: number;
    source: string;
    is_disabled: boolean;
    initials: string;
    updated_at: number;
    medium_logo: string;
    large_logo: string;
}

class BuilderOrganisation {
    id: number;
    name: string;
    position: number;
    medium_logo: string;

    public async save(queryBuilder: any) {

    }
}

class BuilderArmyOrganisationGroupLimit {
    id: number;
    army_organisation_group_id: number;
    points_min: number;
    points_max: number;
    target: string;
    value: number;
    repeat_interval: number;
    repeat_value: number;
}

class ArmyOrganisationUnitLimit {
    id: number;
    unit_min: number;
    unit_max: number;
    model_max: number;
    unit_ids: number[];
    availabilities: number[]
}
class BuilderArmyOrganisationGroup {
    id: number;
    /**
     * Id of the ArmyOrganisation parent object
     */
    army_organisation_id: number;
    /**
     * Id of the organisation category
     */
    organisation_id: number; // unused
    name: string;
    position: number; // unused
    medium_logo: string; // unused
    army_organisation_group_limits: BuilderArmyOrganisationGroupLimit[];
    army_organisation_unit_limits: ArmyOrganisationUnitLimit[];
    change_item_limits: any[]

    public async save(queryBuilder: any) {
        // try {
        //     await queryBuilder.insert().into(ArmyOrganisationGroup).values({
        //         id: this.id,
        //         armyOrganisationId: this.army_organisation_id,
        //         name: this.name,
        //         organisationGroupLimits: (this.army_organisation_group_limits === undefined ? null : stringify(this.army_organisation_group_limits)),
        //         organisationUnitLimits: (this.army_organisation_unit_limits === undefined ? null : stringify(this.army_organisation_unit_limits)),
        //         changeItemLimits: (this.change_item_limits === undefined ? null : stringify(this.change_item_limits))
        //     }).execute();
        // } catch(error) { /* todo: duplicate */ }
    }
}

class BuilderArmyOrganisation {
    id: number;
    name: string;
    description: string;
    is_default: boolean;
    army_organisation_groups: BuilderArmyOrganisationGroup[];

    public async save(queryBuilder: any) {
        // let groups: number[] = [];
        // for (const group of this.army_organisation_groups) {
        //     groups.push(group.id)
        //     await group.save(queryBuilder)
        // }
        // try {
        //     await queryBuilder.insert().into(ArmyOrganisation).values({
        //         id: this.id,
        //         name: this.name,
        //         description: this.description,
        //         isDefault: this.is_default,
        //         organisationGroupIds: groups,
        //     }).execute();
        // } catch(error) {}
    }
}

class BuilderMagicItemCategory {
    id: number;
    version_id: number;
    name: string;
    is_multiple: boolean;
    max: number;

    public async save(queryBuilder: any) {
        try {
            await queryBuilder.insert().into(MagicItemCategory).values({
                id: this.id,
                versionId: this.version_id,
                name: this.name,
                isMultiple: this.is_multiple,
                max: this.max,
            }).execute();
        } catch(error) {
            // todo: duplicate
        }
    }
}

class BuilderEquipmentCategory {
    id: number;
    version_id: number;
    name: string;

    public async save(queryBuilder: any) {
        try {
            await queryBuilder.insert().into(EquipmentCategory).values({
                id: this.id,
                versionId: this.version_id,
                name: this.name,
                // armyId: army.id,
            }).execute();
        } catch(error) {}
    }
}

class MagicItemAvailability {
    id: number;
    unit_type_id: number;
    unit_id: number;
    unit_option_id: number;
    size: string;
    special_rule_id: number;
    action: string; // todo: check possible values
}
class BuilderMagicItem {
    id: number;
    name: string;
    description: string;
    magic_item_category_id: number;
    army_id: number;
    is_multiple: boolean;
    max: number;
    is_dominant: boolean;
    version_id: number;
    value_points: number;
    only_foot: false;
    disable_magic_path_limit: false;
    only_wizard: string[]
    required_organisation_ids: number[];
    equipment_categories: BuilderEquipmentCategory[];
    availabilities: MagicItemAvailability[];

    public async save(queryBuilder: any) {
        try {
            await queryBuilder.insert().into(MagicItem).values({
                id: this.id,
                name: this.name,
                description: this.description,
                magicItemCategoryId: this.magic_item_category_id,
                // armyId: army.id,
                isMultiple: this.is_multiple,
                max: this.max,
                isDominant: this.is_dominant,
                versionId: this.version_id,
                valuePoints: this.value_points,
                footOnly: this.only_foot,
                disableMagicPathLimit: this.disable_magic_path_limit,
                wizardOnly: this.only_wizard,
                requiredOrganisationIds: this.required_organisation_ids
            }).execute();
        } catch(error) {}
    }
}

class BuilderMagicStandard {
    id: number;
    version_id: number;
    army_id: number;
    name: string;
    description: string;
    is_multiple: boolean;
    infos: string;
    value_points: number;
    max: number;
    availabilities: any[] // todo: check type

    public async save(queryBuilder: any) {
        try {
            await queryBuilder.insert().into(MagicStandard).values({
                id: this.id,
                versionId: this.version_id,
                // armyId: army.id,
                name: this.name,
                description: this.description,
                isMultiple: this.is_multiple,
                infos: this.infos,
                valuePoints: this.value_points,
                max: this.max,
                availabilities: this.availabilities
            }).execute();
        } catch(error) {}
    }
}

class BuilderEquipment {
    id: number;
    army_id: string;
    version_id: number;
    name: string;
    description: string;
    type_lvl: string;
    can_be_enchanted: boolean;
    equipment_categories: BuilderEquipmentCategory[];

    public async save(queryBuilder: any) {
        let categories: number[] = [];
        for (const cat of this.equipment_categories) {
            categories.push(cat.id);
            await cat.save(queryBuilder);
        }
        try {
            await queryBuilder.insert().into(Equipment).values({
                id: this.id,
                // armyId: army.id,
                versionId: this.version_id,
                name: this.name,
                description: this.description,
                typeLvl: this.type_lvl,
                canBeEnchanted: this.can_be_enchanted,
                equipmentCategories: categories,
            }).execute();
        } catch (error) {}
    }
}

class BuilderSpecialRule {
    id: number;
    army_id: number;
    version_id: number;
    name: string;
    description: string;
    type_lvl: string;

    public async save(queryBuilder: any) {
        try {
            await queryBuilder.insert().into(SpecialRule).values({
                id: this.id,
                // armyId: army.id,
                versionId: this.version_id,
                name: this.name,
                description: this.description,
                typeLvl: this.type_lvl,
            }).execute();
        } catch(error) {}
    }
}

class UnitCarac {
    type: string;
    base: string;
    height: string;
    unit_type_id: number;
    adv: string;
    mar: string;
    dis: string;
    evoked: string;
    hp: string;
    def: string;
    res: string;
    arm: string;
    aeg: string;
}

class UnitType {
    id: number;
    name: string;
}

class BuilderTroopCarac {
    M: string;
    WS: string;
    BS: string;
    S: string;
    T: string;
    W: string;
    I: string;
    A: string;
    LD: string;
    E: string;
    type: string;
    size: number;
    att: string;
    of: string;
    str: string;
    ap: string;
    agi: string;
    type_id: string;
    type_name: string;
}

class BuilderTroop {
    id: number;
    unit_id: number;
    name: string;
    position: number;
    carac: BuilderTroopCarac[]
}

class BuilderSpecialRuleUnitTroop {
    id: number;
    unit_id: number;
    troop_id: number;
    info: string;
    special_rule_id: number;
    type_lvl: string;
    name: string;
}

class BuilderEquipmentUnitTroop {
    id: number;
    unit_id: number;
    troop_id: number;
    info: string;
    equipment_id: number;
    type_lvl: string;
    name: string;
}

class BuilderUnitOptionLimits {
    id: number;
    limit: string;
    min: number;
    max: number;
    key: string;
    selector_model: string;
    isModel: boolean;
    isModelByUnit: boolean;
    isItemByArmy: boolean;
}

class BuilderUnitOption {
    id: number;
    unit_id: number;
    parent_id: number;
    position: number;
    category: string;
    magic_item_factor: number;
    army_organisation_activator_id: number;
    army_organisation_desactivator_id: number;
    hide_not_activated: boolean;
    is_default_in_list: boolean;
    use_all_activators: boolean;
    use_all_desactivator: boolean;
    army_organisation_id: number;
    is_per_model: boolean;
    is_only_foot: boolean;
    mount_id: number;
    mount_and_carac_points: boolean; ////////////////////////
    organisation_mode: string;
    is_multiple: boolean;
    is_required: boolean;
    domain_magic_id: number;
    magic_item_source: string;
    organisation_id: number;
    name: string;
    value_points: number;
    use_points: string;
    max: number; // todo: check type
    has_choices: boolean; // todo: check type
    weight: number;
    change_profil: boolean;
    base: string;
    height: string;
    enchantment_limit: number;
    unit_option_limits: BuilderUnitOptionLimits[];
    availabilities: any[]; // todo: check type
    modifiers: any[]; // todo: check type
    magic_item_categories: BuilderMagicItemCategory[];
    unit_option_change_special_rules: any[]; // todo: check type
    unit_option_change_equipments: any[]; // todo: check type
    unit_option_change_profils: any[]; // todo: check type
    equipments: BuilderEquipment[];
}

class BuilderUnit {
    id: number;
    name: string;
    is_desabled: boolean; // unused
    army_id: number;
    unit_category_id: number;
    principal_organisation_id: number;
    min_size: number;
    max_size: number;
    can_be_general_and_bsb: boolean;
    position: number;
    magic: any; // TODO: check type
    notes: any; // todo: check type
    is_mount: boolean;
    type_figurine: number;
    unit_type_id: number;
    army_organisation_id: number;
    army_organisation_activator_id: number;
    value_points: number;
    add_value_points: number;
    carac: UnitCarac;
    unit_type: UnitType;
    organisation_ids: number[];
    all_organisation_ids: number[];
    troops: BuilderTroop[];
    special_rule_unit_troops: BuilderSpecialRuleUnitTroop[];
    equipment_unit_troops: BuilderEquipmentUnitTroop[];
    unit_options: BuilderUnitOption[];
    organisation_changes: any[]; // todo: check type
}

class BuilderEquipmentLimit {
    id: number;
    limit: string;
    min: number;
    max: number;
    key: string;
    equipment_id: number;
    isItemByArmy: boolean;

}

class BuilderSpecialRuleLimit {
    id: number;
    limit: string;
    min: number;
    max: number;
    key: string;
    special_rule_id: number;
    isItemByArmy: boolean;
}

class BuilderArmy {
    constructor(json: BuilderArmy) {
        for (const key of Object.keys(json)) {
            this[key] = json[key];
        }
    }
    id: number;
    name: string;
    version_id: number;
    /**
     * Official or not
     */
    source: string; // unused
    is_disabled: boolean; // unused
    initials: string; // unused
    updated_at: number; // unused
    medium_logo: string; // unused
    large_logo: string; // unused
    /**
     * BuilderArmy id common to all versions
     */
    category_id: number;
    organisations: BuilderOrganisation[];
    army_organisations: BuilderArmyOrganisation[];
    magic_item_categories: BuilderMagicItemCategory[];
    magic_items: BuilderMagicItem[];
    magic_standards: BuilderMagicStandard[];
    equipments: BuilderEquipment[];
    equipment_limits: BuilderEquipmentLimit[]
    special_rules: BuilderSpecialRule[];
    special_rule_limits: BuilderSpecialRuleLimit[];
    units: BuilderUnit[];
}

async function getArmiesCredentials(): Promise<ArmyCredentials[]> {
    return fetch("https://9thbuilder.com/en/api/v1/ninth_age/armies.json")
        .then(res => res.json())
        .then(res => {
            return res as ArmyCredentials[];
    });
}

async function getArmyData(id): Promise<BuilderArmy> {
    return await fetch(`https://9thbuilder.com/en/api/v1/ninth_age/armies/${id}.json`)
        .then(res => res.json())
        .then(res => {
            return res as BuilderArmy;
    });
}

async function saveMagicItemCategory(queryBuilder: any, category: BuilderMagicItemCategory) {
    try {
        await queryBuilder.insert().into(MagicItemCategory).values({
            id: category.id,
            versionId: category.version_id,
            name: category.name,
            isMultiple: category.is_multiple,
            max: category.max,
        }).execute();
    } catch(error) {}
}

async function saveEquipmentAndCategories(queryBuilder: any, equipment: BuilderEquipment) {
    let equipmentCategories: number[] = [];
    for (const cat of equipment.equipment_categories) {
        equipmentCategories.push(cat.id);
        // await cat.save(queryBuilder);
        try {
            await queryBuilder.insert().into(EquipmentCategory).values({
                id: cat.id,
                versionId: cat.version_id,
                name: cat.name,
                // armyId: army.id,
            }).execute();
        } catch(error) {}
    }
    try {
        await queryBuilder.insert().into(Equipment).values({
            id: equipment.id,
            // armyId: army.id,
            versionId: equipment.version_id,
            name: equipment.name,
            description: equipment.description,
            typeLvl: equipment.type_lvl,
            canBeEnchanted: equipment.can_be_enchanted,
            equipmentCategories: equipmentCategories,
        }).execute();
    } catch (error) {}
}
async function saveUnit(queryBuilder: any, unit: BuilderUnit) {
    let troops: number[] = [];
    let specialRules: number[] = [];
    let equipments: number[] = [];
    let options: number[] = [];

    for (const troop of unit.troops) {
        troops.push(troop.id);
        try {
            await queryBuilder.insert().into(Troop).values({
                id: troop.id,
                name: troop.name,
                characteristics: stringify(troop.carac),
            }).execute();
        } catch (error){}
    }
    for (const rule of unit.special_rule_unit_troops) {
        specialRules.push(rule.id);
        try {
            await queryBuilder.insert().into(SpecialRuleUnitTroop).values({
                id: rule.id,
                unitId: rule.unit_id,
                troopId: rule.troop_id,
                info: rule.info,
                specialRuleId: rule.special_rule_id,
                typeLvl: rule.type_lvl,
                name: rule.name,
            }).execute();
        } catch (error) { console.log(error) }
    }
    for (const equipment of unit.equipment_unit_troops) {
        equipments.push(equipment.id);
        try {
            await queryBuilder.insert().into(EquipmentUnitTroop).values({
                id: equipment.id,
                unitId: equipment.unit_id,
                troopId: equipment.troop_id,
                info: equipment.info,
                equipmentId: equipment.equipment_id,
                typeLvl: equipment.type_lvl,
                name: equipment.name,
            }).execute();
        } catch (error) { console.log(error) }
    }
    for (const option of unit.unit_options) {
        options.push(option.id);
        let magicItemCategories: number[] = [];
        let equipments: number[] = [];
        for (const category of option.magic_item_categories) {
            magicItemCategories.push(category.id);
            await saveMagicItemCategory(queryBuilder, category);
        }
        for (const equipment of option.equipments) {
            equipments.push(equipment.id);
            await saveEquipmentAndCategories(queryBuilder, equipment)
        }
        try {
            await queryBuilder.insert().into(UnitOption).values({
                id: option.id,
                unitId: option.unit_id,
                parentId: option.parent_id,
                category: option.category,
                magicItemFactor: option.magic_item_factor,
                armyOrganisationActivatorId: option.army_organisation_activator_id,
                armyOrganisationDesactivatorId: option.army_organisation_desactivator_id,
                useAllActivators: option.use_all_activators,
                armyOrganisationId: option.army_organisation_id,
                isPerModel: option.is_per_model,
                isFootOnly: option.is_only_foot,
                mountId: option.mount_id,
                mountAdnCharacteristicsPoints: option.mount_and_carac_points,
                organisationMode: option.organisation_mode,
                isMultiple: option.is_multiple,
                isRequired: option.is_required,
                domainMagicId: option.domain_magic_id,
                magicItemSource: option.magic_item_source,
                organisationId: option.organisation_id,
                name: option.name,
                valuePoints: option.value_points,
                usePoints: option.use_points,
                max: option.max,
                hasChoices: option.has_choices,
                weight: option.weight,
                changeProfile: option.change_profil,
                base: option.base,
                height: option.height,
                enchantmentLimit: stringify(option.enchantment_limit),
                unitOptionLimit: stringify(option.unit_option_limits),
                availabilities: stringify(option.availabilities),
                magicItemCategoryIds: magicItemCategories,
                equipmentIds: equipments,
                unitOptionChangeSpecialRules: stringify(option.unit_option_change_equipments),
                unitOptionChangeEquipments: stringify(option.unit_option_change_equipments),
                unitOptionChangeProfiles: stringify(option.unit_option_change_profils),
            }).execute();
        } catch (error) { console.error(error) }
    }
    try {
        await queryBuilder.insert().into(Unit).values({
            id: unit.id,
            name: unit.name,
            unitCategoryId: unit.unit_category_id,
            principalOrganisationId: unit.principal_organisation_id,
            minSize: unit.min_size,
            maxSize: unit.max_size,
            canBeGeneralAndBsb: unit.can_be_general_and_bsb,
            position: unit.position,
            magic: unit.magic,
            notes: unit.notes,
            isMount: unit.is_mount,
            unitTypeId: unit.unit_type_id,
            armyOrganisationId: unit.army_organisation_id,
            valuePoints: unit.value_points,
            characteristics: stringify(unit.carac),
            troopIds: troops,
            specialRuleUnitTroopIds: specialRules,
            equipmentUnitTroopIds: equipments,
            unitOptionIds: options,
        }).execute();
    } catch(error) {}
}

async function saveArmy() {
    let dataSource = new ProphecyDatasource();

    await dataSource.initialize();
    let queryBuilder = dataSource.createQueryBuilder();

    const credentials: ArmyCredentials[] = await getArmiesCredentials();
    for (const c of credentials) {
        if (c.source !== "Official")
            continue;
        console.log(`Saving ${c.name}...`)
        let army: BuilderArmy = await getArmyData(c.id);
        // console.log(army);
        // await    army.save(queryBuilder);
        try {
            let organisations: number[] = [];
            let magicItemCategories: number[] = [];
            let magicItems: number[] = [];
            let magicStandards: number[] = [];
            let equipments: number[] = [];
            let rules: number[] = [];
            let units: number[] = [];

            // console.log(this.army_organisations);
            for (const organisation of army.army_organisations) {
                organisations.push(organisation.id);
                // await organisation.save(queryBuilder);
                let groups: number[] = [];
                for (const group of organisation.army_organisation_groups) {
                    groups.push(group.id)
                    // await group.save(queryBuilder)
                    try {
                        await queryBuilder.insert().into(ArmyOrganisationGroup).values({
                            id: group.id,
                            armyOrganisationId: group.army_organisation_id,
                            name: group.name,
                            organisationGroupLimits: (group.army_organisation_group_limits === undefined ? null : stringify(group.army_organisation_group_limits)),
                            organisationUnitLimits: (group.army_organisation_unit_limits === undefined ? null : stringify(group.army_organisation_unit_limits)),
                            changeItemLimits: (group.change_item_limits === undefined ? null : stringify(group.change_item_limits))
                        }).execute();
                    } catch(error) { /* todo: duplicate */ }
                }
                try {
                    await queryBuilder.insert().into(ArmyOrganisation).values({
                        id: organisation.id,
                        name: organisation.name,
                        description: organisation.description,
                        isDefault: organisation.is_default,
                        organisationGroupIds: groups,
                    }).execute();
                } catch(error) {}
            }
            for (const cat of army.magic_item_categories) {
                magicItemCategories.push(cat.id);
                await saveMagicItemCategory(queryBuilder, cat);
                // await cat.save(queryBuilder);
                // try {
                //     await queryBuilder.insert().into(MagicItemCategory).values({
                //         id: cat.id,
                //         versionId: cat.version_id,
                //         name: cat.name,
                //         isMultiple: cat.is_multiple,
                //         max: cat.max,
                //     }).execute();
                // } catch(error) {}
            }
            for (const item of army.magic_items) {
                magicItems.push(item.id);
                // await item.save(queryBuilder);
                try {
                    await queryBuilder.insert().into(MagicItem).values({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        magicItemCategoryId: item.magic_item_category_id,
                        // armyId: army.id,
                        isMultiple: item.is_multiple,
                        max: item.max,
                        isDominant: item.is_dominant,
                        versionId: item.version_id,
                        valuePoints: item.value_points,
                        footOnly: item.only_foot,
                        disableMagicPathLimit: item.disable_magic_path_limit,
                        wizardOnly: item.only_wizard,
                        requiredOrganisationIds: item.required_organisation_ids
                    }).execute();
                } catch(error) {}
            }
            for (const standard of army.magic_standards) {
                magicStandards.push(standard.id);
                try {
                    await queryBuilder.insert().into(MagicStandard).values({
                        id: standard.id,
                        versionId: standard.version_id,
                        // armyId: army.id,
                        name: standard.name,
                        description: standard.description,
                        isMultiple: standard.is_multiple,
                        infos: standard.infos,
                        valuePoints: standard.value_points,
                        max: standard.max,
                        availabilities: standard.availabilities
                    }).execute();
                } catch(error) {}
            }
            for (const equipment of army.equipments) {
                equipments.push(equipment.id);
                // await equipment.save(queryBuilder);
                // let equipmentCategories: number[] = [];
                // for (const cat of equipment.equipment_categories) {
                //     equipmentCategories.push(cat.id);
                //     // await cat.save(queryBuilder);
                //     try {
                //         await queryBuilder.insert().into(EquipmentCategory).values({
                //             id: cat.id,
                //             versionId: cat.version_id,
                //             name: cat.name,
                //             // armyId: army.id,
                //         }).execute();
                //     } catch(error) {}
                // }
                // try {
                //     await queryBuilder.insert().into(Equipment).values({
                //         id: equipment.id,
                //         // armyId: army.id,
                //         versionId: equipment.version_id,
                //         name: equipment.name,
                //         description: equipment.description,
                //         typeLvl: equipment.type_lvl,
                //         canBeEnchanted: equipment.can_be_enchanted,
                //         equipmentCategories: equipmentCategories,
                //     }).execute();
                // } catch (error) {}
                await saveEquipmentAndCategories(queryBuilder, equipment);
            }
            for (const rule of army.special_rules) {
                rules.push(rule.id);
                // await rule.save(queryBuilder);
                try {
                    await queryBuilder.insert().into(SpecialRule).values({
                        id: rule.id,
                        // armyId: army.id,
                        versionId: rule.version_id,
                        name: rule.name,
                        description: rule.description,
                        typeLvl: rule.type_lvl,
                    }).execute();
                } catch(error) {}
            }
            for (const unit of army.units) {
                units.push(unit.id);
                // await unit.save(queryBuilder);
                await saveUnit(queryBuilder, unit);
            }
            try {
                await queryBuilder.insert().into(Army).values({
                    id: army.id,
                    name: army.name,
                    versionId: army.version_id,
                    categoryId: army.category_id,
                    source: army.source,
                    equipmentLimits: stringify(army.equipment_limits),
                    specialRuleLimits: stringify(army.special_rule_limits),
                    organisationIds: organisations,
                    magicItemCategoryIds: magicItemCategories,
                    magicItemIds: magicItems,
                    magicStandardIds: magicStandards,
                    equipmentIds: equipments,
                    ruleIds: rules,
                    unitIds: units,
                }).execute();
            } catch(error) {}
        } catch(error) {
            console.error(error);
        }
        console.log("Done!\n")
    }

    await dataSource.destroy();
}

function main() {
    saveArmy().then(() => { console.log("Armies were saved successfully !")});
}

main()