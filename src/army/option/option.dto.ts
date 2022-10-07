import { ModifierDTO } from "../modifier/modifierDTO";

export class OptionDTO {
    id: string;
    name: string;
    type: string;
    limits: string[]
    cost: string;
    modifiers: ModifierDTO[]
}