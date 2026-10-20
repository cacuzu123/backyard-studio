# Backyard Studio

Landing page de Backyard Studio en una sola página adaptable a escritorio, tablet y móvil.

## Estructura

```text
index.html
pages/
  cookies.html
css/
  styles.css
js/
  main.js
  tailwind-config.js
assets/
  preview.png
```

La página presenta a Backyard Studio como un espacio de creación digital enfocado en producción audiovisual, dirección de arte, branding, estrategia de contenidos, Meta Ads, gestión de redes sociales y fotografía para redes.

La identidad visual usa la paleta de la referencia de Backyard Studio: carbón, azul intenso, magenta, amarillo, verde lima, violeta y blanco. El contraste y los acentos vivos refuerzan la idea de una página de marketing creativo. Los títulos usan Space Grotesk y los textos Inter para diferenciar la personalidad visual de la legibilidad. El hero incluye una composición editorial con líneas SVG, órbitas decorativas y parallax ligado al scroll; este movimiento se desactiva automáticamente cuando el usuario prefiere reducir el movimiento. El resto de la página usa una capa editorial compartida: fondos con profundidad, tarjetas escalonadas, hover con movimiento y un CTA con gradiente animado. Además, un campo cromático global cambia progresivamente con el scroll entre las secciones para dar continuidad visual a toda la página, sin bloquear el desplazamiento ni cubrir el contenido. La metodología se presenta como una escena blanca de proceso dinámico: un único nodo se desplaza entre cuatro etapas, permanece dos segundos en cada punto y tarda 1.8 segundos en desplazarse al siguiente, mientras las líneas SVG apuntan hacia él. Tailwind CSS y Google Fonts se cargan desde CDN, por lo que se necesita conexión a internet al abrirla directamente en el navegador.
