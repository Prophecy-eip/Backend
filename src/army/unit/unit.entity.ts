import { AfterLoad, Column, Entity, PrimaryColumn } from "typeorm";

import { ParserHelper } from "../../helper/parser.helper";
import { Option } from "../option/option.entity";
import { UnitProfile } from "./unit-profile/unit-profile.entity";
import { ProphecyDatasource } from "../../database/prophecy.datasource";

@Entity("units")
export class Unit {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ type: "varchar" })
    public category: string;

    @Column()
    public cost: string;

    @Column({ name: "options" })
    private optionsIds: string;

    @Column({type: "varchar", name: "profiles"})
    private profilesIds: string;

    public options: Option[] = []
    public profiles: UnitProfile[] = []

    @AfterLoad()
    private async loadEntities() {
        const optionsIds: string[] = ParserHelper.stringToArray(this.optionsIds);
        const profilesIds: string[] = ParserHelper.stringToArray(this.profilesIds);
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize();
        for (const id of optionsIds) {
            const o: Option = await dataSource.getRepository(Option).findOneBy([{ id: id }]);
            if (o === null)
                continue;
            this.options.push(o)
        }
        for (const id of profilesIds) {
            const p: UnitProfile = await dataSource.getRepository(UnitProfile).findOneBy([{ id: id }]);
            if (p === null)
                continue;
            this.profiles.push(p);
        }
        await dataSource.destroy();
    }
}
