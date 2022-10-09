import {AfterLoad, Column, Entity, PrimaryColumn} from "typeorm";

import { ParserHelper } from "../../../helper/parser.helper";

@Entity("unit_profiles")
export class UnitProfile {
    @PrimaryColumn()
    public id: string;

    @Column()
    public name: string;

    @Column({ name: "characteristics" })
    private rawCharacteristics: string;

    @Column({ name: "is_shared" })
    public isShared: boolean;

    public characteristics: Map<string, string>;

    @AfterLoad()
    private parseCharacteristics() {
        this.characteristics = ParserHelper.stringToMap(this.rawCharacteristics);
    }
}
