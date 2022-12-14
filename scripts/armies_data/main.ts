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

class Organisation {
    id: number;
    name: string;
    position: number;
    medium_logo: string;
}

class ArmyOrganisationGroupLimit {
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
class ArmyOrganisationGroup {
    id: number;
    army_organisation_id: number;
    organisation_id: number;
    name: string;
    position: number;
    medium_logo: string;
    army_organisation_group_limits: ArmyOrganisationGroupLimit[];
    army_organisation_unit_limits: ArmyOrganisationUnitLimit[];
    change_item_limits: any[]
}

class ArmyOrganisation {
    is: number;
    name: string;
    description: string;
    is_default: boolean;
    army_organisation_groups: ArmyOrganisationGroup[];
}

class MagicItemCategory {
    id: number;
    version_id: number;
    name: string;
    is_multiple: boolean;
    max: number;
}

class EquipmentCategory {
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
    action: string;
}
class MagicItem {
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
    equipment_categories: EquipmentCategory[];
    availabilities: MagicItemAvailability[];
}

class MagicStandard {
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

class Equipment {
    id: number;
    army_id: string;
    version_id: number;
    name: string;
    description: string;
    type_lvl: string;
    can_be_enchanted: boolean;
    equipment_categories: EquipmentCategory[];
}

class SpecialRule {
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
    unit_option_limits: UnitOptionLimits[];
    availabilities: any[]; // todo: check type
    modifiers: any[]; // todo: check type
    magic_item_categories: MagicItemCategory[]; // todo: check type
    unit_option_change_special_rules: any[]; // todo: check type
    unit_option_change_equipments: any[]; // todo: check type
    unit_option_change_profils: any[]; // todo: check type
    equipments: Equipment[];
}

class Unit {
    id: number;
    name: string;
    is_desabled: boolean;
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

class Army {
    id: number;
    name: string;
    version_id: string;
    source: string;
    is_disabled: boolean;
    initials: string;
    updated_at: number;
    medium_logo: string;
    large_logo: string;
    /**
     * Army id common to all versions
     */
    category_id: string;
    organisations: Organisation[];
    army_organisations: ArmyOrganisation[];
    magic_item_categories: MagicItemCategory[];
    magic_items: MagicItem[];
    magic_standards: MagicStandard;
    equipments: Equipment[];
    equipment_limits: any[] // todo: check type
    special_rules: SpecialRule[];
    special_rule_limits: any[] // todo: check type
    units: Unit[];

}

async function getArmiesCredentials(): Promise<ArmyCredentials[]> {
    return fetch("https://9thbuilder.com/en/api/v1/ninth_age/armies.json")
        .then(res => res.json())
        .then(res => {
            return res as ArmyCredentials[];
    });
}

async function getArmyData(id): Promise<Army> {
    return await fetch(`https://9thbuilder.com/en/api/v1/ninth_age/armies/${id}.json`)
        .then(res => res.json())
        .then(res => {
            return res as Army;
    });
}

function main() {
    getArmiesCredentials().then(credentials => {
        for (const c of credentials) {
            console.log(`Retrieving: ${c.name}...`)
            getArmyData(c.id).then(data => {

            });
        }
     })
}

main()