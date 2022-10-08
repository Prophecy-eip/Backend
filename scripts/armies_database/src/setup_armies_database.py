#!/usr/bin/env python3

import glob
import os
import shutil

from bs4 import BeautifulSoup # , ResultSet
from numpy import array

# import psycopg2
# from configparser import ConfigParser

# import json

# import uuid

import git

# import helper
from global_strings import * 
# from link import Link
# from cost import Cost
# from condition import Condition
# from rule import Rule
# from modifier import Modifier
# from option import Option
# from item import Item, SpecialItemsCategory
# from profile import Profile
# from upgrade import Upgrade, UpgradeCategory
# from unit import Unit, UnitCategory
from army import Army


def main():

    dirpath = f"./{REPOSITORY_NAME}"

    if os.path.exists(dirpath):
        shutil.rmtree(dirpath)

    print(f"Cloning {REPOSITORY_NAME } repository...")
    git.Git(".").clone("https://github.com/BSData/The-9th-Age.git")
    print("Repository succesfully cloned!")

    filenames = [f for f in glob.glob(f"./{REPOSITORY_NAME}/*.cat")]
    
    for filename in filenames:
        if filename.find("2") != -1:
            continue
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
