import { UpgradeDTO } from "../../upgrade/upgrade.dto";
import {SpecialItemCategory} from "./special-item-category.entity";

export class SpecialItemCategoryDTO {
    constructor(category: SpecialItemCategory) {
        this.id = category.id;
        this.name = category.name;
        this.isCollective = category.isCollective;
        this.limits = category.limits;
        for (const item of category.items)
            this.items.push(new UpgradeDTO(item));
    }

    public id: string;
    public name: string;
    public isCollective: boolean;
    public limits: string;
    public items: UpgradeDTO[] = [];
}
