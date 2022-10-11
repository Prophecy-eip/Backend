import { AfterLoad, Column, Entity, PrimaryColumn } from "typeorm";
import { Modifier } from "../modifier/modifier.entity";
import { Rule } from "../rule/rule.entity";
import { ParserHelper } from "../../helper/parser.helper";
import { ProphecyDatasource } from "../../database/prophecy.datasource";

@Entity("options")
export class Option {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public type: string;

    @Column()
    public limits: string;

    @Column()
    public cost: string;

    @Column({ name: "modifiers" })
    private modifiersIds: string;

    @Column({ name: "rules" })
    private rulesIds: string;

    public modifiers: Modifier[] = [];
    public rules: Rule[] = [];

    @AfterLoad()
    private async loadEntities() {
        const rulesIds: string[] = ParserHelper.stringToArray(this.rulesIds);
        const modifiersIds: string[] = ParserHelper.stringToArray(this.modifiersIds);
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize()
        for (const id of rulesIds) {
            const r: Rule = await dataSource.getRepository(Rule).findOneBy([{ id: id }]);
            if (r === null)
                continue;
            this.rules.push(r);
        }
        for (const id of modifiersIds) {
            const m: Modifier = await dataSource.getRepository(Modifier).findOneBy([{ id: id }]);
            if (m === null)
                continue;
            this.modifiers.push(m);
        }
        await dataSource.destroy();
    }
}
