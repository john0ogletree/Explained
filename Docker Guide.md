# Introduction to Docker

**Docker** is an open-source platform that enables developers to build, ship, and run applications inside lightweight, portable, and isolated environments called **containers**.

---

## 1. Core Concepts

* **Image:** A read-only template containing the application code, runtime, libraries, environment variables, and config files.
* **Container:** A runnable, isolated instance of a Docker image.
* **Dockerfile:** A text document containing instructions to assemble a Docker image.
* **Docker Registry / Hub:** A repository for storing and sharing Docker images.
* **Volume:** A persistent storage mechanism managed by Docker to retain data beyond the container lifecycle.

---

## 2. Basic Workflow & Dockerfile

### Sample `Dockerfile`

```dockerfile
# Base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose port and start app
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 3. Essential CLI Commands

### Image Management
```bash
# Build an image from a Dockerfile
docker build -t my-app:latest .

# List local images
docker images

# Pull an image from Docker Hub
docker pull nginx:latest

# Remove an image
docker rmi my-app:latest
```

### Container Operations
```bash
# Run container in detached mode with port mapping
docker run -d -p 8080:3000 --name web-app my-app:latest

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop and remove a container
docker stop web-app
docker rm web-app

# Execute interactive terminal inside a running container
docker exec -it web-app sh

# View container logs
docker logs -f web-app
```

---

## 4. Docker Compose

**Docker Compose** is a tool for defining and running multi-container Docker applications using a single YAML configuration file.

### Sample `compose.yaml`

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:3000"
    environment:
      - DB_HOST=db
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

### Common Compose Commands
```bash
# Start all services in the background
docker compose up -d

# View status of managed services
docker compose ps

# Stop and remove services, networks, and volumes
docker compose down
```

---

## 5. Docker vs. Virtual Machines

| Feature | Virtual Machines (VM) | Docker Containers |
| :--- | :--- | :--- |
| **Architecture** | Hypervisor + Guest OS per VM | Shared Host Kernel |
| **Startup Time** | Minutes | Seconds |
| **Size** | Gigabytes | Megabytes |
| **Performance** | High Overhead | Near-Native Performance |