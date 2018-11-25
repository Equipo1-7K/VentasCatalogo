# Ventas por Catalogo (Backend)

La wea del PI que pues en realidad no hace mucho todavía.. en realidad es el back de esta madre y se me olvidó ponerle eso, pero ya fué..

La wea está hecha en node y tiene como 86154 dependencias, voy a suponer que no tienen nada de eso instalado, así que voy a poner las intrucciones para todo. **Ejecuta los comandos de uno por uno**...

# Cheinchlog
**Reestructuración**
* El proyecto se reestructuró a modo de que ahora es basado en *recursos* en lugar de *mvc*

**MySQL**
* El proyecto ahora utiliza MySQL en lugar de MongoDB... Sinceramente, MongoDB me volvió loco y no pienso aprenderlo ahora sólo para el proyecto. La instalación de MySQL es algo compleja y cambia dependiendo del sistema operativo, pero no necesita nada de especial.  
Los archivos de configuración para la base de datos están sobre `/appConfig.js`

**Token**
* El sistema de tokens dejó de lado a *JWT* y se comenzó a utilizar un sistema basado en **UUID** para las sesiones, evitando dobles verificaciones innecesarias.

**Servicios**
* Ahora, los servicios presentes tienen todos los métodos que necesitan y no se limitan a `GET` y `POST`

**HttpResponse**
* La clase que hace de helper para respuestas de HTTP ahora se autogenera, haciendo mas facil la integración de códigos de respuesta. (Y añadiendo un 10% de probabilidades de decir `Algo malió sal` cuando da error 500 ;) )

**Promesas de Bulebird**
* Estas cosas son una extensión a los `promises` de toda la vida, que permiten cosas como:
    * Cachar excepciones por tipo
    * Iterar sobre otras promesas secuencialmente
    * ... y ya, es para todo lo que las uso


**Excepciones propias**
* Se han creado 2 excepciones, ValidationException y ControllerException que, como su nombre lo sugiere, son para cachar errores de validación y errores genéricos. Permiten una respuesta mas simplificada con el código correspondiente

**Validaciones desde modelos de Swagger**
* Alv con las validaciones a mano, si ya está swagger con modelos que define lo que entra, hay que usarlos. Se utiliza la librería `swagger-object-validator` para este cometido.

# Descarga de toda la wea

**Instrucciones para GNU/Linux:**
* `$ sudo apt install -y npm` - (Instala node y el manejador de dependencias)
* `$ sudo apt install -y git` - (Instala git)
* `$ git clone git@github.com:Equipo1-7K/VentasCatalogo.git ./VentasCatalogoBack` - (Clona el proyecto)
* `$ cd VentasCatalogoBack` - (Va a la carpeta del proyecto recién clonado)
* `$ npm install` - (Instala las 86154 dependencias)

**Instrucciones para Windows:**
* Ve a https://nodejs.org/es/download/ y selecciona el de Windows, descárgalo e instálalo como diosito te de a entender porque no me acuerdo de cómo se hace...
* Ve a https://git-scm.com/download/win , descarga el instalador y ejecútalo como diosito te siga dando a entender porque tampoco me acuerdo de como se hace...
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
* Ve a la cuarta opción del pánel de la izquierda (no se cómo poner imágenes aquí, en cuanto averigüe cómo, actualizo esto)
* Presiona en el botón play
* Listo, ahora se abre en módo depuración, pueden hacer mas cosas desde aquí que desde consola, pero eso es tema para otro día

# Prueba de que si jala

Sabemos que se está ejecutando si en la terminal (O en el log de VSCode) sale algo así:
```
Iniciando servidor en modo desarrollo
Server listening on port 3000
```

Si salió eso, vamos bien. Ahora falta que de verdad de algún resultado.
Entra a http://localhost:3000/docs y tiene que aparecerte la documentación de Swagger. Teniendo eso, es porque ya funciona y estás listo para moverle a lo que sea.

# Listeishon, eso es todeishon

Si todo sale bién, pues ya estás, a moverle que ese PI no se va a hacer solo...... O si?.....  
Si algo malió sal, nos avisas y te ayudamos sin broncas.

Suerte C:

# Bonus wuuuuu :DD
Ahora, esta cosa tiene soporte para docker. Tiene archivos preconfigurados para que funcione y, a pesar de que está pensado para funcionar con `docker-compose`, no tiene una arquitectura especialmente complicada.

También, hay archivos de configuración listos para hacer funcionar el servidor en producción sobre puerto 80 y para que jale sobre puerto 433 cuando hay `SSL` presente en `/ssl`. Luego les explico en que está eso

