import * as dotenv from "dotenv";
import { stringify } from "ts-jest";
import { Column, Entity, PrimaryColumn, DataSource } from "typeorm";

dotenv.config()

const DB = process.env.POSTGRES_DB;
const DB_HOST = process.env.DATABASE_IP;
const DB_PORT: number = +process.env.DATABASE_PORT;
const DB_USERNAME = process.env.POSTGRES_USER;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const DB_DIALECT = "postgres";
let IS_TEST: boolean = false;

/**
 * PROPHECY ENTITIES
 */

@Entity("unit_options")
class ProphecyUnitOption {
    @PrimaryColumn({ type: "int" })
    public id: number;

    @Column({ name: "unit_id" })
    public unitId: number;

    @Column({ name: "parent_id" })
    public parentId: number;

    @Column()
    public category: string;

    @Column({ name: "magic_item_factor" })
    public magicItemFactor: number;

    @Column({ name: "army_organisation_activator_id"})
    public armyOrganisationActivatorId: number;

    @Column({ name: "army_organisation_desactivator_id"})
    public armyOrganisationDesactivatorId: number;

    @Column({ name: "use_all_activators" })
    public useAllActivators: boolean;

    @Column({ name: "army_organisation_id" })
    public armyOrganisationId: number;

    @Column({ name: "is_per_model" })
    public isPerModel: boolean;

    @Column({ name: "is_foot_only" })
    public isFootOnly: boolean;

    @Column( { name: "mount_id" })
    public mountId: number;

    @Column({ name: "mount_and_characteristics_points" })
    public mountAdnCharacteristicsPoints: boolean;

    @Column({ name: "organisation_mode" })
    public organisationMode: string;

    @Column({ name: "is_multiple" })
    public isMultiple: boolean;

    @Column({ name: "is_required" })
    public isRequired: boolean;

    @Column({ name: "domain_magic_id" })
    public domainMagicId: number;

    @Column({ name: "magic_item_source"})
    public magicItemSource: string;

    @Column({ name: "organisation_id" })
    public organisationId: number;

    @Column()
    public name: string;

    @Column({ name: "value_points" })
    public valuePoints: number;

    @Column({ name: "use_points"})
    public usePoints: string;

    @Column()
    public max: number;

    @Column({ name: "has_choices" })
    public hasChoices: boolean;

    @Column()
    public weight: number;

    @Column({ name: "change_profile"})
    public changeProfile: boolean;

    @Column()
    public base: string;

    @Column()
    public height: string;

    @Column({ name: "enchantment_limit" })
    public enchantmentLimit: number;

    @Column({ name: "unit_option_limits" })
    public unitOptionLimits: string;

    @Column()
    public availabilities: string;

    @Column({ name: "magic_item_category_ids", type: "int", array: true })
    public magicItemCategoryIds: number[];

    @Column({ name: "equipment_ids", type: "int", array: true })
    public equipmentIds: number[];

    @Column({ name: "unit_option_change_special_rules" })
    public unitOptionChangeSpecialRules: string;

    @Column({ name: "unit_option_change_equipments" })
    public unitOptionChangeEquipments: string;

    @Column({ name: "unit_option_change_profiles"})
    public unitOptionChangeProfiles: string;
}


@Entity("equipment_unit_troops")
class ProphecyEquipmentUnitTroop {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "unit_id" })
    public unitId: number;

    @Column({ name: "troop_id" })
    public troopId: number;

    @Column()
    public info: string;

    @Column({ name: "equipment_id" })
    public equipmentId: number;

    @Column({ name: "type_lvl" })
    public typeLvl: string;

    @Column()
    public name: string;
}


@Entity("special_rule_unit_troops")
class ProphecySpecialRuleUnitTroop {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "unit_id" })
    public unitId: number;

    @Column({ name: "troop_id" })
    public troopId: number;

    @Column()
    public info: string;

    @Column({ name: "special_rule_id" })
    public specialRuleId: number;

    @Column({ name: "type_lvl" })
    public typeLvl: string;

    @Column()
    public name: string;
}


class ProphecyTroopCharacteristics {
    public M: string;
    public WS: string;
    public BS: string;
    public S: string;
    public T: string;
    public W: string;
    public I: string;
    public A: string;
    public LD: string;
    public E: string;
    public type: string;
    public size: number;
    public att: string;
    public of: string;
    public str: string;
    public ap: string;
    public agi: string;
    public type_id: string;
    public type_name: string;
}

@Entity("troops")
export class ProphecyTroop {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({ type: "json" })
    public characteristics: ProphecyTroopCharacteristics;
}

class ProphecyUnitCharacteristic {
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
class ProphecyUnit {
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
    public characteristics: ProphecyUnitCharacteristic;

    @Column({ name: "troop_ids", type: "int", array: true })
    public troopIds: number[];

    @Column({ name: "special_rule_unit_troop_ids", type: "int", array: true })
    public specialRuleUnitTroopIds: number[];

    @Column({ name: "equipment_unit_troop_ids", type: "int", array: true })
    public equipmentUnitTroopIds: number[];

    @Column({ name: "unit_option_ids", type: "int", array: true })
    public unitOptionIds: number[];
}


@Entity("armies")
class ProphecyArmy {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({name: "version_id"})
    public versionId: number;

    @Column({name: "category_id"})
    public categoryId: number;

    @Column()
    public source: string;

    @Column({name: "equipment_limits"})
    public equipmentLimits: string;

    @Column({name: "special_rule_limits"})
    public specialRuleLimits: string;

    @Column({name: "organisation_ids", type: "int", array: true})
    public organisationIds: number[];

    @Column({name: "magic_item_category_ids", type: "int", array: true})
    public magicItemCategoryIds: number[];

    @Column({name: "magic_item_ids", type: "int", array: true})
    public magicItemIds: number[];

    @Column({name: "magic_standard_ids", type: "int", array: true})
    public magicStandardIds: number[];

    @Column({name: "equipment_ids", type: "int", array: true})
    public equipmentIds: number[];

    @Column({name: "rule_ids", type: "int", array: true})
    public ruleIds: number[];

    @Column({name: "unit_ids", type: "int", array: true})
    public unitIds: number[];
}

@Entity("army_organisations")
class ProphecyArmyOrganisation {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "is_default" })
    public isDefault: boolean;

    @Column({ name: "organisation_group_ids", type: "int", array: true})
    public organisationGroupIds: number[];
}

class ProphecyArmyOrganisationGroupLimit {
    id: number;
    army_organisation_group_id: number;
    points_min: number;
    points_max: number;
    target: string;
    value: number;
    repeat_interval: number;
    repeat_value: number;
}

class ProphecyArmyOrganisationUnitLimit {
    public id: number;
    public unit_min: number;
    public unit_max: number;
    public model_max: number;
    public unit_ids: number[];
    public availabilities: number[]
}
@Entity("army_organisation_groups")
class ArmyOrganisationGroup {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "army_organisation_id" })
    public armyOrganisationId: number;

    @Column()
    public name: string;

    @Column({ type: "json", name: "organisation_group_limits", array: true })
    public organisationGroupLimits: ProphecyArmyOrganisationGroupLimit[];

    @Column({ type: "json", name: "organisation_unit_limits", array: true})
    public organisationUnitLimits: ProphecyArmyOrganisationUnitLimit[];

    @Column({ type: "varchar", name: "change_item_limits" })
    public changeItemLimits: string;
}

@Entity("magic_item_categories")
class ProphecyMagicItemCategory {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column()
    public name: string;

    @Column({ name: "is_multiple" })
    public isMultiple: boolean;

    @Column()
    public max: number;
}

@Entity("magic_items")
class ProphecyMagicItem {
    @PrimaryColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "magic_item_category_id" })
    public magicItemCategoryId: number;

    @Column({ name: "is_multiple" })
    public isMultiple: boolean;

    @Column()
    public max: number;

    @Column({ name: "is_dominant" })
    public isDominant: boolean;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column({ name: "value_points"})
    public valuePoints: number;

    @Column({ name: "foot_only" })
    public footOnly: boolean;

    @Column({ name: "disable_magic_path_limit" })
    public disableMagicPathLimit: boolean;

    @Column({ name: "wizard_only", array: true, type: "varchar" })
    public wizardOnly: string[];

    @Column({ name: "required_organisation_ids", type: "int", array: true })
    public requiredOrganisationIds: number[];
}

@Entity("magic_standards")
class ProphecyMagicStandard {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "is_multiple" })
    public isMultiple: boolean;

    @Column()
    public infos: string;

    @Column({ name: "value_points" })
    public valuePoints: number;

    @Column()
    public max: number;

    @Column({ type: "varchar", array: true })
    public availabilities: string[];
}

@Entity("equipments")
class ProphecyEquipment {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id"})
    public versionId: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "type_lvl" })
    public typeLvl: string;

    @Column({ name: "can_be_enchanted"})
    public canBeEnchanted: boolean;

    @Column({ name: "equipment_categories", type: "int", array: true })
    public equipmentCategoriesIds: number[];

}

