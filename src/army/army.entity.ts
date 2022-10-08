import {AfterLoad, Column, DataSource, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryColumn} from "typeorm"
import {Unit} from "./unit/unit.entity";
import {Rule} from "./rule/rule.entity";
import {ParserHelper} from "../helper/parser.helper";
import {ProphecyDatasource} from "../database/prophecy.datasource";
import {UnitCategory} from "./unit/unit-category/unit-category.entity";
import {UpgradeCategory} from "./upgrade/upgrade-category/upgrade-category.entity";
import {Upgrade} from "./upgrade/upgrade.entity";
import {SpecialItemCategory} from "./special-item/special-item-category/special-item-category.entity";
import {SpecialItem} from "./special-item/special-item.entity";

@Entity("armies")
export class Army {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ name: "unit_categories" })
    private unitCategoriesIds: string;

    @Column({ name: "rules" })
    private rulesIds: string;

    @Column({ name: "upgrade_categories" })
    private upgradeCategoriesIds: string;

    @Column({ name: "special_item_categories" })
    public specialItemCategoriesIds: string;

    @Column({ type: "varchar", name: "units" })
    private unitsIds: string;

    @Column({ name: "upgrades" })
    private upgradeIds: string;

    @Column({ name: "items" })
    private itemsIds: string;

    public unitCategories: UnitCategory[] = [];
    public units: Unit[] = [];
    public rules: Rule[] = [];
    public upgradeCategories: UpgradeCategory[] = [];
    public upgrades: Upgrade[] = [];
    public specialItemCategories: SpecialItemCategory[] = [];
    public specialItems: SpecialItem[] = []

    @AfterLoad()
    private async loadEntities() {
        let dataSource: ProphecyDatasource = new ProphecyDatasource()
        const unitCategoriesIds: string[] = ParserHelper.stringToArray(this.unitCategoriesIds);
        const unitsIds: string[] = ParserHelper.stringToArray(this.unitsIds);
        const rulesIds: string[] = ParserHelper.stringToArray(this.rulesIds);
        const upgradeCategoriesIds: string[] = ParserHelper.stringToArray(this.upgradeCategoriesIds);
        const upgradesIds: string[] = ParserHelper.stringToArray(this.upgradeIds);
        const specialItemCategoriesIds: string[] = ParserHelper.stringToArray(this.specialItemCategoriesIds);
        const specialItemsIds: string[] = ParserHelper.stringToArray(this.itemsIds);

        await dataSource.initialize();
        for (const id of unitCategoriesIds)
            this.unitCategories.push(await dataSource.getRepository(UnitCategory).findOneBy([{ id: id }]));
        for (const id of unitsIds)
            this.units.push(await dataSource.getRepository(Unit).findOneBy([ { id: id }]));
        for (const id of rulesIds)
            this.rules.push(await dataSource.getRepository(Rule).findOneBy([{ id: id }]));
        for (const id of upgradeCategoriesIds)
            this.upgradeCategories.push(await dataSource.getRepository(UpgradeCategory).findOneBy([{ id: id }]));
        for (const id of upgradesIds)
            this.upgrades.push(await dataSource.getRepository(Upgrade).findOneBy([{ id: id }]));
        for (const id of specialItemCategoriesIds)
            this.specialItemCategories.push(await dataSource.getRepository(SpecialItemCategory).findOneBy([{ id: id}]));
        for (const id of specialItemsIds)
            this.specialItems.push(await dataSource.getRepository(SpecialItem).findOneBy([{ id: id }]));
    }
}
