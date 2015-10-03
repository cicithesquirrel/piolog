"use strict";

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
        game.winner = name;
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
        var name = matched[1],
            turnOfPlayer = game.getLastTurnOfPlayer(name);
        if (turnOfPlayer.road) {
            turnOfPlayer.road = turnOfPlayer.road - 1;
        } else {
            turnOfPlayer.road = -1;
        }
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
    var match, m, i, nbMatchers = myMatchers.length;
    for (i = 0; i < nbMatchers; i = i + 1) {
        m = myMatchers[i];
        match = message.match(m.pattern);
        if (match) {
            m.onMatch(match, game);
            return;
        }
    }
};
