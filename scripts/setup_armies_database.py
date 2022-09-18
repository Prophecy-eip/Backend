#!/usr/bin/env python3

import sys

from bs4 import BeautifulSoup, ResultSet
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
        #         groups: ResultSet = option.find("selectionentrygroups").find_all("selectionentrygroup")
                
        #         print("+++\n", groups, "\n+++++")

        #         print(groups.__len__())
        #         for opt in groups:
        #             try:
        #                 opt = Option(opt, unitId)
        #                 self._subOptions.append(opt)
        #                 opt.print()
        #             except:
        #                 pass
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

    def __init__(self, item):
        self._name = ""

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
        
        for c in entry.find("constraints").find_all("constraint"):
            self._constraints.append(Condition(c))
        
        for item in entry.find("selectionentrygroups").find_all("selectionentrygroup"):
            self._items.append(Item(item))


##
# @class Unit
# @brief Represents a Unit object
#

class Unit:
    _id: str = ""
    _name: str = ""
    _categoryId: str = ""

    _cost: str = ""
    
    _height: str = ""
    _type: str = ""
    _base: str = ""

    _adv: str = ""
    _mar: str = ""
    _dis: str = ""
    _globalRules: str = ""

    _hp: str = ""
    _def: str = ""
    _res: str = ""
    _arm: str = ""
    _defensiveRules: str = ""

    _att: str = ""
    _off: str = ""
    _str: str = ""
    _ap: str = ""
    _agi: str = ""
    _offensiveRules: str = ""
    
    _links: array(Link, []) = []
    _options: array(Option, []) = []
    # options: array(Option, [])

    def __init__(self, selection):
        self._id = selection["id"]
        self._name = selection["name"]
        self._cost = selection.find("costs", recursive=False).find("cost")["value"] + " " + selection.find("costs", recursive=False).find("cost")["name"]
        
        # profiles
        profiles: ResultSet = selection.find("profiles").find_all("profile")
        for profile in profiles:
            name: str = profile["name"]
            c = profile.find("characteristics")
            if name.find("Global") != -1:
                self._adv = c.find("characteristic", {"name": "Adv"}).getText()
                self._mar = c.find("characteristic", {"name": "Mar"}).getText()
                self._dis =  c.find("characteristic", {"name": "Dis"}).getText()
                self._globalRules = c.find("characteristic", {"name": "Rules"}).getText()
            if name.find("Defensive") != -1:
                self._hp =  c.find("characteristic", {"name": "HP"}).getText()
                self._def =  c.find("characteristic", {"name": "Def"}).getText()
                self._res =  c.find("characteristic", {"name": "Res"}).getText()
                self._arm =  c.find("characteristic", {"name": "Arm"}).getText()
                self._defensiveRules = c.find("characteristic", {"name": "Rules"}).getText()
            if name.find("Offensive") != -1:
                self._att = c.find("characteristic", {"name": "Att"}).getText()
                self._off = c.find("characteristic", {"name": "Off"}).getText()
                self._str = c.find("characteristic", {"name": "Str"}).getText()
                self._ap = c.find("characteristic", {"name": "AP"}).getText()
                self._agi = c.find("characteristic", {"name": "Agi"}).getText()
                self._offensiveRules = c.find("characteristic", {"name": "Rules"}).getText()
            if name.find("Size") != -1:
                self._height = c.find("characteristic", {"name": "Height"}).getText()
                self._type = c.find("characteristic", {"name": "Type"}).getText()
                self._base = c.find("characteristic", {"name": "Base"}).getText()
        
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
        print("NAME:", self._name)
        print("ID:  ", self._id)
        print("CATEGORY: ", self._categoryId)
        print("COST:", self._cost)
        print("SIZE:\t\theight:", self._height, "\ttype:", self._type, "\t\tbase:", self._base)
        print("GLOBAL:\t\tadv:", self._adv, "\tmar:", self._mar, "\tdis:", self._dis)
        print("GOBAL RULES:", self._globalRules)
        print("DEFENSIVE:\thp:", self._hp, "\t\tdef:", self._def, "\t\tres:", self._res, "\t\tarm:", self._arm)
        print("DEFENSIVE RULES:", self._defensiveRules)
        print("OFFENSIVE:\tatt:", self._att, "\t\toff:", self._off, "\t\tstr:", self._str, "\t\tap:", self._ap, "\t\tagi: ", self._agi)
        print("OFFENSIVE RULES:", self._offensiveRules)
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
        options: ResultSet = s.find("selectionentries", recursive=False).find_all("selectionentry")
        # missing stuff
        for o in options:
            option: Option = Option(o, unit._id)
            # option.print()
            unit.linkOption(option)
            # option.print()
        unit.print()
        # print("cost:\n", cost["value"])


def parseFile(soup: BeautifulSoup):
    catalogue = soup.find("catalogue")#.findAll("categoryEntries", recursive=False)
    # TODO: add force entries
    manageSelectionEntries(catalogue.find("selectionentries", recursive=False).find_all("selectionentry", recursive=False))
    
    
        
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
