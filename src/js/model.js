"use strict";

exports.__clone = function (obj) {
    if (null === obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        copy[attr] = exports.__clone(obj[attr]);
    }
    return copy;
};

exports.getScore = function (nbColony, nbCity, nbBonus) {
    var score = nbColony + 2 * nbCity + 2 * nbBonus;
    return score;
};

exports.newGame = function () {
    var game = {
        startDate: null,
        endDate: null,
        playerOrder: [],
        winner: null,
        turns: [{
            number: 0,
            strongestKnight: null,
            longestRoad: null
        }],
        getLastTurnOfPlayer: function (playerName) {
            var lastTurn = this.getLastTurn();
            if (!lastTurn[playerName]) {
                lastTurn[playerName] = {};
            }
            return lastTurn[playerName];
        },
        getLastTurn: function () {
            var lastTurn = this.turns[this.turns.length - 1];
            return lastTurn;
        },
        getLastTurnNumber: function () {
            return this.turns.length - 1;
        },
        startNextTurn: function () {
            this.updateScoreOfLastTurn();
            var lastTurn = this.turns[this.turns.length - 1],
                cloned;
            cloned = exports.__clone(lastTurn);
            cloned.number = cloned.number + 1;
            this.turns.push(cloned);
        },
        updateScoreOfLastTurn: function () {
            var lastTurn = this.getLastTurn(),
                strongestKnight = lastTurn.strongestKnight,
                longestRoad = lastTurn.longestRoad,
                score, nbColonies, nbCities, nbBonus;

            for (var attr in lastTurn) {
                nbBonus = 0;
                if (attr !== "strongestKnight" &&
                    attr !== "longestRoad" &&
                    attr !== "number" &&
                    lastTurn.hasOwnProperty(attr)) {

                    nbColonies = lastTurn[attr].colony;
                    if (nbColonies === undefined) nbColonies = 0;

                    nbCities = lastTurn[attr].city;
                    if (nbCities === undefined) nbCities = 0;

                    if (attr === strongestKnight) nbBonus = nbBonus + 1;
                    if (attr === longestRoad) nbBonus = nbBonus + 1;

                    score = exports.getScore(nbColonies, nbCities, nbBonus);
                    lastTurn[attr].score = score;
                }
            }

        }
    };
    return game;
};
