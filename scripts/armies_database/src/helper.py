from numpy import array
import json


def saveArrayAndGetIds(arr, connection, cursor) -> str:
    idsArr: array(str) = []

    for i in arr:
        i.save(connection, cursor)
        idsArr.append(i.getId())
    return json.dumps(idsArr)

def saveArrayAndGetIdsWithId(arr, connection, cursor, id: str) -> str:
    idsArr: array(str) = []

    for i in arr:
        i.save(connection, cursor, id)
        idsArr.append(i.getId())
    return json.dumps(idsArr)   