# API
> Consigue datos con la API REST.


## Tabla de Contenidos
- [API](#API)
  - [Tabla de Contenidos](#Table-of-Contents)
  - [URL](#URL)
  - [Endpoints](#Endpoints)
    - [/currentGame/:code](#currentGame)
    - [/sets](#sets)
    - [/set/:set](#setset)
    - [randomWhiteCard/:set?](#randomWhiteCardset)
    - [randomBlackCard/:set?](#randomBlackCardset)

## URL
Puedes acceder a la API desde: `https://cah-game.herokuapp.com/api/`.

## Endpoints
### /currentGame/:code
Devuelve el objeto de la partida actual con el código especificado por el parámetro `code`.

### /sets
Muestra todos los IDs disponibles.

### /set/:set
Devuelve los datos de un set específico. El parámetro `set` tiene que ser un ID válido. Los IDs de sets pueden ser encontrados en `/sets`.

### randomWhiteCard/:set?
Devuelve una carta blanca aleatoria de un set. Si el parámetro `set` es proporcionado, se coge una carta blanca aleatoria de la baraja predeterminada. Los IDs de los sets pueden ser encontrados en `/sets`.

### randomBlackCard/:set?
Devuelve una carta negra aleatoria de un set. Si el parámetro `set` es proporcionado, se coge una carta negra aleatoria de la baraja predeterminada. Los IDs de los sets pueden ser encontrados en `/sets`.

Esto sólo devuelve el texto de la carta negra. No incluye cuántas cartas blancas deben ser escogidas.
