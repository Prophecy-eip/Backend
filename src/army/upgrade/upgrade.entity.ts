import {AfterLoad, Column, Entity, PrimaryColumn} from "typeorm";
import {Modifier} from "../modifier/modifier.entity";
import {UnitProfile} from "../unit/unit-profile/unit-profile.entity";
import {Rule} from "../rule/rule.entity";
import {ParserHelper} from "../../helper/parser.helper";
import {ProphecyDatasource} from "../../database/prophecy.datasource";
import {Profile} from "../../account/profile/profile.entity";

@Entity("upgrades")
export class Upgrade {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({name: "is_collective"})
    public isCollective: string;

    @Column()
    public limits: string;

    @Column()
    public cost: string;

    @Column({ name: "modifiers" })
    private modifiersIds: string;

    @Column({ name: "profiles" })
    private profilesIds: string;

    @Column({ name: "rules" })
    private rulesIds: string;

    public modifiers: Modifier[] = [];
    public profiles: UnitProfile[] = [];
    public rules: Rule[] = []

    @AfterLoad()
    private async loadEntities() {
        const modifiersIds: string[] = ParserHelper.stringToArray(this.modifiersIds);
        const profilesIds: string[] = ParserHelper.stringToArray(this.profilesIds);
        const rulesIds: string[] = ParserHelper.stringToArray(this.rulesIds);
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize();
        for (let id of modifiersIds) {
            const m: Modifier = await dataSource.getRepository(Modifier).findOneBy({id: id});
            if (m === null)
                continue;
            this.modifiers.push(m)
        }
        for (let id of profilesIds) {
            const p: UnitProfile = await dataSource.getRepository(UnitProfile).findOneBy({id: id});
            if (p === null)
                continue
            this.profiles.push(p);
        }
        for (let id of rulesIds) {
            const r: Rule = await dataSource.getRepository(Rule).findOneBy({id: id});
            if (r === null)
                continue;
            this.rules.push(r);
        }
    }
}
