import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { JoinColumn } from "typeorm";

import { ProphecyDatasource } from "../database/prophecy.datasource";
import { ArmyListUpgrade } from "./army-list-upgrade/army-list-upgrade.entity";
import { ArmyListRule } from "./army-list-rule/army-list-rule.entity";

@Entity("army_lists")
export class ArmyList {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column({ type: "varchar" })
    @JoinColumn({ name: "profiles", referencedColumnName: "id" })
    public owner: string;


    @Column({ type: "varchar" })
    @JoinColumn({ name: "armies", referencedColumnName: "id"})
    public army: string;

    @Column()
    public cost: string;

    @Column({ name: "is_shared" })
    public isShared: boolean;

    public upgrades: string[] = [];
    public rules: string[] = [];

    public async load() {
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize();
        const upgrades: ArmyListUpgrade[] = await dataSource.getRepository(ArmyListUpgrade).findBy([{ list: this.id }]);
        const rules: ArmyListRule[] = await dataSource.getRepository(ArmyListRule).findBy([{ list: this.id }]);

        for (const upgrade of upgrades) {
            this.upgrades.push(upgrade.upgrade);
        }
        for (const rule of rules) {
            this.rules.push(rule.rule);
        }
        await dataSource.destroy();
    }
}
