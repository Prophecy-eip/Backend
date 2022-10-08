import { ModifierDto } from "../modifier/modifier.dto";
import { Option } from "./option.entity";
import {Modifier} from "../modifier/modifier.entity";

export class OptionDTO {
    constructor(option: Option) {
    }

    id: string;
    name: string;
    type: string;
    limits: string[]
    cost: string;
}