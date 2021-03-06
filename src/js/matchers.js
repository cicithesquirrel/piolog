/**
 * Provides log line parser, with resulting actions that modify the model.
 *
 * @module matchers
 */
"use strict";

var log4js = require('log4js');
var logger = log4js.getLogger("piolog.matchers");

var myMatchers = [{
    pattern: /Le joueur (\d+) s'appelle maintenant (.+)\.$/,
    onMatch: function (matched, game) {
        var name = matched[2],
            number = matched[1];
        game.playerOrder[number] = name;
    }
    }, {
    pattern: /(.+) a gagné la partie avec (\d+) points de victoire !$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            score = matched[2];

        game.updateScoreOfLastTurn();

        var playersInLastTurn = game.getLastTurn().players;
        for (var playerName in playersInLastTurn) {
            var player = playersInLastTurn[playerName];
            game.podium.push({
                name: playerName,
                score: player.score
            });
        }

        game.podium.sort(function (o1, o2) {
            return o2.score - o1.score;
        });

        if (game.podium[0]) {
            game.winner = game.podium[0].name;
        }
    }
    }, {
    pattern: /(.+) fonde une colonie.$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            turnOfPlayer = game.getLastTurnOfPlayer(name);
        if (turnOfPlayer.colony) {
            turnOfPlayer.colony = turnOfPlayer.colony + 1;
        } else {
            turnOfPlayer.colony = 1;
        }
    }
    }, {
    pattern: /(.+) construit une route.$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            turnOfPlayer = game.getLastTurnOfPlayer(name);
        if (turnOfPlayer.road) {
            turnOfPlayer.road = turnOfPlayer.road + 1;
        } else {
            turnOfPlayer.road = 1;
        }
    }
    }, {
    pattern: /(.+) retire une route.$/,
    onMatch: function (matched, game) {
        var name = matched[1];
        var turnOfPlayer = game.getLastTurnOfPlayer(name);
        turnOfPlayer.road = turnOfPlayer.road - 1;
    }
    }, {
    pattern: /(.+) retire une colonie.$/,
    onMatch: function (matched, game) {
        var name = matched[1];
        var turnOfPlayer = game.getLastTurnOfPlayer(name);
        turnOfPlayer.colony = turnOfPlayer.colony - 1;
    }
    }, {
    pattern: /(.+) retire une ville.$/,
    onMatch: function (matched, game) {
        var name = matched[1];
        var turnOfPlayer = game.getLastTurnOfPlayer(name);
        turnOfPlayer.city = turnOfPlayer.city - 1;
        turnOfPlayer.colony = turnOfPlayer.colony + 1;
    }
    }, {
    pattern: /(.+) érige une ville.$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            turnOfPlayer = game.getLastTurnOfPlayer(name);
        if (turnOfPlayer.colony) {
            turnOfPlayer.colony = turnOfPlayer.colony - 1;
        } else {
            turnOfPlayer.colony = -1;
        }
        if (turnOfPlayer.city) {
            turnOfPlayer.city = turnOfPlayer.city + 1;
        } else {
            turnOfPlayer.city = 1;
        }
    }
    }, {
    pattern: /(.+) a la route la plus longue.$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            lastTurn = game.getLastTurn();

        lastTurn.longestRoad = name;
    }
    }, {
    pattern: /(.+) détient le chevalier le plus puissant.$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            lastTurn = game.getLastTurn();
        lastTurn.strongestKnight = name;
    }
    }, {
    pattern: /(.+) a fait (\d+).$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            turnOfPlayer = game.getLastTurnOfPlayer(name),
            dice = parseInt(matched[2]);

        turnOfPlayer.dice = dice;
    }
    }, {
    pattern: /(.+) joue la carte de développement (.+).$/,
    onMatch: function (matched, game) {
        var name = matched[1],
            turnOfPlayer = game.getLastTurnOfPlayer(name),
            card = matched[2];

        if (!turnOfPlayer.cards) turnOfPlayer.cards = {};
        if (!turnOfPlayer.cards[card]) turnOfPlayer.cards[card] = 0;
        turnOfPlayer.cards[card] = turnOfPlayer.cards[card] + 1;
    }
    }, {
    pattern: /Début du tour (\d+) pour (.+).$/,
    onMatch: function (matched, game) {
        var name = matched[2],
            turnNumber = matched[1];

        if (turnNumber > game.getLastTurnNumber()) {
            game.startNextTurn();
        }
    }
    }];

exports.match = function (message, game) {
    var nbMatchers = myMatchers.length;
    for (var i = 0; i < nbMatchers; i = i + 1) {
        var m = myMatchers[i];
        var match = message.match(m.pattern);
        if (match) {
            logger.debug("Match found: " + message);
            m.onMatch(match, game);
            return;
        }
    }
    logger.trace("Ignored line: " + message);
};
