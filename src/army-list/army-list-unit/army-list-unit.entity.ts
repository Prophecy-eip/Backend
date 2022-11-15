import { AfterLoad, Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProphecyDatasource } from "../../database/prophecy.datasource";
import { ArmyListUnitOption } from "./army-list-unit-option/army-list-unit-option.entity";
import { ArmyListUnitUpgrade } from "./army-list-unit-upgrade/army-list-unit-upgrade.entity";

@Entity("army_list_units")
export class ArmyListUnit {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "units", referencedColumnName: "id" })
    public unit: string

    @Column({ type: "int" })
    public number: number;

    @Column({ type: "varchar" })
    public formation: string;

    @Column({ name: "army_list", type: "varchar" })
    public armyList: string;

    public options: string[] = [];
    public upgrades: string[] = [];

    @AfterLoad()
    private async load() {
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize();
        const opt: ArmyListUnitOption[] = await dataSource.getRepository(ArmyListUnitOption).findBy({ unit: this.id });
        const upg: ArmyListUnitUpgrade[] = await dataSource.getRepository(ArmyListUnitUpgrade).findBy({ unit: this.id });

        for (const o of opt) {
            this.options.push(o.option);
        }
        for (const u of upg) {
            this.upgrades.push(u.upgrade);
        }
        await dataSource.destroy();
    }
}
