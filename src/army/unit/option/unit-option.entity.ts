import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("unit_options")
export class UnitOption {
    @PrimaryColumn()
    public id: string;

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
