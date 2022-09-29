#!/usr/bin/env python3

import sys

from bs4 import BeautifulSoup, ResultSet
from numpy import array

import psycopg2
from configparser import ConfigParser


NAME: str = "name"
VALUE: str = "value"
TARGET_ID: str = "targetid"
TYPE: str = "type"

MODIFIERS: str = "modifiers"
MODIFIER: str = "modifier"

FIELD: str = "field"

PERCENT_VALUE: str = "percentvalue"

DESCRIPTION: str = "description"

CONDITIONS: str = "conditions"
CONDITION: str = "condition"

ID: str = "id"

CONSTRAINTS: str = "constraints"
CONSTRAINT: str = "constraint"

RULES: str = "rules"
RULE: str = "rule"

COSTS: str = "costs"
COST: str = "cost"

INFOLINKS: str = "infolinks"
INFOLINK: str = "infolink"

SELECTION_ENTRIES: str = "selectionentries"
SELECTION_ENTRY: str = "selectionentry"

ENTRY_LINKS: str = "entrylinks"
ENTRY_LINK: str = "entrylink"

COLLECTIVE: str = "collective"

SELECTION_ENTRY_GROUPS: str = "selectionentrygroups"
SELECTION_ENTRY_GROUP: str = "selectionentrygroup"

TYPENAME: str = "typename"

CHARACTERISTICS: str = "characteristics"
CHARACTERISTIC: str = "characteristic"

PROFILES: str = "profiles"
PROFILE: str = "profile"

CATEGORY_LINKS: str = "categorylinks"
CATEGORY_LINK: str = "categorylink"

CATALOGUE: str = "catalogue"

SHARED_SELECTION_ENTRIES: str = "sharedselectionentries"

FORCE_ENTRIES: str = "forceentries"
FORCE_ENTRY: str = "forceentry"

SHARED_SELECTION_ENTRY_GROUPS: str = "sharedselectionentrygroups"

SHARED_RULES: str = "sharedrules"

SHARED_PROFILES: str = "sharedprofiles"


ARMIES_TABLE: str = "armies"
RULES_TABLE: str = "rules"

##
# @class Link represents the <infoLink> flag
#

class Link:
    _name: str = ""
    _id: str = ""
    _type: str = ""
    _modifiers: array(str, []) = []

    def __init__(self, link):
        self._name = link[NAME]
        self._id = link[TARGET_ID]
        self._type = link[TYPE]
        try:
            modifiers = link.find(MODIFIERS).find_all(MODIFIER)
            for m in modifiers:
                self._modifiers.append(m.getText())
        except:
            self._modifiers = []
    
    ##
    # @brief Method used to print the Link content (used for debug)
    #

    def print(self):
        print("NAME:", self._name, "\tID:", self._id, "\tTYPE:", self._type)
        print("--- modifiers ---")
        for m in self._modifiers:
            print("  ", m)
        print("")

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

class Rule:
    # id: str
    __name: str = ""
    __description: str = ""

    def __init__(self, rule: ResultSet):
        self.__name = rule[NAME]
        self.__description = rule.find(DESCRIPTION).getText()

    def getName(self) -> str:
        return self.__name

    def getDescription(self) -> str:
        return self.__description

    def print(self):
        print("NAME:", self._name)
        print("DESCRIPTION:", self._description, "\n")

    def save(self, connexion, cursor):
        cursor.execute(f"""INSERT INTO {RULES_TABLE} ({NAME}, {DESCRIPTION}) VALUES (%s,%s)""", (self.__name, self.__description))
        connexion.commit()

class Modifier:
    _type: str = ""
    _value: str = ""
    _field: str = ""
    _conditions: array(str, [])

    def __init__(self, modifier):
        self._type = modifier[TYPE]
        self._value = modifier[VALUE]
        self._field = modifier[FIELD]

        try:
            for c in modifier.find(CONDITIONS).find_all(CONDITION):
                self._conditions.append(Condition(c))
        except:
            pass

class Option:
    pass

