# Escribiendo barajas personalizadas
> Juega con tus propias tarjetas.

Las barajas personalizadas están escritas en un archivo JSON importado antes de que empiece el juego. Esta página te mostrará cómo crear las barajas que quieras.

## Empecemos
Lo primero que necesitas es crear un archivo JSON con dos claves: `name` y `codeName`.

- `name` es una <u>cadena</u>, puede ser lo que quieras, y es como se mostrará en el juego.
- `codeName` también es una <u>cadena</u>, y es el nombre que el juego usa para identificar tu baraja. Este tiene que ser único entre todas las barajas. Si no es único, el archivo no se importará y serás notificado.

El esqueleto de la baraja quedaría así:
```json
{
  "name": "Baraja Personalizada #1",
  "codeName": "mi-baraja-1"
}
```

> [!ADVERTENCIA]
> Si `name` o `codeName` no figuran o están mal escritos, la baraja no será añadida y serás notificado.

## Añadiendo Cartas
### Cartas Negras
Las cartas negras se representan con la clave `blackCards`. Cada tarjeta negra necesita dos claves, `text` y `pick`.

- La clave `text` es una <u>cadena</u>, y es el texto que aparecerá en la tarjeta en el juego. Puedes usar las entidades de caracteres que encontrarás en https://dev.w3.org/html5/html-author/charref. Para añadir huecos a la tarjeta **usa sólo una barra baja (_)**. También puedes usar HTML como `<b>Negrita</b>` y `Saltos de<br />línea`.
- La clave `pick` es un <u>número</u>, y representa cuántas tarjetas puede escoger cada jugador para rellenar la tarjeta negra. No hay límite en cuántas puedes elegir, pero **no debería ser más de diez cartas** ya que cada jugador tiene diez cartas y no se añaden más hasta la ronda siguiente.

Un ejemplo de añadir cartas negras quedaría así:
```json
{
  "name": "Baraja Personalizada #1",
  "codeName": "mi-baraja-1",
  "blackCards": [
    {
      // Sin usar huecos:
      "text": "&iquest; Por qu&eacute; cruz&oacute; la gallina la carretera?",
      "pick": 1
    },
    {
      // Usando huecos y entidades de caracteres:
      "text": "&iexcl;Te gusta _&quest; &#161;Bueno, _&trade; es mejor&excl;",
      "pick": 2
    }
  ]
}
```

### Cartas Blancas
Las cartas blancas son las más sencillas. Necesitas añadir un array con la clave `whiteCards`, y cada elemento del array debe ser una cadena.

Un ejemplo de añadir tarjetas blancas sería:
```json
{
  "name": "Baraja Personalizada #1",
  "codeName": "mi-baraja-1",
  "whiteCards": [
    "S&iacute;",
    "No",
    "Puede"
  ]
}
```

> [!CONSEJO]
> Cualquier tarjeta que no tenga los tipos que debe tener (cadena, número, ...) no será añadida al juego.

> [!CONSEJO]
> Los arrays `whiteCards` y `blackCards` son opcionales y no son necesarios para que la baraja funcione.
