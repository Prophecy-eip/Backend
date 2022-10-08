import uuid
import psycopg2
import json

from global_strings import *

class UnitProfile:
    __id: str = ""
    __name: str = ""
    __type: str = ""
    __characteristics: dict = None
    __isShared: bool

    def __init__(self, profile, isShared: bool = False):
        self.__characteristics = dict()
        self.__name = profile[NAME]
        self.__id = profile[ID]
        self.__type = profile[TYPENAME]
        self.__isShared = isShared

        for c in profile.find(CHARACTERISTICS, recursive=False).find_all(CHARACTERISTIC, recursive=False):
            self.__characteristics[c[NAME]] = c.getText()
    
    def getId(self) -> str:
        return self.__id

    def print(self):
        print("NAME:", self.__name, "\tID:", self.__id, "\tTYPE:", self.__type)
        print("--- characteristics ---")
        print(self.__characteristics)

    def save(self, connection, cursor):
        try:
            characteristics = json.dumps(self.__characteristics)
            cursor.execute(f"INSERT INTO {UNIT_PROFILES_TABLE} ({ID}, {NAME}, {CHARACTERISTICS}, {IS_SHARED}) VALUES (%s, %s, %s, %s)", (self.__id, self.__name, characteristics, self.__isShared))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