class Option:
    _unitId: str = ""
    _id: str = ""
    _name: str = ""
    _type: str = ""
    _parentId: str = ""

    _modifiers: array(Condition, []) = []

    _constraints: array(Condition, []) = []

    _rules: array(Rule, []) = []

    _cost: str = ""

    _subOptions: array(Option, []) = []

    _links: array(Link, []) = []

    def __init__(self, option, unitId: str):
        self._unitId = unitId
        self._name = option[NAME]
        self._id = option[ID]
        self._type = option[TYPE]

        try:
            modifiers = option.find(MODIFIERS).find_all(MODIFIER)
            for m in modifiers:
                for c in m.find(CONDITIONS).find_all(CONDITION):
                    self._modifiers.append(Condition(c))
        except:
            pass
        
        try:
            for c in option.find(CONSTRAINTS).find_all(CONSTRAINT):
                self._constraints.append(Condition(c))
        except:
            pass

        # print(option)
        try:
            for r in option.find(RULES).find_all(RULE):
                self._rules.append(Rule(r))
        except:
            pass
    
        self._cost = option.find(COSTS).find(COST)[VALUE] + " " + option.find(COSTS).find(COST)[NAME]

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
        except:
            pass
    
    def print(self):
        print("NAME:", self._name, "\tID:", self._id, "\tTYPE:", self._type, "\tCOST:", self._cost)
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
        except:
            pass
        # links
        try:
            for l in item.find(INFOLINKS).find_all(INFOLINK):
                self._links.append(Link(l))
        except:
            pass
        #cost
        try:
            self._cost = Cost(item.find(COSTS).find(COST))
        except:
            pass

        try:
            for s in item.find(SELECTION_ENTRIES).find_all(SELECTION_ENTRY):
                print(s[NAME])
        except:
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
        

    

class SpecialItemsCategory:
    _name: str = ""
    _id: str = ""
    _isCollective: str = ""

    _constraints: array(Condition, []) = []

    _items: array(Item, []) = []

    def __init__(self, entry):
        self._id = entry[ID]
        self._name = entry[NAME]
        self._isCollective = entry[COLLECTIVE]
        
        try:
            for c in entry.find(CONSTRAINTS).find_all(CONSTRAINT):
                self._constraints.append(Condition(c))
        except:
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


class Profile:
    _id: str = ""
    _name: str = ""
    _type: str = ""
    _characteristics: dict = None

    def __init__(self, profile):
        self._characteristics = dict()
        self._name = profile[NAME]
        self._id = profile[ID]
        self._type = profile[TYPENAME]

        for c in profile.find(CHARACTERISTICS, recursive=False).find_all(CHARACTERISTIC, recursive=False):
            self._characteristics[c[NAME]] = c.getText()
    
    def print(self):
        print("NAME:", self._name, "\tID:", self._id, "\tTYPE:", self._type)
        print("--- characteristics ---")
        print(self._characteristics)

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
        except:
            pass 
        # links
        try:
            for l in upgrade.find(INFOLINKS).find_all(INFOLINK):
                self._links.append(Link(l))
        except:
            pass
        # cost
        try:
            self._cost = Cost(upgrade.find(COSTS).find(COST))
        except:
            pass
        # modifiers
        try:
            for m in upgrade.find(MODIFIERS).find_all(MODIFIER):
                self._modifiers.append(Modifier(m))
        except:
            pass
        # profiles
        try:
            for p in upgrade.find(PROFILES).find_all(PROFILE):
                self._profiles.append(Profile(p))
        except:
            pass
        # rules
        try:
            for r in upgrade.find(RULES).find_all(RULE):
                self._rules.append(Rule(r))
        except:
            pass
        # selection entry groups
        try:
            for selec in upgrade.find_all(SELECTION_ENTRY_GROUPS):
                for s in selec.find_all(SELECTION_ENTRY_GROUP):
                    self._specialItemsCategories.append(SpecialItemsCategory(s))
        except:
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
    

##
# @class Unit
# @brief Represents a Unit object
#

class Unit:
    _id: str = ""
    _name: str = ""
    _categoryId: str = ""

    _cost: str = ""
    
    _links: array(Link, []) = []
    _options: array(Option, []) = []
    _profiles: array(Profile, []) = []

    def __init__(self, selection):
        self._id = selection[ID]
        self._name = selection[NAME]
        self._cost = selection.find(COSTS, recursive=False).find(COST)[VALUE] + " " + selection.find(COSTS, recursive=False).find(COST)[NAME]
        # profiles
        profiles: ResultSet = selection.find(PROFILES).find_all(PROFILE)
        for p in profiles:
            self._profiles.append(Profile(p))
        # infoLinks
        links: ResultSet = selection.find(INFOLINKS).find_all(INFOLINK)
        for link in links:
            self._links.append(Link(link))
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

