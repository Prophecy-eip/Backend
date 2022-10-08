#!/usr/bin/env python3

import glob
import os
import shutil
from bs4 import BeautifulSoup # , ResultSet
from numpy import array
import git

from global_strings import * 
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
