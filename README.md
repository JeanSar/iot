# Projet IOT

## Lancer le projet :

Le publisher
```node mqtt-client-pub.js```

Le subscriber :
```node mqtt-client-sub.js```

IP de la VM :
192.168.78.97


## Partie Node RED

Accédez au shell du conteneur Docker :
```sudo docker exec -it 64ca0d2c293e /bin/bash```

Configurer le proxy dans NPM :
```npm config set proxy "http://proxy.univ-lyon1.fr:3128"```

Vérifier si la configuration a été correctement appliquée :
```npm config get proxy```

