# Meeting Engine

A simple parent-teacher meeting management application for the [V high school in Gdańsk](http://www.vlo.gda.pl/).

## Configuring the .env

#### Mongo variables

- `MONGO_LOGIN` - Mongo username
- `MOGNO_PASSWORD` - Mongo password

#### Auth variables

- `ADMIN_USERNAME` - Admin username, must be between 4 and 30 chars long.
- `ADMIN_PASSWORD` - Admin password, must be between 8 and 30 chars long.
- `JWT_SECRET` - Secret used for signing json web tokens.

## Setting up the database

After populating your Mongo variables in the `.env` file, you can spin up the container using `docker-compose`.

#### Linux

```sh
sudo docker-compose up -d
```

#### Windows

```sh
docker compose up -d
```

## Running the application

### Yarn (Recommended)

#### Installing dependencies

```sh
yarn
```

#### Development server

```sh
yarn dev
```

#### Building for production

```sh
yarn build
```

#### Running the production server

```sh
yarn start
```

### Npm

#### Installing dependencies

```sh
npm install
```

#### Development server

```sh
npm run dev
```

#### Building for production

```sh
npm run build
```

#### Running the production server

```sh
npm run start
```
