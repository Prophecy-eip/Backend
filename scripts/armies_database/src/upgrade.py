from numpy import array
import psycopg2
import json

from condition import Condition
from link import Link
from cost import Cost
from modifier import Modifier
from profile import UnitProfile
from rule import Rule
from item import SpecialItemsCategory
from global_strings import *
import helper

class Army:
    pass

class Upgrade:
    _id: str = ""
    _name: str = ""
    _collective: str = ""

    _constraints: array(Condition, []) = []

    _links: array(Link, []) = []

    _cost: Cost

    _modifiers: array(str, []) = []

    _profiles: array(str, []) = []
    
    _rules: array(str, []) = []

    # _specialItemsCategories: array(SpecialItemsCategory, []) = []


    def __init__(self, upgrade, army: Army):
        self._constraints = []
        self._links = []
        self._modifiers = []
        self._profiles = []
        self._rules = []

        self._name = upgrade[NAME]
        self._id = upgrade[ID]
        self._collective = upgrade[COLLECTIVE]
        # constraints
        try:
            for c in upgrade.find(CONSTRAINTS).find_all(CONSTRAINT):
                self._constraint.apend(Condition(c))
        except (AttributeError):
            pass 
        # links
        try:
            for l in upgrade.find(INFOLINKS).find_all(INFOLINK):
                self._links.append(Link(l))
        except (AttributeError):
            pass
        # cost
        try:
            self._cost = Cost(upgrade.find(COSTS).find(COST))
        except (AttributeError):
            pass
        # modifiers
        try:
            for m in upgrade.find(MODIFIERS).find_all(MODIFIER):
                modifier: Modifier = Modifier(m)
                army.addModifier(modifier)
                self._modifiers.append(modifier.getId())
        except (AttributeError):
            pass
        # profiles
        try:
            for p in upgrade.find(PROFILES).find_all(PROFILE):
                profile: UnitProfile = UnitProfile(p)
                army.addProfile(UnitProfile(p))
                self._profiles.append(profile.getId())
        except (AttributeError):
            pass
        # rules
        try:
            for r in upgrade.find(RULES).find_all(RULE):
                rule: Rule = Rule(r)
                army.addRule(rule)
                self._rules.append(rule.getId())
        except (AttributeError):
            pass
        # selection entry groups
        try:
            for selec in upgrade.find_all(SELECTION_ENTRY_GROUPS):
                for s in selec.find_all(SELECTION_ENTRY_GROUP, recursive=False):
                    army.addUpgradeCatgegory(s)
                    # army.addItemCategory(SpecialItemsCategory(s, army))
        except (AttributeError):
            pass

    def getId(self) -> str:
        return self._id        

    def print(self):
        print("NAME:", self._name, "\tID:", self._id, "\tCOLLECTIVE:", self._collective)
        print("--- constraints ---")
        for c in self._constraints:
            c.print()
        print("--- links ---")
        for l in self._links:
            l.print()
        print("--- cost ---")
        self._cost.print()
        print("--- modifiers ---")
        print(self._modifiers)
        print("--- profiles ---")
        for p in self._profiles:
            p.print()
        print("--- rules ---")
        for r in self._rules:
            r.print()
        for s in self._specialItemsCategories:
            s.print()

    def save(self, connection, cursor):
        try:
            conditionsArr: array(str)  = []
            for c in self._constraints:
                conditionsArr.append(c.toString())
            conditions: str = json.dumps(conditionsArr)
            modifiers: str = json.dumps(self._modifiers)
            profiles: str = json.dumps(self._profiles)
            rules: str = json.dumps(self._rules)
            cursor.execute(f"INSERT INTO {UPGRADES_TABLE} (id, name, is_collective, limits, cost, modifiers, profiles, rules) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (self._id, self._name, self._collective, conditions, self._cost.toString(), modifiers, profiles, rules))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass


class UpgradeCategory:
    __id: str = ""
    __name: str = ""
    __collective: str = ""
    _constraints: array(Condition) = None
    _upgrades: array(Upgrade) = None
    _links: array(Link) = None

    def __init__(self, category):
        self._constraints = []
        self._upgrades = []
        self._links = []
        self.__id = category[ID]
        self.__name = category[NAME]
        self.__collective = category[COLLECTIVE]
        for c in category.find(CONSTRAINTS).find_all(CONSTRAINT):
            self._constraints.append(Condition(c))
        # upgrades
        # try:
        #     # for u in category.find(SELECTION_ENTRIES).find_all(SELECTION_ENTRY):
        #     #     self._upgrades.append(Upgrade(u))
        # except (AttributeError):
        #     pass
        # links 
        try:
            for l in category.find(ENTRY_LINKS).find_all(ENTRY_LINK):
                self._links.append(Link(l))
        except (AttributeError):
            pass

    def print(self):
        print("NAME:", self.__name, "\tID:", self.__id, "\tCOLLECTIVE:", self.__collective)
        print("--- constraints ---")
        for c in self._constraints:
            c.print()
        print("--- upgrades ---")
        for u in self._upgrades:
            u.print()

    def getId(self) -> str:
        return self.__id

    def save(self, connection, cursor):
        try:
            arr: array(str) = []
            for c in self._constraints:
                arr.append(c.toString())
            limits: str = json.dumps(arr)
            cursor.execute(f"INSERT INTO {UPGRADE_CATEGORIES_TABLE} (id, name, is_collective, limits) VALUES (%s, %s, %s, %s)", (self.__id, self.__name, self.__collective, limits))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
