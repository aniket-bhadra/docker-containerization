# Problem:
When we create an application in a specific environment, replicating that environment for the application to function the same on every machine and operating system can be quite problematic. Various factors like different operating systems, different architecture, package versions, dependencies, or even certain command-line interfaces that don't work uniformly across different systems can lead to complications. Dealing with these issues becomes even more cumbersome when multiple team members need to work on or run similar applications, requiring the setup of the same environment multiple times.

The solution lies in containers. By encapsulating all the dependencies, including the operating system, within a container, we can easily share it across the team, eliminating the need to repeatedly set up the same environment.

 Containers are lightweight, allowing us to build, destroy, share, or deploy them effortlessly. Each container operates independently with its own operating system, tooling, and configuration.
 
### Why `package.json` alone isn't enough:

* `package.json` handles **Node.js packages** only.
* It **doesn't cover OS-level dependencies** (e.g., Python, system tools, env variables, file paths).
* It **can't ensure uniform behavior** across OSes (Linux vs Windows).

#### Examples:

1. **`node-gyp`** – Compiles native C++ modules; fails without proper build tools (e.g., Python, make).
2. **`fsevents`** – File watcher library; works **only on macOS**, skipped on other OSes.

→ These inconsistencies are why `package.json` alone can't guarantee a uniform environment.


# Docker Architecture -

## The 3 Key Players

### 🔧 Docker Daemon (dockerd)
- **THE ENGINE** - does all the actual work
- Runs as local background server on your PC
- Creates containers, builds images, manages everything
- **Location**: Local on your machine

### 💻 Docker CLI (docker command)
- **THE MESSENGER** - just sends commands
- Talks to daemon via REST API (Unix socket)
- **No internet needed** - pure local communication
- You type `docker run` → CLI tells daemon → daemon does the work

### 🖼️ Docker Desktop
- **THE GUI** - visual interface + bundled daemon
- Mainly for Windows/Mac (Linux can use CLI directly)
- Shows containers, images, logs in pretty interface
- **Still uses same daemon underneath**
- **Talks to daemon via GUI** - clicking buttons sends same REST API calls as CLI

Docker Desktop communicates with the Docker daemon and also displays its current status, showing how many containers exist and how many are running visually.

## Simple Mental Model
```
You → Docker CLI → Docker Daemon (local server) → Does the work
     OR
You → Docker Desktop GUI → Docker Daemon (local server) → Does the work
```

---

### First Command  
```sh
docker run -it ubuntu
```  
- **`-it`** → Runs in interactive mode  
- **`ubuntu`** → Image name  

This command **creates and runs a container** using Ubuntu OS.  

Once executed, the terminal will display:  
```sh
root@<container_id>:/#
```  
This means you're **inside the container**, and any command you run will execute within it.  

- **Container ID** → Unique identifier for the running container  
- **`ctrl+d`** → Exit from the container  

---

# what is image?
A Docker image is a lightweight, standalone, and executable software package that contains everything needed to run software — such as applications, OS components, services like Redis, or any runnable code — including the code, runtime, libraries, environment variables, and config files.
It’s like a **blueprint or template** used to create Docker containers.
Images are **read-only**; when run, they become containers (which are the live, running versions).


# what is container?

A Docker container is a lightweight, standalone, and isolated environment used to run applications. It’s like a mini-computer inside your computer, created from a Docker image. It contains everything needed to run — code, runtime, libraries, and settings — and runs independently from your main system.
It shares the host OS kernel but can include its own user-space environment, making it feel like it has its own OS.
It is essentially a running instance of a Docker image.

So, there are two things: kernel space and user space.
- Kernel space: The core of the OS that manages system resources and handles hardware interactions.
- User space: The area where all application processes run.
Docker containers share the kernel space of the host but have their own user space—meaning that, on top of this shared kernel space, each container is free to run whatever it wants, independently, making it feel like it has its own OS.


Think of it as a box that has its own set of tools, code, libraries, configuration files, and even its own mini-operating system. Everything inside this box is self-contained and doesn't interfere with anything outside the box.

When you run a Docker container, it's like turning on this mini-computer. It starts up, runs your application, and then when it's done, you can turn it off without affecting anything else on your machine.

The beauty of Docker containers is that they are portable. You can create a container on your machine, then take this container and run it on any other machine that has Docker installed, regardless of the underlying operating system.
So, in essence, a Docker container is a portable, self-sufficient environment for running applications. It ensures that your application runs the same way, no matter where it's deployed. This consistency makes it easier to develop, test, and deploy applications across different environments.


