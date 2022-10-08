from numpy import array
import psycopg2
import json

from condition import Condition
from link import Link
from cost import Cost
from modifier import Modifier
from profile import Profile
from rule import Rule
from item import SpecialItemsCategory
from global_strings import *
import helper

class Upgrade:
    _id: str = ""
    _name: str = ""
    _collective: str = ""

    _constraints: array(Condition, []) = []

    _links: array(Link, []) = []

    _cost: Cost

    _modifiers: array(Modifier, []) = []

    _profiles: array(Profile, []) = []
    
    _rules: array(Rule, []) = []

    _specialItemsCategories: array(SpecialItemsCategory, []) = []


    def __init__(self, upgrade):
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
                self._modifiers.append(Modifier(m))
        except (AttributeError):
            pass
        # profiles
        try:
            for p in upgrade.find(PROFILES).find_all(PROFILE):
                self._profiles.append(Profile(p))
        except (AttributeError):
            pass
        # rules
        try:
            for r in upgrade.find(RULES).find_all(RULE):
                self._rules.append(Rule(r))
        except (AttributeError):
            pass
        # selection entry groups
        try:
            for selec in upgrade.find_all(SELECTION_ENTRY_GROUPS):
                for s in selec.find_all(SELECTION_ENTRY_GROUP):
                    self._specialItemsCategories.append(SpecialItemsCategory(s))
        except (AttributeError):
            pass

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

    def save(self, connection, cursor, armyId: str):
        try:
            conditionsArr: array(str)  = []
            profilesArr: array(str) = []
            for c in self._constraints:
                conditionsArr.append(c.toString())
            for p in self._profiles:
                # p.save(connection, cursor, self._id, "upgrade")
                profilesArr.append(p.getId())
            conditions: str = json.dumps(conditionsArr)
            modifiers: str = "" #saveArrayAndGetIds(self._modifiers, connection, cursor)
            profiles: str = json.dumps(profilesArr)
            rules: str = helper.saveArrayAndGetIds(self._rules, connection, cursor)
            cursor.execute(f"INSERT INTO {UPGRADES_TABLE} (id, name, is_collective, limits, cost, modifiers, profiles, rules, army) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", (self._id, self._name, self._collective, conditions, self._cost.toString(), modifiers, profiles, rules, armyId))
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
        try:
            for u in category.find(SELECTION_ENTRIES).find_all(SELECTION_ENTRY):
                self._upgrades.append(Upgrade(u))
        except (AttributeError):
            pass
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

    def save(self, connection, cursor, armyId):
        try:
            arr: array(str) = []
            for c in self._constraints:
                arr.append(c.toString())
            limits: str = json.dumps(arr)
            cursor.execute(f"INSERT INTO {UPGRADE_CATEGORIES_TABLE} (id, name, is_collective, limits, army) VALUES (%s, %s, %s, %s, %s)", (self.__id, self.__name, self.__collective, limits, armyId))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
