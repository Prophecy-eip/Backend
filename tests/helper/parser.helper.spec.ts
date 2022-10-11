import { Test } from "@nestjs/testing";

import { ParserHelper } from "../../src/helper/parser.helper";
import loader from "ts-loader";

describe("ParserHelper", () => {
    it("stringToMap: Parse valid string", () => {
       const str: string = "{\"Att\": \"4\", \"Off\": \"6\", \"Str\": \"4\", \"AP\": \"1\", \"Agi\": \"6\", \"Rules\": \"Kenjutsu (3)\"}";
       const map: Map<string, string> = ParserHelper.stringToMap(str);

       expect(map).toBeDefined();
       expect(map.get("Att")).toEqual("4");
       expect(map.get("Off")).toEqual("6");
       expect(map.get("Str")).toEqual("4");
       expect(map.get("AP")).toEqual("1");
       expect(map.get("Agi")).toEqual("6");
       expect(map.get("Rules")).toEqual("Kenjutsu (3)");
    });

    // it("stringToMap: Parse empty string", () => {
    //     const str: string = "";
    //     const map: Map<string, string> = ParserHelper.stringToMap(str);
    //     console.log(map)
    //     expect(map.size).toEqual(0);
    // }); // TODO: fix

    it("stringToMap: Parse string with empty value", () => {
        const str: string ="{\"Att\": \"\"}";
        const map: Map<string, string> = ParserHelper.stringToMap(str);

        expect(map.get("Att")).toEqual("");
    });

    it("stringToArray: Parse valid string", () => {
        const str = "[\"abc\", \"def\", \"ghi\"]"
        const array: string[] = ParserHelper.stringToArray(str);

        expect(array[0]).toEqual("abc");
        expect(array[1]).toEqual("def");
        expect(array[2]).toEqual("ghi");
    });
});
