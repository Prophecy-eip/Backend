#!/usr/bin/env python3

from re import sub
import xml.etree.ElementTree as ET
import sys

from numpy import array

## UTILS

##
# @brief Formats a tag by removing the prefix
#

def formatTag(tag: str):
    return tag.split('}', 1)[1]

##
# @brief Finds a sub element with a specific tag
#

def findSubelemByTag(elem: ET.Element, tag: str) -> ET.Element | None:
    foud: ET.Element | None = None

    for subelem in elem:
        if formatTag(subelem.tag) == tag:
            return subelem
        else :
            found = findSubelemByTag(subelem, tag)
        if found != None:
            return found

##
# @brief Finds out if an element has the specified attribute
# @return true if was found, false otherwise
#

def hasAttrib(elem: ET.Element, attrib: str) -> bool:
    try:
        a = elem.attrib[attrib]
        return True
    except:
        return False

##
# @brief Finds a sub element with a specific name
#

def findSubElemByName(elem: ET.Element, name: str) -> ET.Element | None :
    found: ET.Element | None = None

    for subelem in elem:
        if hasAttrib(subelem, "name") == False:
            return findSubElemByName(subelem, name)
        # print("expected: ", name)
        # print("current: ", subelem.attrib["name"])
        if subelem.attrib["name"] == name:
            return subelem
        else :
            found = findSubElemByName(subelem, name) 
        if found != None:
            print("")
            return found
        
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
    _globalRules: array(str, [])

    _hp: str = ""
    _def: str = ""
    _res: str = ""
    _arm: str = ""
    _defensiveRulenes: array(str, [])

    _att: str = ""
    _off: str = ""
    _str: str = ""
    _ap: str = ""
    _agi: str = ""
    _offensiveRules: array(str, [])

    # options: array(Option, [])

    def __init__(self, elem: ET.Element):
        self._id = elem.attrib["id"]
        self._name = elem.attrib["name"]

        profiles = findSubelemByTag(elem, "profiles")
        for profile in profiles:
            name: str = profile.attrib["name"]
            # characteristics = findSubelemByTag(profile, "characteristics")
            if name.find("Global") != -1:
                self._adv = findSubElemByName(profile, "Adv").text
                self._mar = findSubElemByName(profile, "Mar").text
                self._dis = findSubElemByName(profile, "Dis").text
                # TODO: Add rules
            if name.find("Defensive") != -1:
                self._hp = findSubElemByName(profile, "HP").text
                self._def = findSubElemByName(profile, "Def").text
                self._res = findSubElemByName(profile, "Res").text
                self._arm = findSubElemByName(profile, "Arm").text
                # TODO: Add rules
            if name.find("Offensive") != -1:
                self._att = findSubElemByName(profile, "Att").text
                self._off = findSubElemByName(profile, "Off").text
                self._str = findSubElemByName(profile, "Str").text
                self._ap = findSubElemByName(profile, "AP").text
                self._agi = findSubElemByName(profile, "Agi").text
                # TODO: Add rules
            if name.find("Size") != -1:
                self._height = findSubElemByName(profile, "Height").text
                self._type = findSubElemByName(profile, "Type").text
                self._base = findSubElemByName(profile, "Base").text

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
        # print("GOBAL RULES:" self._globalRules)
        print("DEFENSIVE:\thp:", self._hp, "\t\tdef:", self._def, "\t\tres:", self._res, "\t\tarm:", self._arm)
        print("OFFENSIVE:\tatt:", self._att, "\t\toff:", self._off, "\t\tstr:", self._str, "\t\tap:", self._ap, "\t\tagi: ", self._agi)

class Option:
    id: str
    name: str

    cost: str

class UnitType:
    id: str
    name: str
    limit: str

class Rule:
    id: str
    name: str
    description: str

class Army:
    _organisation: list = []
    _units: list = []

    def addUnit(self, unit: Unit):
        self._units.append(unit)

##
# @brief Manages force entries (army organisation)
#

def forceEntries(elem: ET.Element, army: Army) -> Army:
    for subelem in elem:
        if formatTag(subelem.tag) == "categoryLink":
            print("id:", subelem.attrib["id"])
            print("name:", subelem.attrib["name"])
            for subsubelem in subelem:
                for subsubsubelem in subsubelem:
                    if formatTag(subsubsubelem.tag) == "constraint":
                        print("limit: ", subsubsubelem.attrib["type"], subsubsubelem.attrib["value"])
        army = forceEntries(subelem, army)
    return army

##
# @brief Fills the army with a new unit
#

def unit(elem: ET.Element, army: Army) -> Army:
    print("==== UNIT ====")
    unit: Unit = Unit(elem)

    unit.print()
    army._units.append(unit)

    for subElem in elem:
        army = selectionEntries(subElem, army)
        # army = fillArmy(subElem, army)
    # profiles = findSubelemByTag(elem, "profiles")
    # for profile in profiles:
    #     # print(profile.attrib["name"])
    #     characteristics = findSubelemByTag(profile, "characteristics")
    #     for c in characteristics:
    #         print("", end="")
    #         # print(" ", c.attrib["name"], c.text)
    return army

##
# @brief Fills the army with a new rule
#

def rule(elem: ET.Element, army: Army) -> Army:
    print("==== RULE ====")
    return army

## 
# @brief Fills the army with a new upgrade (option)
#  

def upgrade(elem: ET.Element, army: Army) -> Army:
    print("==== UPGRADE ====")
    return army

##
# @brief Manages the selection entries tags
# selection entries contain units, rules, options, ... definitions
#

def selectionEntries(elem: ET.Element, army: Army) -> Army:
    for subelem in elem:
        tag = formatTag(subelem.tag)
        print("\n\n", tag, "\n")
        if tag == "selectionEntry":
            type = subelem.attrib["type"]
            print("\n\n", type, "\n")
            if type == "unit":
                army = unit(subelem, army)
            if type == "rule":
                army = rule(subelem)
            if type == "upgrade":
                army = upgrade(subelem, army)
    return army

##
# @brief Fills the army by parsing the document
#

def fillArmy(elem: ET.Element, army: Army) -> Army:
    
    tag = formatTag(elem.tag)
    if tag == "forceEntries": # army organisation
        print("==== FORCE ENTRIES ====")
        army = forceEntries(elem, army)
    elif tag == "selectionEntries": # unit/rule/...
        print ("==== SELECTION ENTRIES ====")
        army = selectionEntries(elem,army)
    else :
        for subelem in elem:
            army = fillArmy(subelem, army) 

    return army

def main():
    args = sys.argv
    
    for filename in args:
        army: Army = Army()
        if (filename == args[0]):
            continue
        tree = ET.parse(filename)
        root = tree.getroot()

        for elem in root:
            army = fillArmy(elem, army)
        


if __name__ == "__main__":
    main()
