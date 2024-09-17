<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


## Generar una migración

```
npm run migration:generate --name=deal-engine

```
## Para ejecutar las migraciones

```
npm run migration:run-dev

```

## Levantar la aplicación

```
npm run start:dev

```
## Hacer la petición

```
http://localhost:3001/v1/tickets/upload

** Body -> Form Data **
Key = file
Value = CSV

```

## Flujo de la aplicación

1. **Crear `.env.dev`:**
   - Usar las credenciales de tu base de datos PostgreSQL.
   - Obtener la `OPENWEATHER_API_KEY` desde tu cuenta en [OpenWeather](https://openweathermap.org/api).

2. **Generar una migración de la base de datos:**
   - Ejecutar el comando para generar la migración según los cambios que desees aplicar.

3. **Ejecutar las migraciones:**
   - Asegúrate de que todas las migraciones se apliquen correctamente en la base de datos.

4. **Subida del archivo CSV:**
   - El sistema recibe un archivo con una cantidad X de registros.

5. **Procesamiento del CSV:**
   - Se procesan hasta 3000 registros del archivo CSV.
   - Solo se guardan en la base de datos los tickets únicos (no duplicados).

6. **Consulta del clima:**
   - Para cada ticket, se verifica si las coordenadas ya están en la caché.
   - Si están en la caché, se reutiliza la información.
   - Si no están, se hace una consulta a la API del clima y se almacena en la caché para futuras consultas.

7. **Almacenamiento en la base de datos:**
   - Solo los tickets únicos se almacenan en la base de datos.

8. **Generación del informe:**
   - El informe generado refleja la información de los tickets únicos.
   - Se utiliza la caché para evitar consultas duplicadas a la API del clima.
