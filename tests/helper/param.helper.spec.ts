import { ParamHelper } from "@helper/param.helper";

type FixtureObject = {
    name: string;
    age: number;
}
const requiredProperties: string[] = ["name", "age"];

describe("Param helper::isValid", () => {

    it("use valid param - then should return true", () => {
        const param: string = "abcd";
        const valid: boolean = ParamHelper.isValid(param);

        expect(valid).toEqual(true);
    });

    it("use undefined param - then should return false", () => {
        const param: string = undefined;
        const valid: boolean = ParamHelper.isValid(param);

        expect(valid).toEqual(false);
    });

    it("use null param - then should return false", () => {
        const param: string = null;
        const valid: boolean = ParamHelper.isValid(param);

        expect(valid).toEqual(false);
    });
});