class UnitCategory:
    _id: str = "" # targetid
    _name: str = ""
    _constraints: array(Condition) = []

    def __init__(self, category):
        self._id = category[TARGET_ID]
        self._name = category[NAME]
        try:
            for c in category.find(CONSTRAINTS).find_all(CONSTRAINT):
                self._constraints.append(Condition(c))
        except:
            pass

    def print(self):
        print("NAME:", self._name, "\tID:", self._id)

class UpgradeCategory:
    _id: str = ""
    _name: str = ""
    _collective: str = ""
    _constraints: array(Condition) = []
    _upgrades: array(Upgrade) = []
    _links: array(Link) = []

    def __init__(self, category):
        # print("\n\n\nCATEGORY\n", category, "\n\n\n")
        self._id = category[ID]
        self._name = category[NAME]
        self._collective = category[COLLECTIVE]
        for c in category.find(CONSTRAINTS).find_all(CONSTRAINT):
            self._constraints.append(Condition(c))
        # upgrades
        try:
            for u in category.find(SELECTION_ENTRIES).find_all(SELECTION_ENTRY):
                self._upgrades.append(Upgrade(u))
        except:
            pass
        # links
        try:
            for l in category.find(ENTRY_LINKS).find_all(ENTRY_LINK):
                self._links.append(Link(l))
        except:
            pass

    def print(self):
        print("NAME:", self._name, "\tID:", self._id, "\tCOLLECTIVE:", self._collective)
        print("--- constraints ---")
        for c in self._constraints:
            c.print()
        print("--- upgrades ---")
        for u in self._upgrades:
            u.print()

class Army:
    __name: str = ""
    __id: str = ""

    __organisation: array(UnitCategory) = []
    __units: array(Unit) = []
    __rules: array(Rule) = []
    __options: array(Option) = []
    __upgradeCategories: array(UpgradeCategory) = []
    __upgrades: array(Upgrade) = []
    __profiles: array(Profile) = []

    def __init__(self, soup: BeautifulSoup):
        catalogue = soup.find(CATALOGUE)
        self.__id = catalogue[ID]
        self.__name = catalogue[NAME]
        self.__manageCategoryLinks(catalogue.find(FORCE_ENTRIES).find(FORCE_ENTRY).find(CATEGORY_LINKS).find_all(CATEGORY_LINK))
        self.__manageSelectionEntries(catalogue.find(SELECTION_ENTRIES, recursive=False).find_all(SELECTION_ENTRY, recursive=False))
        self.__manageSharedSelectionEntries(catalogue.find(SHARED_SELECTION_ENTRIES, recursive=False).find_all(SELECTION_ENTRY, recursive=False))
        self.__manageSharedSelectionEntryGroups(catalogue.find(SHARED_SELECTION_ENTRY_GROUPS, recursive=False).find_all(SELECTION_ENTRY_GROUP))
        self.__manageSharedRules(catalogue.find(SHARED_RULES).find_all(RULE))
        self.__manageSharedProfiles(catalogue.find(SHARED_PROFILES).find_all(PROFILE))

    def __manageCategoryLinks(self, categories: ResultSet):
        for c in categories:
            self.__organisation.append(UnitCategory(c))

    def __manageSelectionEntries(self, selections: ResultSet):
        for s in selections:
            self.__units.append(Unit(s))
            try:
                options: ResultSet = s.find(SELECTION_ENTRIES, recursive=False).find_all(SELECTION_ENTRY)
                # missing stuff
                for o in options:
                    self.__options.append(Option(o))
            except:
                pass

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


    def __config(elf, filename="database.ini", section="postgresql"):
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
            params = self.__config()
            connexion = psycopg2.connect(**params)
            cursor = connexion.cursor()
            cursor.execute(f"""INSERT INTO {ARMIES_TABLE} ({ID}, {NAME}) VALUES (%s,%s)""", (self.__id, self.__name))
            connexion.commit()
            for r in self.__rules:
                r.save(connexion, cursor)

        except:
            raise Exception("an error occured")
        finally:
            connexion.close()
        

        
def main():
    args = sys.argv
    for filename in args:
        if (filename == args[0]):
            continue
        content = []
        with open(filename, "r") as file:
            content = file.readlines()
            content = "".join(content)
        soup = BeautifulSoup(content, features="lxml")
        army: Army = Army(soup)
        army.save()


if __name__ == "__main__":
    main()
