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

describe("Param helper::checkParamProperties", () => {
    it("use valid object - then should return an empty array", () => {
        const object: FixtureObject = { name: "John Doe", age: 27 };
        const e: Error[] = ParamHelper.checkParamProperties(object, requiredProperties, "fixture");

        expect(e.length).toEqual(0);
    });

    it("undefined name - then should return one error", () => {
        const object = { age: 27 };
        const e: Error[] = ParamHelper.checkParamProperties(object, requiredProperties, "fixture");

        expect(e.length).toEqual(1);
        expect(e[0].message).toEqual("Invalid name in fixture object (null or undefined)");
    });

    it("undefined age - then should return one error", () => {
        const object = { name: "John Doe" };
        const e: Error[] = ParamHelper.checkParamProperties(object, requiredProperties, "fixture");

        expect(e.length).toEqual(1);
        expect(e[0].message).toEqual("Invalid age in fixture object (null or undefined)");
    });

    it("undefined name and age - then should return two errors", () => {
        const object = {};
        const e: Error[] = ParamHelper.checkParamProperties(object, requiredProperties, "fixture");

        expect(e.length).toEqual(2);
        expect(e[0].message).toEqual("Invalid name in fixture object (null or undefined)");
        expect(e[1].message).toEqual("Invalid age in fixture object (null or undefined)");
    });

    it("null name - then should return one error", () => {
        const object: FixtureObject = { name: null, age: 27 };
        const e: Error[] = ParamHelper.checkParamProperties(object, requiredProperties, "fixture");

        expect(e.length).toEqual(1);
        expect(e[0].message).toEqual("Invalid name in fixture object (null or undefined)");
    });

    it("null age - then should return one error", () => {
        const object: FixtureObject = { name: "John Doe", age: null };
        const e: Error[] = ParamHelper.checkParamProperties(object, requiredProperties, "fixture");

        expect(e.length).toEqual(1);
        expect(e[0].message).toEqual("Invalid age in fixture object (null or undefined)");
    });

    it("null name and age - then should return two errors", () => {
        const object: FixtureObject = { name: null, age: null };
        const e: Error[] = ParamHelper.checkParamProperties(object, requiredProperties, "fixture");

        expect(e.length).toEqual(2);
        expect(e[0].message).toEqual("Invalid name in fixture object (null or undefined)");
        expect(e[1].message).toEqual("Invalid age in fixture object (null or undefined)");
    });
});
