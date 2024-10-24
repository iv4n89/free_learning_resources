# Free Learning Resources

Este repositorio es un contenedor para el proyecto [screenshot and youtube image fetcher](https://github.com/iv4n89/screenshot-and-youtube-image-fetcher).

Tenemos en este proyecto un fichero json `resources.json`. Al agregar datos a este fichero se actualizará el contenido del otro proyecto.

Cualquier website que no sea youtube activará un workflow por el que se actualizarán las screenshots que existen en Firebase hospedadas.

Estos screenshots se obtienen mediante el script existente en `getScreenshots.mjs`

El repositorio está abierto para poder agregar elementos.

Estructura de los datos:

```json
{
    [nombre del tipo de recurso en minúscula y sin espacios (ejemplo react)]: [
        {
            "url": "url del sitio/video de youtube",
            "title": "título que aparecerá en la web para presentar el recurso",
            "description": "descripción del recurso que acompañará al título",
            "language": "lenguaje del recurso (por implementar)"
        }
    ]
}
```
