from bs4 import ResultSet
import psycopg2
import uuid

from global_strings import *

class Rule:
    __id: str = ""
    __name: str = ""
    __description: str = ""

    def __init__(self, rule: ResultSet):
        self.__id = str(uuid.uuid4())
        self.__name = rule[NAME]
        self.__description = rule.find(DESCRIPTION).getText()

    def getId(self) -> str:
        return self.__id

    def getName(self) -> str:
        return self.__name

    def getDescription(self) -> str:
        return self.__description

    def print(self):
        print("NAME:", self._name)
        print("DESCRIPTION:", self._description, "\n")

    def save(self, connexion, cursor):
        try:
            cursor.execute(f"""INSERT INTO {RULES_TABLE} (id, {NAME}, {DESCRIPTION}) VALUES (%s,%s,%s)""", (self.__id, self.__name, self.__description))
            connexion.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
