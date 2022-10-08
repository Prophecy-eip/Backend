import uuid
import psycopg2
from numpy import array
import json

from global_strings import *
from condition import Condition

class Modifier:
    _id: str = ""
    _type: str = ""
    _value: str = ""
    _field: str = ""
    _conditions: array(Condition) = []

    def __init__(self, modifier):
        self._conditions = []

        self._id = str(uuid.uuid4())
        self._type = modifier[TYPE]
        self._value = modifier[VALUE]
        self._field = modifier[FIELD]

        try:
            for c in modifier.find(CONDITIONS).find_all(CONDITION):
                self._conditions.append(Condition(c))
        except (AttributeError):
            pass
    
    def getId(self) -> str:
        return self._id

    def save(self, connection, cursor):
        try:
            conditionsArr: array(str) = []
            for c in self._conditions:
                conditionsArr.append(c.toString())
            conditions: str = json.dumps(conditionsArr)
            cursor.execute(f"INSERT INTO {MODIFIERS_TABLE} (id, type, value, field, limits) VALUES (%s,%s,%s,%s,%s)", (self._id, self._type, self._value, self._field, conditions))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
