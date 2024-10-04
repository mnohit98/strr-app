Here's the README file in Markdown format:

````markdown
# Strr-App

This is the backend for the Strr-App, built using Node.js and MySQL. The application is containerized using Docker to simplify deployment and ensure a consistent environment.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Docker Commands](#docker-commands)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- API for managing activities, clubs, and members.
- Dockerized environment for easy setup and deployment.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Docker installed on your machine. You can download it from [Docker's official website](https://www.docker.com/products/docker-desktop).
- Docker Compose installed. It usually comes with Docker Desktop.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/strr-app.git
   cd strr-app
   ```
````

2. Build and run the Docker containers:

   ```bash
   docker-compose up --build
   ```

3. Access the application at `http://localhost:3000`.

4. Access the MySQL database at `localhost:3306`.

## Docker Commands

Here are some useful Docker commands to manage your application:

### Starting the Application

To start the application and the database, use:

```bash
docker-compose up
```

To build the images and start the containers, use:

```bash
docker-compose up --build
```

### Stopping the Application

To stop the running containers, use:

```bash
docker-compose down
```

### Checking Container Status

To check the status of running containers, use:

```bash
docker ps
```

### Accessing the MySQL Container

To access the MySQL shell in the Docker container:

```bash
docker-compose exec db mysql -u root -p
```

Enter the password: `strr@123`.

### Executing Commands in the Application Container

To run commands inside the application container, you can use:

```bash
docker-compose exec app /bin/sh
```

### Viewing Logs

To view the logs for the application and database containers, you can run:

```bash
docker-compose logs
```

To view logs for a specific service (e.g., the app):

```bash
docker-compose logs app
```

### Cleaning Up

To remove all stopped containers, networks, images, and optionally volumes, you can run:

```bash
docker system prune
```

## Database Setup

The MySQL database is automatically set up when you start the application using Docker Compose. The `schema.sql` file in the `db-init` folder will be executed to create the necessary tables and structure.

### Checking Database Tables

To check the database tables in your MySQL container, use:

1. Access the MySQL container:

   ```bash
   docker-compose exec db mysql -u root -p
   ```

2. List databases:

   ```sql
   SHOW DATABASES;
   ```

3. Use your database:

   ```sql
   USE strr_app;
   ```

4. List tables:

   ```sql
   SHOW TABLES;
   ```

## Environment Variables

The following environment variables are used in the Docker setup:

- `MYSQL_ROOT_PASSWORD`: The password for the MySQL root user (default: `strr@123`).
- `MYSQL_DATABASE`: The name of the database to create (default: `strr_app`).

## Rerun docker

```bash
docker ps -a
docker stop $(docker ps -a)
docker rm $(docker ps -a)
docker volume rm strr-app_db_data
docker-compose up -d
docker-compose up --build
```

## Schema Script

1. Open Workbench
2. Server -> Data Export
3. object Selection -> select Db -> Export to self contained file -> create in single dump and include create schema
