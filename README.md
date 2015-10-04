# Description

Outil de parsing de log du jeu [Pioneers](http://pio.sourceforge.net/). Cela n'a aucun autre intérêt que découvrir l'environnement de travail [Node.js](https://nodejs.org/en/) :
  * [NPM](https://www.npmjs.com/) pour la gestion des dépendances,
  * [Gulp](http://gulpjs.com/) pour le _build_,
  * [JSHint](http://jshint.com/) pour l'audit de qualité du code,
  * [Unit.js](http://unitjs.com/) pour écrire les tests unitaires,
  * [Mocha](http://mochajs.org/) pour exécuter les tests unitaires,
  * [Google Chrome](https://www.google.fr/chrome/browser/desktop/index.html) et `node-debug` pour la mise au point,
  * [Istanbul](https://github.com/gotwarlost/istanbul) pour avoir un rapport de couverture de code des tests unitaires,
  * [Log4js](https://www.npmjs.com/package/log4js) pour avoir un log configurable.

C'est aussi l'occasion de travailler avec [Git](http://www.git-scm.com/) et [GitHub.com](https://github.com/).

# Commandes utiles

## NPM

  * Exécuter les test : `npm test`
  * Exécuter les test avec couverture de code : `npm test --coverage`
     * Le rapport est dans `./coverage/lcov-report/index.html`
  * Exécuter en ligne de commande : `npm run main -- [args]`
  * Déboguer avec Chrome : `npm run debug -- [args]`
  * Déboguer les tests avec Chrome : `npm run debug-test -- [fichier js de test]`

Voir les commandes dans le fichier `package.json`.

## Gulp

  * Nettoyer les fichiers générés : `gulp clean`
  * Construire la version minifiée : `gulp scripts`
    * Le résultat est dans `./build`
  * Exécuter les tests avec couverture de code : `gulp test`
     * Le rapport est dans `./reports/coverage.html`

Voir les commandes dans le fichier `gulpfile.js`.

# Structure du projet

  * `src/js` : Sources
    * `main.js` : Programme en ligne de commande
    * `matchers.js` : Reconnaissance des lignes du fichier de log
    * `model.js` : Définition du modèle de données
    * `piolog.js` : Parser de log
  * `test/js` : Sources des tests
  * `log4js-config.json` : Exemple de configuration des loggers
  * `.jshinttc` : Configuration JSHint
  * `.gitignore` : Configuration Git
  * `gulpfile.js` : Script de build Gulp
  * `package.json` : Configuration NPM
  * `README.md` : Documentation du module