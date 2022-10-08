from numpy import array
import json
import psycopg2

from global_strings import *
from modifier import Modifier
from condition import Condition
from rule import Rule
from cost import Cost
from link import Link

class Army:
    pass

# class Option:
#     pass

class Option:
    # __unitId: str = ""
    __id: str = ""
    __name: str = ""
    __type: str = ""

    _modifiers: array(str) = []

    _constraints: array(Condition) = []

    _rules: array(str) = []

    _cost: Cost

    # _subOptions: array(Option, []) = []

    _links: array(Link, []) = []

    def __init__(self, option, army: Army):

        self._modifiers = []
        self._constraints = []
        self._rules = []
        self._links = []

        # self.__unitId = unitId
        self.__name = option[NAME]
        self.__id = option[ID]
        self.__type = option[TYPE]

        try:
            for m in option.find(MODIFIERS).find_all(MODIFIER):
                modifier: Modifier = Modifier(m)
                army.addModifier(modifier)
                self._modifiers.append(modifier.getId())
        except (AttributeError):
            pass
        
        try:
            for c in option.find(CONSTRAINTS).find_all(CONSTRAINT):
                self._constraints.append(Condition(c))
        except (AttributeError):
            pass

        # print(option)
        try:
            for r in option.find(RULES).find_all(RULE):
                rule: Rule = Rule(r)
                army.addRule(rule)
                self._rules.append(rule.getId())
        except (AttributeError):
            pass
        self._cost = Cost(option.find(COSTS).find(COST))

#  TODO: try to add selection entry group
        # try:
        #     groups: ResultSet = option.find(SELECTION_ENTRY_GROUPS).find_all(SELECTION_ENTRY_GROUP)

        #     for opt in groups:
        #         for o in opt.find(SELECTION_ENTRY_GROUPS).find_all(SELECTION_ENTRY_GROUP): 
        #             print(o)    
        #             self._subOptions.append(Option(o))
        #             # for z in x:
        #             #     print(z[NAME])
        # except:
        #     pass

        try:
            for l in option.find(ENTRY_LINKS).find_all(ENTRY_LINK):
                self._links.append(Link(l))
        except (AttributeError):
            pass
    
    def print(self):
        print("NAME:", self.__name, "\tID:", self.__id, "\tTYPE:", self.__type, "\tCOST:", self._cost.toString())
        print("--- modifiers ---")
        for m in self._modifiers:
            m.print()
        print("--- constraints ---")
        for c in self._constraints:
            c.print()
        print("--- rules --")
        for r in self._rules:
            r.print()
        print("--- suboptions ---")
        for o in self._subOptions:
            o.print()
        print("--- links ---")
        for l in self._links:
            l.print()

    def getId(self) -> str:
        return self.__id

    def save(self, connection, cursor):
        try:
            limitsArr: array(str) = []
            for c in self._constraints:
                limitsArr.append(c.toString())
            limits: str = json.dumps(limitsArr)
            modifiers: str = json.dumps(self._modifiers)
            rules: str = json.dumps(self._rules)
            cursor.execute(f"INSERT INTO {OPTIONS_TABLE} (id, name, type, limits, cost, modifiers, rules) VALUES (%s, %s, %s, %s, %s, %s, %s)", (self.__id, self.__name, self.__type, limits, self._cost.toString(), modifiers, rules))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