@Entity("equipment_categories")
class ProphecyEquipmentCategory {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column()
    public name: string;
}

@Entity("special_rules")
class ProphecySpecialRule {
    @PrimaryColumn()
    public id: number;

    @Column({ name: "version_id" })
    public versionId: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column({ name: "type_lvl" })
    public typeLvl: string;
}


//
// class ProphecyArmiesDatasource extends DataSource {
//     constructor() {
//         super({
//             type: DB_DIALECT,
//             host: DB_HOST,
//             port: DB_PORT,
//             username: DB_USERNAME,
//             password: DB_PASSWORD,
//             database: DB,
//             entities: [
//                 ProphecyArmy,
//                 ProphecyArmyOrganisation,
//                 ArmyOrganisationGroup,
//                 ProphecyMagicItemCategory,
//                 ProphecyMagicItem,
//                 ProphecyMagicStandard,
//                 ProphecyEquipment,
//                 ProphecyEquipmentCategory,
//                 ProphecyUnit,
//                 ProphecyUnitOption,
//                 ProphecyTroop,
//                 ProphecySpecialRuleUnitTroop,
//                 ProphecyEquipmentUnitTroop,
//                 ProphecyUnitOption,
//                 ProphecySpecialRule,
//             ],
//         });
//     }
// }

/**
 *
 */

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

class BuilderArmyOrganisationUnitLimit {
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
    army_organisation_unit_limits: BuilderArmyOrganisationUnitLimit[];
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
    mount_and_carac_points: boolean;
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

function logError(error) {
    if (error.message.includes("duplicate key value violates unique constraint")) {
        return;
    }
    console.error(error);
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
        await queryBuilder.insert().into(ProphecyMagicItemCategory).values({
            id: category.id,
            versionId: category.version_id,
            name: category.name,
            isMultiple: category.is_multiple,
            max: category.max,
        }).execute();
    } catch(error) { logError(error); }
}

