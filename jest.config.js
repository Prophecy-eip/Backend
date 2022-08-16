const path = require("path");

module.exports = {
    "moduleFileExtensions": [
        "js",
        "json",
        "ts"
      ],
      "rootDir": "test",
      "testRegex": "\\**/.*\\.spec\\.ts$",
      "transform": {
        "^.+\\.(t|j)s$": "ts-jest"
      },
      "collectCoverageFrom": [
        "**/*.(t|j)s"
      ],
      "coverageDirectory": "../coverage",
      "testEnvironment": "node",
      "moduleDirectories": [
        "node_modules",
        "src",
        "<rootDir>/src/*"
      ],
      "moduleNameMapper": {
        "src/(.*)": "<rootDir>/../src/$1"
      }
}