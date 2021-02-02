# Backend

## Start in Production

```bash
# Duplicate the example.env file and fill in your mailtrap.io credentials
$ cp example.env .env

# Starting the backend Server on Port 5000 and Postgres on Port 5432
$ docker-compose up
```

## Installation

```bash
# Duplicate the example.env file and fill in your mailtrap.io credentials
$ cp example.env .env

$ docker-compose -f docker-compose.dev.yaml up
$ docker exec -it backend bash -c "cd /home/node/app && bash"

# inside the container
$ npm i

# To load the .env file run
$ ./start
```

## Project structure

```
src
 ┣ controllers
 ┃ ┗ name.controller.ts
 ┣ entities
 ┃ ┗ name.enitity.ts
 ┣ enums
 ┃ ┗ name.enum.tss
 ┣ interfaces
 ┃ ┗ name.interface.ts
 ┣ middleware
 ┃ ┗ name.middleware.ts
 ┣ repositories
 ┃ ┗ name.repository.ts
 ┣ services
 ┃ ┗ name.service.ts
 ┣ utils
 ┃ ┗ name.util.ts
 ┣ env.d.ts
 ┗ server.ts
```

### Controller

#### Example

```ts
@ExampleInTheMiddle() // Apply ExampleMiddleware to all sub paths of this controller
@Controller("example") // Controller decorator defines path
export class ExampleController {
  // export class
  constructor(private exampleService: ExampleService) {} // Injecting service of type ExampleService

  @GET("/") // GET endpoint on path / (same as app.get('/',index))
  public index(req: Request, res: Response) {
    res.send("Healthy");
  }

  @POST("/:id") // POST endpoint on path /:id => path matches all urls /example/SOME_STRING
  public async create(req: Request<{ id: string }>, res: Response<Example>) {
    // asymc method to use await instead of .then syntax
    const { id } = req.params; // extracting id from uri

    const example: Example = await this.exampleService.asynchronousExampleTask(
      id
    ); // calling Service that returns an object of type Example

    res.json(example); // variable example as json
  }
}
```

### Services

#### Example

```ts
@Service() // Service decorator to define Class as Service
export class ExampleService { // export class
  constructor(private otherService: OtherService) {} // Injecting service of type ExampleService

  public async asynchronousExampleTask(id:string): Promise<Example> {
    ... // doing some complex asynchronous task
    return example
  }
}
```

### Enums

#### Example

```ts
export enum ExampleEnum { // export enum
  example1, // define states
  example1,
}
```

### Interfaces

#### Example

```ts
export interface ExampleDTO {
  // DTO => DataTransferObject is often used to define a reduced object structure when data comes/goes from/to the front-/backend
  data: number[]; // defome property data as number array
}
```

### Entities

#### Example

```ts
@Entity() // Define class as Typeorm enitity
export class Example {
  @PrimaryGeneratedColumn() // gernerate ids on create and set id column as primary database key
  public id!: number;

  @Column() // Define title
  public data!: number[];

  @Column()
  public description!: string;

  @ManyToOne(() => AnotherEntity, (anotherEntity) => anotherEntity.example) // n-to-1 releation
  public anotherEntity: AnotherEntity; // @OneToMany for AnotherEntities property

  @ManyToMany(() => OtherEntity, (otherEntity) => otherEntity.examples) // n-to-n relation
  @JoinTable() // necessary to query entites together
  public otherEntities!: OtherEntity;
}
```

### Middlewares

#### Example

```ts
@Service()
export class ExampleMiddleware implements IMiddleware {
  // must implement all functions/properties from IMiddleware interface
  constructor() {}
  async middleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers; // extracting authorization header
    if (!authorization)
      // Sending a status 403 if authorization header is not set
      return res.status(403).send("No authorization header was set.");

    next(); // going on with the next middleware or endpoint
  }
}

export const ExampleInTheMiddle = (
  options?: Options // Initlizing middleware as decorator
) => Middleware<JWTMiddleware>(JWTMiddleware, options);
```
