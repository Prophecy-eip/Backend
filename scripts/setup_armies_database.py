#!/usr/bin/env python3

import sys
from typing import Dict

from bs4 import BeautifulSoup, ResultSet
from dotenv import set_key
from numpy import array


##
# @class Link represents the <infoLink> flag
#

class Link:
    _name: str = ""
    _id: str = ""
    _type: str = ""
    _modifiers: array(str, []) = []

    def __init__(self, link):
        self._name = link["name"]
        self._id = link["targetid"]
        self._type = link["type"]
        try:
            modifiers = link.find("modifiers").find_all("modifier")
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
        self._name = cost["name"]
        self._value = cost["value"]

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
        self._field = condition["field"]
        self._value = condition["value"]
        self._percentValue = condition["percentvalue"]
        self._type = condition["type"]

    def toString(self) -> str:
        s: str = self._field + " " + self._type + " " + self._value

        if self._percentValue == "true":
            s += " %"
        return s

    def print(self):
        print("FIELD:", self._field, "\tVALUE:", self._value, "\tPERCENT:", self._percentValue, "\tTYPE:", self._type, "\n")

class Rule:
    # id: str
    _name: str
    _description: str

    def __init__(self, rule):
        self._name = rule["name"]
        self._description = rule.find("description").getText()

    def print(self):
        print("NAME:", self._name)
        print("DESCRIPTION:", self._description, "\n")

class Modifier:
    _type: str = ""
    _value: str = ""
    _conditions: array(str, [])

    def __init__(self, modifier):
        self._type = modifier["type"]
        self._value = modifier["value"]

        try:
            for c in modifier.find("conditions").find_all("condition"):
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
        self._name = option["name"]
        self._id = option["id"]
        self._type = option["type"]

        try:
            modifiers = option.find("modifiers").find_all("modifier")
            for m in modifiers:
                for c in m.find("conditions").find_all("condition"):
                    self._modifiers.append(Condition(c))
        except:
            pass
        
        try:
            for c in option.find("constraints").find_all("constraint"):
                self._constraints.append(Condition(c))
        except:
            pass

        # print(option)
        try:
            for r in option.find("rules").find_all("rule"):
                self._rules.append(Rule(r))
        except:
            pass
    
        self._cost = option.find("costs").find("cost")["value"] + " " + option.find("costs").find("cost")["name"]

#  TODO: try to add selection entry group
        # try:
        #     groups: ResultSet = option.find("selectionentrygroups").find_all("selectionentrygroup")

        #     for opt in groups:
        #         for o in opt.find("selectionentrygroups").find_all("selectionentrygroup"): 
        #             print(o)    
        #             self._subOptions.append(Option(o))
        #             # for z in x:
        #             #     print(z["name"])
        # except:
        #     pass

        try:
            for l in option.find("entrylinks").find_all("entrylink"):
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
        self._name = item["name"]
        self._id = item["id"]
        self._type = item["type"]
        # constraints
        try:
            for c in item.find("constraints").find_all("constraint"):
                self._constraints.append(Condition(c))
        except:
            pass
        # links
        try:
            for l in item.find("infolinks").find_all("infolink"):
                self._links.append(Link(l))
        except:
            pass
        #cost
        try:
            self._cost = Cost(item.find("costs").find("cost"))
        except:
            pass

    

class SpecialItemsCategory:
    _name: str = ""
    _id: str = ""
    _isCollective: str = ""

    _constraints: array(Condition, []) = []

    _items: array(Item, []) = []

    def __init__(self, entry):
        self._id = entry["id"]
        self._name = entry["name"]
        self._isCollective = entry["collective"]
        
        try:
            for c in entry.find("constraints").find_all("constraint"):
                self._constraints.append(Condition(c))
        except:
            pass
        for item in entry.find("selectionentrygroups").find_all("selectionentrygroup"):
            self._items.append(Item(item))


class Profile:
    _id: str = ""
    _name: str = ""
    _type: str = ""
    _characteristics: dict = None

    def __init__(self, profile):
        self._characteristics = dict()
        self._name = profile["name"]
        self._id = profile["id"]
        self._type = profile["typename"]

        for c in profile.find("characteristics", recursive=False).find_all("characteristic", recursive=False):
            self._characteristics[c["name"]] = c.getText()
    
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
        self._name = upgrade["name"]
        self._id = upgrade["id"]
        self._collective = upgrade["collective"]
        # constraints
        try:
            for c in upgrade.find("constraints").find_all("constraint"):
                self._constraint.apend(Condition(c))
        except:
            pass 
        # links
        try:
            for l in upgrade.find("infolinks").find_all("infolink"):
                self._links.append(Link(l))
        except:
            pass
        # cost
        try:
            self._cost = Cost(upgrade.find("costs").find("cost"))
        except:
            pass
        # modifiers
        try:
            for m in upgrade.find("modifiers").find_all("modifier"):
                self._modifiers.append(Modifier(m))
        except:
            pass
        # profiles
        try:
            for p in upgrade.find("profiles").find_all("profile"):
                self._profiles.append(Profile(p))
        except:
            pass
        # rules
        try:
            for r in upgrade.find("rules").find_all("rule"):
                self._rules.append(Rule(r))
        except:
            pass
        # selection entry groups
        try:
            for c in upgrade.find("selectionentrygroups").find_all("selectionentrygroup"):
                self._specialItemsCategories.append(SpecialItemsCategory(c))
        except:
            pass


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
        self._id = selection["id"]
        self._name = selection["name"]
        self._cost = selection.find("costs", recursive=False).find("cost")["value"] + " " + selection.find("costs", recursive=False).find("cost")["name"]
        # profiles
        profiles: ResultSet = selection.find("profiles").find_all("profile")
        for p in profiles:
            self._profiles.append(Profile(p))
        # infoLinks
        links: ResultSet = selection.find("infolinks").find_all("infolink")
        for link in links:
            self._links.append(Link(link))

        # categoryLinks
        self._categoryId = selection.find("categorylinks").find("categorylink")["targetid"]
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

def manageSelectionEntries(selections: ResultSet):

    for s in selections:
        unit: Unit = Unit(s)
        print("___")
        try:
            options: ResultSet = s.find("selectionentries", recursive=False).find_all("selectionentry")
            # missing stuff
            for o in options:
                option: Option = Option(o, unit._id)
                unit.linkOption(option)
        except:
            pass
        unit.print()

def manageSharedSelectionEntries(entries: ResultSet) -> array(Upgrade, []):
    upgrades: array(Upgrade, []) = []

    for e in entries:
        upgrades.append(Upgrade(e))
    return upgrades


def parseFile(soup: BeautifulSoup):
    catalogue = soup.find("catalogue")#.findAll("categoryEntries", recursive=False)
    # TODO: add force entries
    manageSelectionEntries(catalogue.find("selectionentries", recursive=False).find_all("selectionentry", recursive=False))
    a: array(Upgrade) = manageSharedSelectionEntries(catalogue.find("sharedselectionentries", recursive=False).find_all("selectionentry", recursive=False))
    for x in a:
        print(x._name)
        for i in x._specialItemsCategories:
            print("  " + i._name)
    
    
        
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
        army = parseFile(soup)
#         army: Army = Army()


if __name__ == "__main__":
    main()
