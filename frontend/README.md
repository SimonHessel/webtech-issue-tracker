# Frontend

## Installation

```bash
$ docker run -it --workdir /home/node/app -p 4200:4200 -v $(pwd):/home/node/app node:12 bash

# inside the container
$ npm i
$ npm start
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Development server

Run `npm run ng -- serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `npm run ng -- generate component component-name` to generate a new component. You can also use `npm run ng -- generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run ng -- build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm run ng -- test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run ng -- e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `npm run ng -- help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
