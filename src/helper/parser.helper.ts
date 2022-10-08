export class ParserHelper {
    static stringToMap(str: string): Map<string, string> {
        let map = new Map<string, string>();
        str = str.substring(1, str.length - 1);

        str.split(", ").forEach((elem) => {
            elem = elem.substring(1, elem.length - 1);
            let parts = elem.split(": ");

            map.set(parts[0].substring(0, parts[0].length - 1),
                parts.length >= 2 ? parts[1].substring(1, parts[1].length) : "");
        })
        return map;
    }

    static stringToArray(str: string): string[] {
        const raw = str.substring(1, str.length - 1);
        let arr = raw.split(", ");

        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].substring(1, arr[i].length - 1);
        }
        return arr;
    }
}
