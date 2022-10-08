from numpy import array
import json
import psycopg2

import helper
from global_strings import *
from condition import Condition
from link import Link
from cost import Cost

class Army:
    pass

class Item:
    _name: str = ""
    _id: str = ""
    _isCollective: str = ""
    _type: str = ""

    _constraints: array(Condition, []) = []

    _links: array(Link, []) = []

    _cost: Cost

    def __init__(self, item):
        self._name = item[NAME]
        self._id = item[ID]
        self._type = item[TYPE]
        # constraints
        try:
            for c in item.find(CONSTRAINTS).find_all(CONSTRAINT):
                self._constraints.append(Condition(c))
        except (AttributeError):
            pass
        # links
        try:
            for l in item.find(INFOLINKS).find_all(INFOLINK):
                self._links.append(Link(l))
        except (AttributeError):
            pass
        #cost
        try:
            self._cost = Cost(item.find(COSTS).find(COST))
        except (AttributeError):
            pass

        try:
            for s in item.find(SELECTION_ENTRIES).find_all(SELECTION_ENTRY):
                print(s[NAME])
        except (AttributeError):
            pass

    def print(self):
        print("NAME:", self._name, "\tID:", self._isCollective, "\tTYPE:", self._type)
        print("--- constraints ---")
        for c in self._constraints:
            c.print()
        print("--- links ---")
        for l in self._links:
            l.print()
        self._cost.print()

    def save(self, connection, cursor, categoryId: str):
        try:
            limitsArr: array(str) = []
            for l in self._constraints:
                limitsArr.append(l.toString())
            limits = json.dumps(limitsArr)
            cursor.execute(f"INSERT INTO {SPECIAL_ITEMS_TABLE} ({ID}, {NAME}, is_collective, type, limits, cost, category) VALUES (%s, %s, %s, %s, %s, %s, %s)", (self._id, self._name, self._isCollective, self._type, limits, self._cost.toString(), categoryId))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass   

class SpecialItemsCategory: # TODO: save
    _name: str = ""
    _id: str = ""
    _isCollective: str = ""

    _constraints: array(Condition, []) = []

    _items: array(Item, []) = []

    def __init__(self, entry, army: Army):
        self._id = entry[ID]
        self._name = entry[NAME]
        self._isCollective = entry[COLLECTIVE]
        
        try:
            for c in entry.find(CONSTRAINTS).find_all(CONSTRAINT):
                self._constraints.append(Condition(c))
        except (AttributeError):
            pass
        for item in entry.find(SELECTION_ENTRY_GROUPS).find_all(SELECTION_ENTRY_GROUP):
            self._items.append(Item(item))
    
    def print(self):
        print("NAME:", self._name, "\tID:", self._id, "\tCOLLECTIVE:", self._isCollective)
        print("--- constraints ---")
        for c in self._constraints:
            c.print()
        print("--- items ---")
        for i in self._items:
            i.print()

    def save(self, connection, cursor, armyId: str):
        try:
            items = helper.saveArrayAndGetIdsWithId(connection, cursor, self._id)
            limitsArr: array(str) = []
            for l in self._constraints:
                limitsArr.append(l.toString())
            limits = json.dumps(limitsArr)
            cursor.execute(f"INSERT INTO {SPECIAL_ITEM_CATEGORIES_TABLE} ({ID}, {NAME}, is_collective, limits, items, army) VALUES (%s, %s, %s, %s, %s, %s)", (self._id, self._name, self._isCollective, limits, items, armyId))
            connection.commit()
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass   
