from global_strings import *

class Cost:
    _name: str = ""
    _value: str = ""

    def __init__(self, cost):
        self._name = cost[NAME]
        self._value = cost[VALUE]

    def toString(self) -> str:
        return self._value + " " + self._name 

    def print(self):
        print(self.toString())
