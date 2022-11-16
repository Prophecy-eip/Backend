import { ParamHelper } from "../../src/helper/param.helper";

describe("Param helper", () => {

    it("isValid: use valid param - then should return true", () => {
        const param: string = "abcd";
        const valid: boolean = ParamHelper.isValid(param);

        expect(valid).toEqual(true);
    });

    it("isValid: use undefined param - then should return false", () => {
        const param: string = undefined;
        const valid: boolean = ParamHelper.isValid(param);

        expect(valid).toEqual(false);
    });

    it("isValid: use null param - then should return false", () => {
        const param: string = null;
        const valid: boolean = ParamHelper.isValid(param);

        expect(valid).toEqual(false);
    });
});
