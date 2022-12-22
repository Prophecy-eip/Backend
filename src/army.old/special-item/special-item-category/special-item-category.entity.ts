import { AfterLoad, Column, Entity, PrimaryColumn } from "typeorm";
import { Upgrade } from "../../upgrade/upgrade.entity";
import { ParserHelper } from "../../../helper/parser.helper";
import { ProphecyDatasource } from "../../../database/prophecy.datasource";

@Entity("special_item_categories")
export class SpecialItemCategory {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({name: "is_collective"})
    public isCollective: boolean;

    @Column()
    public limits: string;

    @Column({ name: "items" })
    private itemsIds: string;

    public items: Upgrade[] = [];

    @AfterLoad()
    private async loadEntities() {
        const itemsIds: string[] = ParserHelper.stringToArray(this.itemsIds);
        let dataSource: ProphecyDatasource = new ProphecyDatasource();

        await dataSource.initialize();
        for (const id of itemsIds) {
            const i: Upgrade = await dataSource.getRepository(Upgrade).findOneBy([{ id: id }]);
            if (i === null)
                continue;
            this.items.push(i);
        }
        await dataSource.destroy();
    }
}
