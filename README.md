# Meeting Engine

A simple parent-teacher meeting management application for the [V high school in Gdańsk](https://www.vlo.gda.pl/).

## Configuring the .env

#### Mongo variables

- `MONGO_LOGIN` - Mongo username.
- `MONGO_PASSWORD` - Mongo password.

#### Auth variables

- `ADMIN_USERNAME` - Admin username, must be between 4 and 30 chars long.
- `ADMIN_PASSWORD` - Admin password, must be between 8 and 30 chars long.
- `JWT_SECRET` - Secret used for signing json web tokens.

#### SMTP variables

- `SMTP_HOST` - The adress of your smtp server.
- `SMTP_PORT` - The port of your smtp server.
- `SMTP_USER` - The username of your smtp user.
- `SMTP_PASSWORD` - The password of your smtp user.
- `SMTP_ALLOWED_SENDER_DOMAINS` - The allowed sender domains for postfix.

#### Meeting engine variables

- `MAX_CONFIRM_WAIT` - The maximum wait time for the confirmation of a meeting.
- `BOOKING_LENGTH` - The length in minutes of a single parent-teacher meeting.

Do not configure these variables for testing, if left empty a test user will be created.

## Configuring the available teachers

Create a copy of the `config/teachers.example.json` file and name it `config/teachers.json`.

Fill it out with the teachers, that you want to be available in the dashboard.

## Configuring the available classes

Create a copy of the `config/classes.example.json` file and name it `config/classes.json`.

Fill it out with classes, that you want to be available during the booking process.

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

### Yarn

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

## License

MIT
