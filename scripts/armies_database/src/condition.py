from global_strings import *

class Condition:
    _field: str = ""
    _value: str = ""
    _percentValue: str = ""
    _type: str = ""

    def __init__(self, condition):
        self._field = condition[FIELD]
        self._value = condition[VALUE]
        self._percentValue = condition[PERCENT_VALUE]
        self._type = condition[TYPE]

    def toString(self) -> str:
        s: str = self._field + " " + self._type + " " + self._value

        if self._percentValue == "true":
            s += " %"
        return s

    def print(self):
        print("FIELD:", self._field, "\tVALUE:", self._value, "\tPERCENT:", self._percentValue, "\tTYPE:", self._type, "\n")
