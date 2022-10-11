#!/usr/bin/env python3

import glob
import os
import shutil
import sys
from bs4 import BeautifulSoup
from numpy import array
import git

from global_strings import * 
from army import Army

def displayUsage():
    print("USAGE: ./setup_armies_database.py [OPTIONS]...\n")
    print("OPTIONS:")
    print("\t-h\t--help\t\tDisplay this help")
    print("\t\t--clone\t\tClone the armies repositories if it ALREADY EXISTS")

def main():
    args: list[str] = sys.argv
    dirpath = f"./{REPOSITORY_NAME}"
    clone: bool = False
    dirExists: bool = os.path.exists(dirpath)

    for arg in args:
        if arg == "-h" or arg == "--help":
            return displayUsage()
        if arg == "--clone":
            clone = True

    if dirExists and clone:
        shutil.rmtree(dirpath)
        dirExists = False

    if dirExists == False or clone:     
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
