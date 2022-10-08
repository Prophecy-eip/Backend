import {AfterLoad, Column, Entity, PrimaryColumn} from "typeorm";
import {ParserHelper} from "../../helper/parser.helper";

@Entity("units")
export class Unit {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({type: "varchar"})
    public army: string;

    @Column({type: "varchar"})
    public category: string;

    @Column()
    public cost: string;

    @Column()
    public options: string;

    @Column({type: "varchar", name: "profiles"})
    public profiles: string;

    public optionsIds: string[];

    public profileIds: string[];

    @AfterLoad()
    private loadIds() {
        this.optionsIds = ParserHelper.stringToArray(this.options);
        this.profileIds = ParserHelper.stringToArray(this.profiles);
    }

}