async function saveEquipmentAndCategories(queryBuilder: any, equipment: BuilderEquipment) {
    let equipmentCategories: number[] = [];
    for (const cat of equipment.equipment_categories) {
        equipmentCategories.push(cat.id);
        try {
            await queryBuilder.insert().into(ProphecyEquipmentCategory).values({
                id: cat.id,
                versionId: cat.version_id,
                name: cat.name,
            }).execute();
        } catch(error) { logError(error); }
    }
    try {
            await queryBuilder.insert().into(ProphecyEquipment).values({
            id: equipment.id,
            versionId: equipment.version_id,
            name: equipment.name,
            description: equipment.description,
            typeLvl: equipment.type_lvl,
            canBeEnchanted: equipment.can_be_enchanted,
            equipmentCategories: equipmentCategories,
        }).execute();
    } catch (error) { logError(error); }
}
async function saveUnit(queryBuilder: any, unit: BuilderUnit) {
    let troops: number[] = [];
    let specialRules: number[] = [];
    let equipments: number[] = [];
    let options: number[] = [];

    for (const troop of unit.troops) {
        troops.push(troop.id);
        try {
            await queryBuilder.insert().into(ProphecyTroop).values({
                id: troop.id,
                name: troop.name,
                characteristics: troop.carac,
            }).execute();
        } catch (error){ logError(error); }
    }
    for (const rule of unit.special_rule_unit_troops) {
        specialRules.push(rule.id);
        try {
            await queryBuilder.insert().into(ProphecySpecialRuleUnitTroop).values({
                id: rule.id,
                unitId: rule.unit_id,
                troopId: rule.troop_id,
                info: rule.info,
                specialRuleId: rule.special_rule_id,
                typeLvl: rule.type_lvl,
                name: rule.name,
            }).execute();
        } catch (error) { logError(error); }
    }
    for (const equipment of unit.equipment_unit_troops) {
        equipments.push(equipment.id);
        try {
            await queryBuilder.insert().into(ProphecyEquipmentUnitTroop).values({
                id: equipment.id,
                unitId: equipment.unit_id,
                troopId: equipment.troop_id,
                info: equipment.info,
                equipmentId: equipment.equipment_id,
                typeLvl: equipment.type_lvl,
                name: equipment.name,
            }).execute();
        } catch (error) { logError(error); }
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
            await queryBuilder.insert().into(ProphecyUnitOption).values({
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
        } catch (error) { logError(error); }
    }
    try {
        await queryBuilder.insert().into(ProphecyUnit).values({
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
            characteristics: unit.carac,
            troopIds: troops,
            specialRuleUnitTroopIds: specialRules,
            equipmentUnitTroopIds: equipments,
            unitOptionIds: options,
        }).execute();
    } catch(error) { logError(error); }
}

async function saveArmy() {
    let dataSource:  DataSource = new DataSource({
            type: DB_DIALECT,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,
            entities: [
                ProphecyArmy,
                ProphecyArmyOrganisation,
                ArmyOrganisationGroup,
                ProphecyMagicItemCategory,
                ProphecyMagicItem,
                ProphecyMagicStandard,
                ProphecyEquipment,
                ProphecyEquipmentCategory,
                ProphecyUnit,
                ProphecyUnitOption,
                ProphecyTroop,
                ProphecySpecialRuleUnitTroop,
                ProphecyEquipmentUnitTroop,
                ProphecyUnitOption,
                ProphecySpecialRule,
            ],
        });

    await dataSource.initialize();
    let queryBuilder = dataSource.createQueryBuilder();
    const credentials: ArmyCredentials[] = await getArmiesCredentials();
    const nbArmies: number = credentials.length;

    console.log(`Retrieving ${nbArmies} armies.`);
    let i: number = 0;
    for (const c of credentials) {
        if (c.source !== "Official")
            continue;
        console.log(`Saving ${c.name}... [${i + 1}/${nbArmies}]`)
        let army: BuilderArmy = await getArmyData(c.id);
        i++;
        try {
            let organisations: number[] = [];
            let magicItemCategories: number[] = [];
            let magicItems: number[] = [];
            let magicStandards: number[] = [];
            let equipments: number[] = [];
            let rules: number[] = [];
            let units: number[] = [];

            for (const organisation of army.army_organisations) {
                organisations.push(organisation.id);
                let groups: number[] = [];
                for (const group of organisation.army_organisation_groups) {
                    groups.push(group.id)
                    try {
                        await queryBuilder.insert().into(ArmyOrganisationGroup).values({
                            id: group.id,
                            armyOrganisationId: group.army_organisation_id,
                            name: group.name,
                            organisationGroupLimits: group.army_organisation_group_limits,
                            organisationUnitLimits: group.army_organisation_unit_limits,
                            changeItemLimits: (group.change_item_limits === undefined ? null : stringify(group.change_item_limits))
                        }).execute();
                    } catch(error) { logError(error); }
                }
                try {
                    await queryBuilder.insert().into(ProphecyArmyOrganisation).values({
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
            }
            for (const item of army.magic_items) {
                magicItems.push(item.id);
                try {
                    await queryBuilder.insert().into(ProphecyMagicItem).values({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        magicItemCategoryId: item.magic_item_category_id,
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
                } catch(error) { logError(error); }
            }
            for (const standard of army.magic_standards) {
                magicStandards.push(standard.id);
                try {
                    await queryBuilder.insert().into(ProphecyMagicStandard).values({
                        id: standard.id,
                        versionId: standard.version_id,
                        name: standard.name,
                        description: standard.description,
                        isMultiple: standard.is_multiple,
                        infos: standard.infos,
                        valuePoints: standard.value_points,
                        max: standard.max,
                        availabilities: standard.availabilities
                    }).execute();
                } catch(error) { logError(error); }
            }
            for (const equipment of army.equipments) {
                equipments.push(equipment.id);
                await saveEquipmentAndCategories(queryBuilder, equipment);
            }
            for (const rule of army.special_rules) {
                rules.push(rule.id);
                try {
                    await queryBuilder.insert().into(ProphecySpecialRule).values({
                        id: rule.id,
                        versionId: rule.version_id,
                        name: rule.name,
                        description: rule.description,
                        typeLvl: rule.type_lvl,
                    }).execute();
                } catch(error) { logError(error); }
            }
            for (const unit of army.units) {
                units.push(unit.id);
                await saveUnit(queryBuilder, unit);
            }
            try {
                await queryBuilder.insert().into(ProphecyArmy).values({
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
            } catch(error) { logError(error); }
        } catch(error) {
            console.error(error);
        }
        console.log("  Done!")
        if (IS_TEST) {
            return;
        }
    }
    await dataSource.destroy();
}

function main() {
    if (process.argv.length > 2 && process.argv[2] === "--test") {
        IS_TEST = true;
        console.log("Filling database for test, only one army will be retrieved.");
    }
    saveArmy().then(() => { console.log("Armies were saved successfully !")});
}

main()
