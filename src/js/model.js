/**
 * Provides model structure definition and some helper methods.
 *
 * @module model
 */
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
        podium: [],
        winner: null,
        turns: [{
            number: 0,
            strongestKnight: null,
            longestRoad: null,
            players: {}
        }],
        getLastTurnOfPlayer: function (playerName) {
            var lastTurn = this.getLastTurn().players;
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

            var turnOfPlayers = lastTurn.players;

            for (var attr in turnOfPlayers) {
                nbBonus = 0;
                if (turnOfPlayers.hasOwnProperty(attr)) {

                    nbColonies = turnOfPlayers[attr].colony;
                    if (nbColonies === undefined) nbColonies = 0;

                    nbCities = turnOfPlayers[attr].city;
                    if (nbCities === undefined) nbCities = 0;

                    if (attr === strongestKnight) nbBonus = nbBonus + 1;
                    if (attr === longestRoad) nbBonus = nbBonus + 1;

                    score = exports.getScore(nbColonies, nbCities, nbBonus);
                    turnOfPlayers[attr].score = score;
                }
            }

        }
    };
    return game;
};

function computeDiceTotalStats(game) {
    var retval = {
        byScore: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        totalNumber: 0
    };
    for (var i in game.turns) {
        var playersInTurn = game.turns[i].players;
        for (var playerName in playersInTurn) {
            var o = playersInTurn[playerName];
            if (o !== null && o.dice) {
                retval.byScore[o.dice - 2] = retval.byScore[o.dice - 2] + 1;
                retval.totalNumber = retval.totalNumber + 1;
            }
        }
    }
    return retval;
}


exports.__computeDiceByPlayerStats = function (game) {

    var byDiceArray = [];
    for (var po in game.playerOrder) {
        var byPlayer = {
            name: game.playerOrder[po],
            times: 0
        };
        byDiceArray.push(byPlayer);
    }

    var retval = [];
    for (var dice = 2; dice <= 12; dice++) {
        retval[dice] = exports.__clone(byDiceArray);
    }

    for (var i in game.turns) {
        var playersInTurn = game.turns[i].players;
        for (var playerName in playersInTurn) {
            var o = playersInTurn[playerName];
            if (o !== null && o.dice) {

                var byPlayerForDice = retval[o.dice];
                for (var bpfd in byPlayerForDice) {
                    if (byPlayerForDice[bpfd].name === playerName) {
                        byPlayerForDice[bpfd].times = byPlayerForDice[bpfd].times + 1;
                    }
                }

            }
        }
    }

    return retval;
};

exports.computeStats = function (game) {
    return {
        numberOfTurns: game.getLastTurnNumber(),
        dice: computeDiceTotalStats(game),
        diceByPlayer: exports.__computeDiceByPlayerStats(game)
    };
};
