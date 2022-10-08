#!/usr/bin/env python3

import glob
import os
import shutil

from bs4 import BeautifulSoup, ResultSet
from numpy import array

import psycopg2
from configparser import ConfigParser

import json

import uuid

import git

import helper
from global_strings import * 
from link import Link
from cost import Cost
from condition import Condition
from rule import Rule
from modifier import Modifier
from option import Option
from item import Item, SpecialItemsCategory
from profile import Profile
from upgrade import Upgrade, UpgradeCategory
from unit import Unit, UnitCategory

class Army:
    pass



class Army:
    __name: str = ""
    __id: str = ""

    __organisation: array(UnitCategory) = [] # saved
    __units: array(Unit) = []
    __rules: array(Rule) = [] # saved
    
    __options: array(Option) = [] # saved
    
    __upgradeCategories: array(UpgradeCategory) = [] # saved
    __upgrades: array(Upgrade) = []
    
    __profiles: array(Profile) = [] # saved
    
    __modifiers: array(Modifier) = []
    
    __itemCategories: array(SpecialItemsCategory) = []
    __items: array(Item) = []

    def __init__(self, soup: BeautifulSoup):
        self.__organisation = []
        self.__units = []
        self.__rules = []
        self.__options = []
        self.__upgradeCategories = []
        self.__upgradeCategories = []
        self.__upgrades = []
        self.__profiles = []
        self.__modifiers = []
        self.__itemCategories = []
        self.__items = []
        catalogue = soup.find(CATALOGUE)
        self.__id = catalogue[ID]
        self.__name = catalogue[NAME]
        self.__manageCategoryLinks(catalogue.find(FORCE_ENTRIES).find(FORCE_ENTRY).find(CATEGORY_LINKS).find_all(CATEGORY_LINK))
        self.__manageSelectionEntries(catalogue.find(SELECTION_ENTRIES, recursive=False).find_all(SELECTION_ENTRY, recursive=False))
        try:
            self.__manageSharedSelectionEntries(catalogue.find(SHARED_SELECTION_ENTRIES, recursive=False).find_all(SELECTION_ENTRY, recursive=False))
        except (AttributeError):
            pass
        try:
            self.__manageSharedSelectionEntryGroups(catalogue.find(SHARED_SELECTION_ENTRY_GROUPS, recursive=False).find_all(SELECTION_ENTRY_GROUP))
        except (AttributeError):
            pass
        try:
            self.__manageSharedRules(catalogue.find(SHARED_RULES).find_all(RULE))
        except (AttributeError):
            pass
        try:
            self.__manageSharedProfiles(catalogue.find(SHARED_PROFILES).find_all(PROFILE))
        except (AttributeError):
            pass

    def __manageCategoryLinks(self, categories: ResultSet):
        for c in categories:
            self.__organisation.append(UnitCategory(c))

    def __manageSelectionEntries(self, selections: ResultSet):
        for s in selections:
            type = s["type"]
            # print("    Type:", type)
            if type == "unit":
                unit: Unit = Unit(s)
                self.__units.append(unit)
                try:
                    options: ResultSet = s.find(SELECTION_ENTRIES, recursive=False).find_all(SELECTION_ENTRY)
                    # missing stuff
                    for o in options:
                        self.__options.append(Option(o, unit._id))
                except (AttributeError):
                    pass
            if type == "upgrade":
                self.__upgrades.append(Upgrade(s))
            

    def __manageSharedSelectionEntries(self, entries: ResultSet):
        for e in entries:
            self.__upgrades.append(Upgrade(e))

    def __manageSharedSelectionEntryGroups(self, groups: ResultSet):
        for c in groups:
            self.__upgradeCategories.append(UpgradeCategory(c))

    def __manageSharedRules(self, rules: ResultSet):
        for r in rules:
            self.__rules.append(Rule(r))

    def __manageSharedProfiles(self, profiles: ResultSet):
        for p in profiles:
            self.__profiles.append(Profile(p))

    def print(self):
        print("ARMY", self.__name, f"({self.__id})")


    def __config(self, filename="database.ini", section="postgresql"):
        parser = ConfigParser()
        db = {}

        parser.read(filename)
        if parser.has_section(section):
            params = parser.items(section)
            for param in params:
                db[param[0]] = param[1]
        else:
            raise Exception('Section {0} not found in the {1} file'.format(section, filename))
        return db

    def save(self):   
        print(f"Saving {self.__name} in database...")
        try:
            params = self.__config("../database.ini")
            connexion = psycopg2.connect(**params)
            cursor = connexion.cursor()
            cursor.execute(f"""INSERT INTO {ARMIES_TABLE} ({ID}, {NAME}) VALUES (%s,%s)""", (self.__id, self.__name))
            connexion.commit()
            for r in self.__rules:
                r.save(connexion, cursor)
            for c in self.__organisation:
                c.save(connexion, cursor, self.__id)
            for p in self.__profiles:
                p.save(connexion, cursor, self.__id, "army", isShared=True)
            for c in self.__upgradeCategories:
                c.save(connexion, cursor, self.__id)
            for u in self.__units:
                u.save(connexion, cursor, self.__id)
            for o in self.__options:
                o.save(connexion, cursor)
            for u in self.__upgrades:
                u.save(connexion, cursor, self.__id)
            print("Done!")
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
        # except:
        #     raise Exception("an error occured")
        finally:
            connexion.close()

    def addRule(self, rule: Rule):
        self.__rules.append(rule)
    
    def addModifier(self, modifier: Modifier):
        self.__modifiers.append(modifier)

    def addItem(self, item: Item):
        self.__items.append(item)

    
        
def main():

    dirpath = f"./{REPOSITORY_NAME}"

    if os.path.exists(dirpath):
        shutil.rmtree(dirpath)

    print(f"Cloning {REPOSITORY_NAME } repository...")
    git.Git(".").clone("https://github.com/BSData/The-9th-Age.git")
    print("Repository succesfully cloned!")

    filenames = [f for f in glob.glob(f"./{REPOSITORY_NAME}/*.cat")]
    
    for filename in filenames:
        print(f"Reading {filename}...")
        content = []
        with open(filename, "r") as file:
            content = file.readlines()
            content = "".join(content)
        soup = BeautifulSoup(content, features="lxml")
        army: Army = Army(soup)
        army.save()     

if __name__ == "__main__":
    main()
