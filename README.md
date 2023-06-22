# Projet IOT : Système de Livraison de Bagages dans un Aéroport avec IoT

## Table des Matières

- [Équipe de Développement](#équipe-de-développement)
- [Introduction](#introduction)
- [Fonctionnalités réaliser](#fonctionnalités)
- [Montage Physique](#montage-physique)
- [Lancement du projet](#Lancement-du-projet)
- [URLs du projet](#URLs-du-projet)
- [Partie Node RED](#Partie-Node-RED)
- [Éthique et Utilisation Responsable](#éthique-et-utilisation-responsable)

## Équipe de Développemen
### DERBAL Younes 
### MBOUP Mouhamadou Lamine
### SAURY Jean
### TOUHARDJI Hamza
 
## Introduction

Ce projet consiste en un système de livraison de bagages dans un aéroport. Il s'agit d'un réseau de capteurs et d'actionneurs pilotés par le système d'information (SI) de l'aéroport, interagissant avec les SI des compagnies aériennes via des communications Machine-to-Machine (M2M).

## Fonctionnalités réaliser 

- L'association des points de livraison à un vol est décidée par un utilisateur employé de l'aéroport.
- Les identifiants RFID des bagages sont communiqués par les SI des compagnies au SI de l'aéroport.
- Les SI des compagnies sont informés des changements d'état de la livraison des bagages.
- En cas d'anomalie, le bagage est dérouté vers un service dédié et les SI concernés sont notifiés.
- Une interface permet aux employés de l'aéroport de suivre en temps réel la distribution des bagages.

## Montage Physique

- Trois microcontrôleurs Arduino UNO sont utilisés.
- Le premier microcontrôleur est relié au capteur RFID et à un détecteur de passage (LED + capteur infrarouge) à l'entrée du tapis.
- Le second microcontrôleur est relié à un détecteur de passage à la sortie du tapis, à un moteur pour faire rouler le tapis. 
- Le dernier microcontrôleur est pour réaliser l'aiguillage, et relier à un écran LCD.
- Les microcontrôleurs communiquent en envoyant des messages.

## Lancement du projet

Le publisher
```node mqtt-client-pub.js```

Le subscriber :
```node mqtt-client-sub.js```

IP de la VM :
192.168.78.97

## URLs du projet

Serveur Node RED : 
```http://192.168.78.97/```

## Partie Node RED
### 1.3. Utilisation de la bibliothèque de composants node-red

Accédez au shell du conteneur Docker :
```sudo docker exec -it 64ca0d2c293e /bin/bash```

Configurer le proxy dans NPM :
```npm config set proxy "http://proxy.univ-lyon1.fr:3128"```

Vérifier si la configuration a été correctement appliquée :
```npm config get proxy```

## Éthique et Utilisation Responsable

### Introduction

Le système de livraison de bagages dans un aéroport avec l'Internet des Objets (IoT) doit être développé et déployé en tenant compte de divers principes éthiques et de responsabilité. Ces principes sont essentiels pour gagner la confiance des utilisateurs et pour garantir que la technologie soit utilisée de manière bénéfique.

### Action Humaine et Contrôle Humain

Pour respecter l'autonomie humaine, le système doit permettre un contrôle humain significatif sur son fonctionnement. Il est essentiel que les employés de l'aéroport aient la capacité de superviser et d'intervenir si nécessaire. Par exemple, les employés de l'aéroport doivent avoir la capacité de superviser et d'intervenir, par exemple lorsqu'un bagage est mal acheminé ou perdu. Le système doit intégrer des approches telles que "Human in the loop" pour garder les employés aux commandes, "Human on the loop" pour leur permettre de surveiller le fonctionnement, et "Human in control" pour leur donner le contrôle de l'activité globale.

### Robustesse Technique et Fiabilité

Le système doit être conçu avec un haut niveau de robustesse et de fiabilité. Cela implique d'assurer la précision, la fiabilité et la reproductibilité des processus. Des plans de secours et de sécurité doivent être mis en place pour protéger les données et les services. De plus, le système doit être résilient aux attaques et sécurisé, en particulier compte tenu de la vulnérabilité des systèmes IoT.Ceci peut être assuré par la mise en place de mécanismes de redondance et de reprise après sinistre, comme l'utilisation de plusieurs serveurs MQTT. Cela garantit que le système continue de fonctionner même en cas de défaillance d'un serveur.

### Respect de la Vie Privée et Gouvernance des Données

Le respect de la vie privée des passagers et des employés est primordial. Le système doit sécuriser les données sensibles comme les informations de bagages et de vols et s'assurer que les données personnelles ne sont collectées et traitées que lorsque cela est absolument nécessaire. La qualité et l'intégrité des données doivent être assurées, et l'accès aux données doit être strictement limité. L'utilisation de protocoles de sécurité, tels que le chiffrement des données à la source, peut renforcer la sécurité des communications MQTT.

### Transparence et Traçabilité

Il est essentiel que le système soit transparent sur la manière dont les données sont traitées et utilisées, ainsi garantir la traçabilité des données. Les passagers doivent être informés de l'utilisation de leurs données et donner leur consentement éclairé. Cela peut être réalisé en expliquant clairement le fonctionnement du système de gestion des bagages et en offrant une option pour ne pas l'utiliser.

### Diversité, Non-Discrimination et Équité

Le système doit être accessible à tous les utilisateurs. Il doit être conçu en tenant compte des personnes qui pourraient être désavantagées par cette technologie, comme celles qui ne sont pas à l'aise avec son utilisation. Il est donc essentiel de prévoir des alternatives pour garantir l'inclusion.

### Bien-être Sociétal et Environnemental

Le système doit être développé de manière à minimiser son impact sur l'environnement et à contribuer au bien-être sociétal. Cela implique d'évaluer les coûts et les bénéfices environnementaux, en prenant en compte l'intégralité du cycle de vie du système, de la fabrication à la fin de vie. Le système devrait également être conçu de manière à minimiser les déchets, par exemple en prévoyant des moyens d'upgrader les composants plutôt que de les remplacer entièrement, ou en optant pour des matériaux recyclables.
Au-delà de l'aspect environnemental, il est également important de prendre en compte l'impact social du système. Il doit être conçu pour apporter des bénéfices tangibles à la société, comme l'amélioration de l'expérience de voyage des passagers, tout en respectant les principes d'équité et d'inclusion.

### Responsabilité

Les développeurs et les opérateurs du système doivent être tenus responsables de son fonctionnement et des impacts qu'il peut avoir. Cela inclut l'auditabilité, la documentation des incidences négatives, et la mise en place de mécanismes de recours en cas de problèmes.

### Consommation Énergétique
L'IoT est souvent associé à une consommation énergétique élevée, soulignant ainsi l'importance d'adopter des stratégies d'efficacité énergétique dans la conception et l'exploitation de notre système. Notre approche pour minimiser l'empreinte énergétique du système comprend plusieurs aspects.

- **Optimisation des requêtes** : Il est essentiel de concevoir les requêtes de manière à utiliser au minimum les ressources, en évitant par exemple les requêtes superflues ou redondantes.

- **Rationalisation des usages** : Nous devons garantir que chaque composant est utilisé de manière efficace, en minimisant les périodes d'inactivité où l'énergie est consommée sans produire de résultats.

- **Utilisation de composants économes en énergie** : Le choix de capteurs et d'actionneurs qui consomment moins d'énergie permet de réduire la consommation globale du système.

- **Adoption de mécanismes d'économie d'énergie** : Il s'agit notamment de mettre en veille automatique les composants lorsqu'ils ne sont pas en utilisation, maximisant ainsi l'efficacité énergétique du système.

- **Durabilité** : Le système doit être conçu avec des critères de durabilité, en envisageant par exemple la possibilité d'upgrader ou de réparer les composants plutôt que de les remplacer entièrement.

Ces efforts conjugués permettent de minimiser l'empreinte énergétique du système, tout en préservant son efficacité et sa fiabilité.


### Conclusion

L'intégration de ces principes éthiques est cruciale pour s'assurer que le système de livraison de bagages basé sur l'IoT bénéficie non seulement aux opérations de l'aéroport mais aussi à la société dans son ensemble, tout en minimisant les impacts négatifs.


