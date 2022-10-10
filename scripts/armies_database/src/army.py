from ast import Break
import json
from unicodedata import category
from bs4 import BeautifulSoup, ResultSet
from numpy import array
import psycopg2
from configparser import ConfigParser

import helper
from global_strings import * 
from rule import Rule
from modifier import Modifier
from option import Option
from item import Item, SpecialItemsCategory
from profile import UnitProfile
from upgrade import Upgrade, UpgradeCategory
from unit import Unit, UnitCategory

EXISTING_PROFILES: array(str) = []
EXISTING_UPGRADE_CATEGORIES: array(str) = []
EXISTING_UNITS: array(str) = []
EXISTING_OPTIONS: array(str) = []
EXISTING_UPGRADES: array(str) = []
EXISTING_MODIFIERS: array(str) = []
EXISTING_ITEM_CATEGORIES: array(str) = []

class Army:
    __name: str = ""
    __id: str = ""

    __organisation: array(UnitCategory) = [] # saved
    __units: array(Unit) = []
    __rules: array(Rule) = [] # saved
    
    __options: array(Option) = [] # saved
    
    __upgradeCategories: array(UpgradeCategory) = [] # saved
    __upgrades: array(Upgrade) = []
    
    __profiles: array(UnitProfile) = [] # saved
    
    __modifiers: array(Modifier) = []
    
    __itemCategories: array(SpecialItemsCategory) = []
    __items: array(Item) = []

    __unitCategoryIds: array(str) = []
    __rulesIds: array(str) = []
    __upgradeCategoryIds: array(str) = []
    __itemCategoryIds: array(str) = []
    __unitsIds: array(str) = []
    __upgradesIds: array(str) = []
    __itemsIds: array(str) = []

    def __init__(self, soup: BeautifulSoup):
        self.__organisation = []
        self.__units = []
        self.__rules = []
        self.__options = []
        self.__upgradeCategories = []
        self.__upgrades = []
        self.__profiles = []
        self.__modifiers = []
        self.__itemCategories = []
        self.__items = []
        self.__unitCategoryIds = []
        self.__rulesIds = []
        self.__itemCategoryIds = []
        self.__unitsIds = []
        self.__upgradesIds = []
        self.__itemsIds = []
        self.__upgradeCategoryIds = []
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
            cat: UnitCategory = UnitCategory(c)
            self.__organisation.append(cat)
            self.__unitCategoryIds.append(cat.getId())


    def __manageSelectionEntries(self, selections: ResultSet):
        for s in selections:
            type = s["type"]
            if type == "unit":
                unit: Unit = Unit(s, self)
                try:
                    options: ResultSet = s.find(SELECTION_ENTRIES, recursive=False).find_all(SELECTION_ENTRY)
                    # missing stuff
                    for o in options:
                        option: Option = Option(o, self)
                        if helper.entityExists(option.getId(), EXISTING_OPTIONS) == False:
                            self.__options.append(option)
                            EXISTING_OPTIONS.append(option.getId())
                        unit.linkOption(option.getId())                        
                except (AttributeError):
                    pass
                if helper.entityExists(unit.getId(), EXISTING_UNITS) == False:
                    self.__units.append(unit)
                    EXISTING_UNITS.append(unit.getId())
                self.__unitsIds.append(unit.getId())
            if type == "upgrade":
                self.addUpgrade(Upgrade(s, self))
            
    def __manageSharedSelectionEntries(self, entries: ResultSet):
        for e in entries:
            self.addUpgrade(Upgrade(e, self))

    def __manageSharedSelectionEntryGroups(self, groups: ResultSet):
        for c in groups:
            cat: SpecialItemsCategory = SpecialItemsCategory(c, self)
            if helper.entityExists(cat.getId(), EXISTING_ITEM_CATEGORIES) == False:
                self.addItemCategory(cat)
                EXISTING_ITEM_CATEGORIES.append(cat.getId())
            self.__itemCategories.append(cat.getId())
            
    def __manageSharedRules(self, rules: ResultSet):
        for r in rules:
            self.__rules.append(Rule(r))

    def __manageSharedProfiles(self, profiles: ResultSet):
        for p in profiles:
            self.addProfile(UnitProfile(p, isShared=True))

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
            unitCategories: str = json.dumps(self.__unitCategoryIds)
            rules: str = json.dumps(self.__rulesIds)
            upgradeCategories: str = json.dumps(self.__upgradeCategoryIds) 
            specialItemCategories: str = json.dumps(self.__itemCategoryIds)
            units: str = json.dumps(self.__unitsIds)
            upgrades: str = json.dumps(self.__upgradesIds)
            items: str = json.dumps(self.__itemsIds)
            cursor.execute(f"""INSERT INTO {ARMIES_TABLE} ({ID}, {NAME}, unit_categories, rules, upgrade_categories, special_item_categories, units, upgrades, items) VALUES (%s, %s, %s, %s, %s, %s, %s,%s, %s)""", (self.__id, self.__name, unitCategories, rules, upgradeCategories, specialItemCategories, units, upgrades, items))
            connexion.commit()
            for r in self.__rules:
                r.save(connexion, cursor)
            for c in self.__organisation:
                c.save(connexion, cursor)
            for p in self.__profiles:
                p.save(connexion, cursor)
            for c in self.__upgradeCategories:
                c.save(connexion, cursor)
            for u in self.__units:
                u.save(connexion, cursor)
            for o in self.__options:
                o.save(connexion, cursor)
            for u in self.__upgrades:
                u.save(connexion, cursor)
            for c in self.__itemCategories:
                c.save(connexion, cursor)
            for m in self.__modifiers:
                m.save(connexion, cursor)
            print("Done!")
        except (psycopg2.errors.UniqueViolation, psycopg2.errors.InFailedSqlTransaction):
            pass
        finally:
            connexion.close()

    def addRule(self, rule: Rule):

        for r in self.__rules:
            if r.getId() == rule.getId():
                return
        self.__rules.append(rule)
        self.__rulesIds.append(rule.getId())
    
    def addModifier(self, modifier: Modifier):
        if helper.entityExists(modifier.getId(), EXISTING_MODIFIERS) == False:
            self.__modifiers.append(modifier)

    def addItemCategory(self, category: SpecialItemsCategory):
        self.__itemCategories.append(category)
        self.__itemCategoryIds.append(category.getId())

    def addItem(self, item: Item):
        self.__items.append(item)
        self.__itemsIds.append(item.getId())

    def addProfile(self, profile: UnitProfile):
        if helper.entityExists(profile.getId(), EXISTING_PROFILES) == False:
            self.__profiles.append(profile)
            EXISTING_PROFILES.append(profile.getId())

    def addUpgrade(self, upgrade: Upgrade):
        if helper.entityExists(upgrade.getId(), EXISTING_UPGRADES) == False:
            self.__upgrades.append(upgrade)
            EXISTING_UPGRADES.append(upgrade.getId())
        self.__upgradesIds.append(upgrade.getId())
    
    def addUpgradeCategory(self, category: UpgradeCategory):
        if helper.entityExists(category.getId(), EXISTING_UPGRADE_CATEGORIES) == False:
            self.__upgradeCategories.append(category)
            EXISTING_UPGRADE_CATEGORIES.append(category.getId())
        self.__upgradeCategoryIds.append(category.getId())
