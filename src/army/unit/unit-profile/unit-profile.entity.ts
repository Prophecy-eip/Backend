import {AfterLoad, Column, Entity, ManyToMany, PrimaryColumn} from "typeorm";

import { ParserHelper } from "../../../helper/parser.helper";
import {Army} from "../../army.entity";

@Entity("unit_profiles")
export class UnitProfile {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public characteristics: string;

    @Column({ name: "is_shared" })
    public isShared: boolean;
    // @Column({ name: "owner_id" })
    // public ownerId: string;
    //
    // @Column({ name: "owner_type" })
    // public ownerType: string;

    public parsedCharacteristics: Map<string, string>;

    @AfterLoad()
    private parseCharacteristics() {
        this.parsedCharacteristics = ParserHelper.stringToMap(this.characteristics);
    }
}
