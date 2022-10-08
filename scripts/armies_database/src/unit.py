from numpy import array
import psycopg2
import json

from cost import Cost
from link import Link
from option import Option
from profile import Profile
from global_strings import *
from condition import Condition

##
# @class Unit
# @brief Represents a Unit object
#

class Unit:
    _id: str = ""
    _name: str = ""
    _categoryId: str = ""

    _cost: Cost
    
    _links: array(Link, []) = []
    _options: array(Option, []) = [] # saved
    _profiles: array(Profile, []) = [] # saved

    def __init__(self, selection):
        self._links = []
        self._options = []
        self._profiles = []
        self._id = selection[ID]
        self._name = selection[NAME]
        self._cost = Cost(selection.find(COSTS, recursive=False).find(COST))
        # profiles
        try:
            for p in selection.find(PROFILES).find_all(PROFILE):
                self._profiles.append(Profile(p))
        except (AttributeError):
            pass
        # infoLinks
        try:
            for link in selection.find(INFOLINKS).find_all(INFOLINK):
                self._links.append(Link(link))
        except (AttributeError):
            pass
        # options
        try:
            for s in selection.find(SELECTION_ENTRIES).find_all(SELECTION_ENTRY):
                self._options.append(Option(s, self._id))
        except (AttributeError):
            pass
        # categoryLinks
        self._categoryId = selection.find(CATEGORY_LINKS).find(CATEGORY_LINK)[TARGET_ID]
    
    ##
    # @brief Enables unit print (used for debug)
    # 

    def print(self):
        print("\n===== UNIT =====")
        print("NAME:", self._name)
        print("ID:  ", self._id)
        print("CATEGORY: ", self._categoryId)
        print("COST:", self._cost)
        print("--- profiles ---")
        for p in self._profiles:
            p.print()
        print("--- links ---")
        for l in self._links:
            l.print()
        print("--- options ---")
        for o in self._options:
            o.print()
    
    def linkOption(self, opt: Option):
        self._options.append(opt)

    def save(self, connection, cursor, armyId: str):
        try:
            profilesArr: array(str) = []
            optionsArr: array(str) = []
            for p in self._profiles:
                p.save(connection, cursor, self._id, "unit")
                profilesArr.append(p.getId())
            for o in self._options:
                # o.save(connection, cursor)
                optionsArr.append(o._id)
            profiles: str = json.dumps(profilesArr)
            options: str = json.dumps(optionsArr)
            cursor.execute(f"INSERT INTO {UNITS_TABLE} (id, name, army, category, cost, options, profiles) VALUES (%s, %s, %s, %s, %s, %s, %s)", (self._id, self._name, armyId, self._categoryId, self._cost.toString(), options, profiles))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass


class UnitCategory:
    __id: str = "" 
    __targetId: str = ""
    __name: str = ""
    __constraints: array(Condition) = None

    def __init__(self, category):   
        self.__constraints = []

        self.__id = category[ID]
        self.__targetId = category[TARGET_ID]
        self.__name = category[NAME]
        try:
            for c in category.find(CONSTRAINTS).find_all(CONSTRAINT):
                self.__constraints.append(Condition(c))
        except (AttributeError):
            pass

    def print(self):
        print("NAME:", self._name, "\tID:", self._id)

    def save(self, connexion, cursor, armyId: str):
        try:
            arr: array(str) = []
            for c in self.__constraints:
                arr.append(c.toString())
            constraints = json.dumps(arr)
            cursor.execute("INSERT INTO unit_categories (id, name, limits, army, target_id) VALUES (%s,%s,%s,%s,%s)", (self.__id, self.__name, constraints, armyId, self.__targetId))
            connexion.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass

