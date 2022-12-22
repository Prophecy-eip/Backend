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
}

class BuilderArmyOrganisation {
    id: number;
    name: string;
    description: string;
    is_default: boolean;
    army_organisation_groups: BuilderArmyOrganisationGroup[];
}

class BuilderMagicItemCategory {
    id: number;
    version_id: number;
    name: string;
    is_multiple: boolean;
    max: number;
}

class BuilderEquipmentCategory {
    id: number;
    version_id: number;
    name: string;
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
}

class BuilderSpecialRule {
    id: number;
    army_id: number;
    version_id: number;
    name: string;
    description: string;
    type_lvl: string;
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

class TroopCarac {
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

class Troop {
    id: number;
    unit_id: number;
    name: string;
    position: number;
    carac: TroopCarac[]
}

class SpecialRuleUnitTroop {
    id: number;
    unit_id: number;
    troop_id: number;
    info: string;
    special_rule_id: number;
    type_lvl: string;
    name: string;
}

class EquipmentUnitTroop {
    id: number;
    unit_id: number;
    troop_id: number;
    info: string;
    equipment_id: number;
    type_lvl: string;
    name: string;
}

class UnitOptionLimits {
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

class UnitOption {
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
    unit_option_limits: UnitOptionLimits[];
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
    troops: Troop[];
    special_rule_unit_troops: SpecialRuleUnitTroop[];
    equipment_unit_troops: EquipmentUnitTroop[];
    unit_options: UnitOption[];
    organisation_changes: any[]; // todo: check type

}

class BuilderArmy {
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
    equipment_limits: any[] // todo: check type
    special_rules: BuilderSpecialRule[];
    special_rule_limits: any[] // todo: check type
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

async function save() {
    let dataSource = new ProphecyDatasource();

    await dataSource.initialize();
    let queryBuilder = dataSource.createQueryBuilder();

    const credentials: ArmyCredentials[] = await getArmiesCredentials();
    for (const c of credentials) {
        if (c.source !== "Official")
            continue;
        console.log(`Saving ${c.name}...`)
        const army: BuilderArmy = await getArmyData(c.id);
        // console.log(army.magic_item_categories);
        try {
            await queryBuilder.insert().into(Army).values({
                id: army.id,
                name: army.name,
                versionId: army.version_id,
                categoryId: army.category_id,
                source: army.source
            }).execute();
            for (const organisation of army.army_organisations) {
                await queryBuilder.insert().into(ArmyOrganisation).values({
                    id: organisation.id,
                    name: organisation.name,
                    description: organisation.description,
                    isDefault: organisation.is_default,
                    armyId: army.id
                }).execute();
                for (const group of organisation.army_organisation_groups) {
                    await queryBuilder.insert().into(ArmyOrganisationGroup).values({
                        id: group.id,
                        armyOrganisationId: group.army_organisation_id,
                        name: group.name,
                        organisationGroupLimits: (group.army_organisation_group_limits === undefined ? null : stringify(group.army_organisation_group_limits)),
                        organisationUnitLimits: (group.army_organisation_unit_limits === undefined ? null : stringify(group.army_organisation_unit_limits)),
                        changeItemLimits: (group.change_item_limits === undefined ? null : stringify(group.change_item_limits))
                    }).execute();
                }
            }
            for (const category of army.magic_item_categories) {
                try {
                    await queryBuilder.insert().into(MagicItemCategory).values({
                        id: category.id,
                        versionId: category.version_id,
                        name: category.name,
                        isMultiple: category.is_multiple,
                        max: category.max,
                        armyId: army.id
                    }).execute();
                } catch(error) {
                    // todo: duplicate
                }
            }
            for (const item of army.magic_items) {
                try {
                    await queryBuilder.insert().into(MagicItem).values({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        magicItemCategoryId: item.magic_item_category_id,
                        armyId: army.id,
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
                } catch(error) {
                    // todo: duplicate
                }
            }
            for (const standard of army.magic_standards) {
                try {
                    await queryBuilder.insert().into(MagicStandard).values({
                        id: standard.id,
                        versionId: standard.version_id,
                        armyId: army.id,
                        name: standard.name,
                        description: standard.description,
                        isMultiple: standard.is_multiple,
                        infos: standard.infos,
                        valuePoints: standard.value_points,
                        max: standard.max,
                        availabilities: standard.availabilities
                    }).execute();
                } catch(error) {
                    // todo: duplicate
                }
            }
            for (const equipment of army.equipments) {
                let categories: number[] = [];
                for (const cat of equipment.equipment_categories) {
                    try {
                        await queryBuilder.insert().into(EquipmentCategory).values({
                            id: cat.id,
                            versionId: cat.version_id,
                            name: cat.name,
                            armyId: army.id,
                        }).execute();
                    } catch(error) {}
                    categories.push(cat.id);
                }
                try {
                    await queryBuilder.insert().into(Equipment).values({
                        id: equipment.id,
                        armyId: army.id,
                        versionId: equipment.version_id,
                        name: equipment.name,
                        description: equipment.description,
                        typeLvl: equipment.type_lvl,
                        canBeEnchanted: equipment.can_be_enchanted,
                        equipmentCategories: categories,
                    }).execute();
                } catch (error) {
                    // todo: duplicate (mainly)
                }
            }
        } catch(error) {
            console.error(error);
        }

        console.log("Done!\n")
    }

    await dataSource.destroy();
}

function main() {
    save().then(() => { console.log("Done !")});
}

main()