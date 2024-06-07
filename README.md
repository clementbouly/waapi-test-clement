# Rendu Clément Bouly - Test FIFO

## Start the application

Run `nx start backend` to start the backend server. <br>
Run `nx start frontend` to start the frontend server.

## Tests

Run `nx test backend` to run the backend tests.

## Commentaires sur le rendu

### Choix techniques

**Ces choix techniques ont été faits selon une contrainte de temps que j'ai définie pour moi-même.** <br>
Des Améliorations peuvent être apportées avec plus de temps et une définition plus précise des besoins.

Dans les évolutions possibles, on pourrait envisager :

- L'ajout de tests pour le frontend.
- Un modèle de données partagé entre le frontend et le backend grâce à un package généré par Nx.

### Choix effectués

- Utilisation de WebSockets pour la communication en temps réel entre le frontend et le backend.

  - Améliore l'expérience utilisateur en permettant de voir les changements en temps réel.

- Utilisation d'un fichier JSON pour stocker les données.

  - Permet de stocker les données de manière persistante sans avoir à utiliser une base de données.
  - Convient pour un projet de petite taille.
  - Pour un projet plus complexe avec une charge d'utilisateur plus importante, il serait préférable d'utiliser une base de données SQL ou NoSQL.
  - La structure de données actuelle est adaptée pour une base de données NoSQL.

- Les tests du backend ont été fait en utilisant une base de données de test.

  - Les tests sont indépendants de l'état de la base de données de développement.
  - Il aurait été aussi possible et plus scalable de mocker les appels à la base de données.

- Utilisation de framer-motion pour les animations plutôt qu'utiliser des animations CSS.
  - Permet d'animer l'ajout et la suppression d'éléments d'une liste de manière plus fluide.
  - Offre plus de possibilités d'animations futures.

### Packages ajoutés

- `socket.io-client` et 'socket.io' : Pour la communication en temps réel entre le frontend et le backend.
- `cors` : Pour autoriser les requêtes cross-origin.
- `framer-motion` : Pour les animations front-end.