# docker image vs docker container

 When you run a Docker image, it becomes a container. A container is a runtime instance of an image.Without the image, there would be no container, as the image contains all the necessary components to create the environment you’ve designed.think of the Docker image as a recipe and the container as the dish made from that recipe. You can share the recipe (image) with others, and they can use it to make the dish (container) in their own kitchen (system).Remember, the container is a running entity that you can interact with, stop, start, move, or delete. The image is the static file that allows you to create these dynamic con

# Sharing a Docker environment means sharing a Docker image
A Docker image is a static, lightweight, and read-only file that contains everything needed to create a container. When executed, it spins up a container, providing an isolated runtime environment.
Since images are portable and immutable, sharing them is the most efficient way to replicate an environment across different systems. This ensures consistency, so containers created from the same image behave identically, no matter where they run.
Docker image → executed → container gets created.

**Commands** 

- `docker container ls` → Show running Docker containers  
- `docker container ls -a` → Show all Docker containers, including stopped ones  
- `docker images` → Show available images  
- `docker start container_name` → Start an existing container  
- `docker stop container_name` → Stop a running container 
- `docker run -it --name my_container <image_name>`  → create container with a name 
- `docker run --rm -it ubuntu` → This deletes the container automatically when it stops.

**Run a container with an Ubuntu image:**  
- `docker run ubuntu` → Create a container with the Ubuntu image and return to the host terminal  
- `docker run -it ubuntu` → Create a container with the Ubuntu image and attach the host terminal to the container  


**The `-it` flag controls whether the host terminal stays attached or not. However, once we use `-it`, whether we remain inside the container depends on the command itself.**  

### Examples:
- Running `ls` after adding `-it` **just prints output** and returns to the host terminal.  
- Running `bash` or `sh` after adding `-it` **keeps us inside** the container terminal.  
- Creating a **new container** with `-it` **keeps us inside** that container’s terminal.  

Without `-it`, commands like `docker run` or `docker exec` **never keep us inside** the container terminal—we **must** use `-it` to stay attached.  
So, **only `-it` + commands that start an interactive session** will keep us in the container terminal—nothing else does.  

### Choosing the right command:
- **If the container is running**, use:  
  ```sh
  docker exec -it <container_name>
  ```
- **If creating a new container**, use:  
  ```sh
  docker run -it <image>
  ```
The `-it` flag is typically used with both `exec` and `run` when you want an *interactive terminal*. The `-d` flag is used with `run` to start the container in **detached mode**.

- **If starting an existing container**, use:  
  ```sh
  docker start <container_name>
  ```
- **For a stopped but existing container and attaching interactively**, use:  
  ```sh
  docker start -ai <container_name>
  ```

For `start` and `stop` commands with interactive mode, use `-ai` flag:  
```sh
docker start -ai <container_name>
```  

Interactive = you’re inside the container terminal.

Detached = container runs in the background, you stay in host terminal.  
ex-
```sh
docker run -itd --name spiderman --rm busybox
```
This starts a container named **spiderman**, using the **busybox** image, in **detached mode**.  
---

* Containers are **isolated** and always based on **one single image**.
* To add more tools, you must **install them manually** inside the container (e.g., via `apt`, `npm`, etc.).
* You **cannot use multiple images inside one container**.

If you need multiple tools pre-installed, create a **custom image** using a `Dockerfile`.

### Port Mapping

Expose container port to local machine:

```bash
docker run -it -p <local_port>:<container_port> image_name
```

Example:

```bash
docker run -it -p 1025:1025 image_name
```

### Environment Variables

Pass environment variables to a container:

```bash
docker run -it -p <local>:<container> -e key=value -e key=value image_name
```

---

## Dockerizing a Web Application

### Dockerfile Basics

1️⃣ **Base Image**
Choose a base image: `node`, `ubuntu`, etc.
Add commands if needed:

```Dockerfile
FROM node
RUN apt-get update
```

2️⃣ **Copy Files**
 source → destination:

```Dockerfile
COPY main.js index.js
```

3️⃣ **Entrypoint vs. Run**

* **RUN**: For build-time commands (e.g., install packages).
* **ENTRYPOINT**: For container start commands (e.g., `node main.js`).

Example:

```Dockerfile
ENTRYPOINT ["node", "main.js"]
```

---

### Building the Image

Run in the Dockerfile directory:

```bash
docker build -t <image_name> .
docker build -t basic-nodejs .
```

---

### Push to Docker Hub

1️⃣ Create a repo on Docker Hub.
2️⃣ Build an image **with the same name** as the repo.
3️⃣ Push:

```bash
docker push <dockerhub_username>/<repo_name>
```

---