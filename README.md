# Issue Tracker

**Issue Tracker** enables you and your team to organize your projects and achieve your goals with low effort in no time. If you are a student, a software developer or any other person actively working on a project, you need to give **Issue Tracker** a try.

### Features

The main and most important features include:

- multiple board management
- multiple users per project
- role based access control (RBAC)
- beautiful, light and responsive UI
- self-hosted application
- single person to small team oriented
- email implementation for login/registertation

### Live demo

For a live demo please visit <link>

[insert projects pictures here]

### Installation

Quick and compact installation. Follow the steps below.

##### Technologies

- `Angular`
- `Angular-Material`
- `MongoDB`
- `Express`
- `TypeORM`

##### Requirements

- `Node 12+`
- `MongoDB`
  or
- `Docker`

##### Installation steps & development setup

If you don't want to install node locally you can use docker.
You can use one of these 2 options:

###### Option 1

```bash
$ docker-compose -f docker-compose.dev.yaml up
$ docker exec -it $CONTAINER_NAME bash -c cd /home/node/app &6 bash
```

###### Option 2

```bash
$ docker run -it --workdir /home/node/app -p 5000:5000 -v $(pwd):/home/node/app node:12 bash
```

After following one of the above mentioned options, you can start the backend respectively the frontend by running the following commands:

###### Backend

```bash
cd backend
npm install
npm run dev # runs a webserver on port 5000
```

###### Frontend

```bash
cd backend
npm install
npm run dev # runs a webserver on port 4200
```
