from numpy import array

from global_strings import *

##  
# @class Link represents the <infoLink> flag
#

class Link:
    _name: str = ""
    _id: str = ""
    _targetId: str = ""
    _type: str = ""
    _modifiers: array(str, []) = []

    def __init__(self, link):
        self._name = link[NAME]
        self._id = link[ID]
        self._targetId = link[TARGET_ID]
        self._type = link[TYPE]
        try: 
            for m in link.find(MODIFIERS).find_all(MODIFIER):
                self._modifiers.append(m.getText())
        except (AttributeError):
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