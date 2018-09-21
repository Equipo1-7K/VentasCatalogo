if [ ! -f ./node-installed.lock ]; then
    # Instalamos node y npm
    apt-get update
    apt-get install -y nodejs npm

    #Evitamos que se instale de nuevo
    touch node-installed.lock
else
    echo "Node ya instalado"
fi

# Vamos al directorio del proyecto
cd /usr/src/app

# Instalamos dependencias
npm install

if test "$PROD" = "1"; then
    # Copiamos los archivos de producción
    cp -f ./Docker/appConfigProd.js ./appConfig.js
    cp -f ./Docker/indexProd.js ./index.js


    # Ejecutamos sin live reload
    node ./
else
    #Instalamos demonio de live reload
    npm install --global nodemon

    # Ejecutamos con ese demonio
    nodemon ./ --inspect-brk
fi

# Ejecutamos el servidor en modo producción