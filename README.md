# Ventas por Catalogo (Backend)

La wea del PI que pues en realidad no hace mucho todavía.. en realidad es el back de esta madre y se me olvidó ponerle eso, pero ya fué..

La wea está hecha en node y tiene como 86154 dependencias, voy a suponer que no tienen nada de eso instalado, así que voy a poner las intrucciones para todo. **Ejecuta los comandos de uno por uno**...

# Descarga de toda la wea

**Instrucciones para GNU/Linux:**
* `$ sudo apt install -y npm` - (Instala node y el manejador de dependencias)
* `$ sudo apt install -y mongodb` (Instala MongoDB, sin esta cosa de plano no corre)
* `$ sudo apt install -y git` - (Instala git)
* `$ git clone git@github.com:Equipo1-7K/VentasCatalogo.git ./VentasCatalogoBack` - (Clona el proyecto)
* `$ cd VentasCatalogoBack` - (Va a la carpeta del proyecto recién clonado)
* `$ npm install` - (Instala las 86154 dependencias)

**Instrucciones para Windows:**
* Ve a https://nodejs.org/es/download/ y selecciona el de Windows, descárgalo e instálalo como diosito te de a entender porque no me acuerdo de cómo se hace...
* Ve a https://git-scm.com/download/win , descarga el instalador y ejecútalo como diosito te siga dando a entender porque tampoco me acuerdo de como se hace...
* Ve a https://www.mongodb.com/dr/fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-4.0.2-signed.msi/download , descárgalo y ve a buscar un tutorial para instalarlo porque este si está mas complicado y tampoco me acuerdo de como hacerle...
* Abre git bash y ahora si, escribe lo siguiente de uno por uno
  * `$ git clone git@github.com:Equipo1-7K/VentasCatalogo.git ./VentasCatalogoBack` - (Clona el proyecto)
  * `$ cd VentasCatalogoBack` - (Va a la carpeta del proyecto recién clonado)
  * `$ npm install` - (Instala las 86154 dependencias)
  
**Instrucciones para Mac:**
* Ese si se las debo, no se como hacerlo en mac os, pero debería ser similar a GNU/Linux
  
# Ejecución del servidor

Una vez descargado todo y estando en la carpeta del proyecto, procedemos a lanzar el servidor...
**Las instrucciones son para el sistema que sea**

**Desde consola:**
* `$ node ./`
* Listo, eso es básicamente todo

**Desde Visual Studio Code:**
* Ve a la cuarta opción del pánel de la derecha (no se cómo poner imágenes aquí, en cuanto averigüe cómo, actualizo esto)
* Presiona en el botón play
* Listo, ahora se abre en módo depuración, pueden hacer mas cosas desde aquí que desde consola, pero eso es tema para otro día

# Prueba de que si jala

Sabemos que se está ejecutando si en la terminal (O en el log de VSCode) sale algo así:
```
Se ha conectado a la base de datos
Server listening on port 3000
```

Si salió eso, vamos bien. Ahora falta que de verdad de algún resultado.
Entra a http://localhost:3000/docs y tiene que aparecerte la documentación de Swagger. Teniendo eso, es porque ya funciona y estás listo para moverle a lo que sea.

# Listeishon, eso es todeishon

Si todo sale bién, pues ya estás, a moverle que ese PI no se va a hacer solo...... O si?.....  
Si algo malió sal, nos avisas y te ayudamos sin broncas.

Suerte C:

