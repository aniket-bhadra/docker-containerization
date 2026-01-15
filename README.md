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

Once a container is created with specific envs/ports, these settings persist in the container’s configuration. When you start the container, they are automatically reapplied—there’s no need to pass them every time. However, if the container is removed, those settings (env/ports) are lost, and you’ll need to recreate the container with the settings


### docker important concept:
Each container = 1 main process (usually PID 1).
Any other processes inside the container (like Postgres or Redis) = child processes of that main process.
If the main process dies (e.g., Node.js server crashes) → Docker considers the entire container "dead".
All child processes (like Postgres) running in the same container → die too


The main process is whatever you specify in CMD/ENTRYPOINT.
If you build a custom image with multiple services (Node.js + Postgres + MongoDB), the container’s main process is usually the startup script that launches all services.
If that script dies → whole container dies.
If one service (like Node.js) dies, but the script stays running → container stays up, but that one service is down (a dangerous, hidden failure).


Image = Blueprint with OS, tools, code, config.
Container = Running instance in RAM
### Docker Compose--
### why we need multiple containers for each service?
suppose **e-commerce project** using Docker:
👉 We **must** use **multiple containers**, one for each service, because:

* If we put everything in one container → 
**impossible to scale**,because for heavy traffic if we want-> 1 Postgres container.
3 Node.js containers, not possible to achieve here
**Bigger containers = heavier, slower startup.**
**If one service crashes, whole container fails.**
* **Super hard to debug**,
* Starting **one container** will automatically start **all services** (even the ones we don’t need).
* So, **very difficult to manage**.

👉 It’s **better** to put **each service in its own container** →

* Easy to manage,
* Easy to scale,
* Easy to debug,
* Easy to monitor.

✅ **BUT** → Running multiple containers for each service manually is a headache:

* Have to manage **ports**,
* Set **env variables** for each,
* **Manually mount volumes**,
* **Manually create networks and link containers**,
* **Manually start/stop each container**.

👉 This is the **exact problem** Docker Compose solves:

* You write a **`docker-compose.yml`** file →

  * Define services,
  * Set env variables, ports, volumes,
  * Define networks,
  * Define dependencies.
* Then just **run** that file:

  * It **starts all services** on the correct ports,
  * **Mounts volumes**,
  * **Links containers**,
  * **Creates networks**,
  * And makes **start/stop** super easy.

---
 **Compose = Simplifies multi-container management**. 
so,
If I need to run multiple containers with different images, I have to execute:
`docker run -it -p 1025:1025 -e key=value -e key=value image_name`
**multiple times**.

This is **tedious**—especially in a team:

* Everyone needs to know **which containers** to run,
* The **ports**,
* The **environment variables**,
* And all other configs.

👉 **Docker Compose** simplifies this by defining everything in one `docker-compose.yml`.

---
docker compose--used when we required to run multiple containers--

**Provide configuration in `docker-compose.yml` file like this:**

```yaml
version: '3.8'  # Docker Compose version

services:
  <any-name-you-want>:
    image: postgres  # pulled from hub.docker.com
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: review
      POSTGRES_PASSWORD: password

  <one-more-service-name>:
    image: redis
    ports:
      - '6379:6379'
```

---

### Then in terminal (same folder where `docker-compose.yml` exists):

```bash
docker compose up
```
This will:

* Pull all configured images,
* Start containers with respective configurations.

---

### Other useful commands:

```bash
docker compose down
```
* Stops and removes the **containers** (images remain locally).

```bash
docker compose up -d
```

* Runs containers **in the background (detached mode)**,
* Frees up your terminal for other work.

---

When you create a container from Docker images like MySQL, PostgreSQL, or MongoDB, the respective DBMS server (e.g., mysqld, postgres, mongod) runs inside the container.
These images also include the CLI tools (like mysql, psql, mongosh), so any commands you run inside the container’s terminal interact directly with the DBMS server.


### 🧾 Docker networking

Starting from the host PC:
Your PC connects to the internet through an ethernet cable plugged into a Network Interface Card (NIC) — a physical device responsible for sending and receiving data.
This cable goes to a router, which in turn connects to your ISP.

The PC’s networking is managed in a network namespace — a software layer that holds all the network-related details like IP address, MAC, routing table, and active network processes.

---

### When we create a container:

Each container gets its own **network namespace** and its own **virtual NIC (vNIC)** — meaning each container is completely isolated from the host pc and other containers because they are in their own network namespaces.
They are **completely separated**.

---

### When we create a **custom bridge network**:

* It acts like a **virtual switch**.
* One end of this switch (bridge) links to **host’s physical NIC**.
* Each container can connect to this virtual switch.
* Docker creates a **veth pair** (virtual Ethernet cable):

  * One end goes **inside the container** (acts as its **vNIC**).
  * The other end stays in the  **bridge** (virtual switch).

This setup enables:

* Access to the internet.
* Communication between containers connected to the same bridge.
* Communication with the bridge.

---

### 🔐 **Why Can't a Container Fully Access the Host Even When Connected to the Bridge?**  

Even though a container can access the host’s physical NIC **via the bridge**, it remains in its **own separate network namespace**, meaning:  

- It **doesn't share** the host’s IP stack, routing table, or active sockets.  
- **Ports must be explicitly exposed/forwarded** for the host to accept incoming traffic from the container.  
- The container **cannot see or interact** with the host’s processes or services unless permissions and port mappings are configured.  
- **Firewall/NAT rules** may further restrict access.  

### **How a Container Accesses the Internet**  

1. The container sends data via its **virtual NIC**.  
2. This data reaches the **Docker bridge**.  
3. The bridge forwards the data to the **host’s physical NIC**.  
4. The physical NIC sends it to the **router**, which then routes it to the **internet**.  

### **Port Exposing**  

Port mapping ensures that requests to a port on the **host machine (e.g., 8080)** are forwarded to the corresponding port **inside the container (e.g., 80)**, enabling external access to containerized services.  


Containers on a bridge network can communicate with each other and the bridge's IP but cannot directly access the host’s physical IP or network stack, as the bridge functions as a virtual switch connected to the host’s NIC rather than its namespace. While this setup allows containers to reach the external world (Internet) via the host’s NIC, the outside world cannot directly access containers due to their isolated namespace. To enable external access, ports must be exposed—port mapping ensures that incoming requests (e.g., to port 8080 on the host machine) are forwarded to the appropriate container.

### When we run a container with `--network=host`:

```bash
docker run -it --network=host busybox
```

This container uses the **host's network namespace directly**.

➡️ It does **not** get its own network namespace.
➡️ It does **not** get its own vNIC either — it uses the **host’s real NIC directly**.

> ✅ So, no virtual switch, no veth pair. It becomes **part of the host network**, just like any regular app on your system.share same ip of host.

🔓 Because it shares the namespace:

* No need for port forwarding — container can bind to any port directly.
* It can access all network-related info of the host (IP, open ports, etc.).
* It can interfere with services running on the host if not careful.

---
Here's the data flow for a container in host network mode accessing the internet:

1. The container sends out data, which goes to its own network namespace. But since it's in host network mode, this is effectively the same as the host's network namespace.
2. The data is then sent to the host PC's network stack, which is connected to the physical NIC.
3. The physical NIC sends this data to your router.
4. The router then sends it out to the internet.

So, here a request to localhost:8080 is directly handled by the container without any port mapping.
## Docker Networking: Key Commands & Concepts

### 🔹 See how many containers are connected to a network

```bash
docker network inspect bridge
docker network inspect <network_name>
```

### 🔹 Networking Basics

* Docker creates a **bridge network** by default on the host machine.
* All containers are, by default, connected to this bridge, enabling them to talk to the internet.

### 🔹 Check available network drivers

```bash
docker network ls
```

By default, Docker uses the **bridge** network driver.

---


### 3️⃣ **None** Network Driver

```bash
docker run -it --network=none busybox
```

* The container has **no network access**.

---

## Understanding Network Namespaces

In Docker, each container has its own network namespace, regardless of which network it’s connected to. This is true even when multiple containers are connected to the same network.

Here’s why: The purpose of a network namespace is to provide isolation for a container’s network resources. This means that each container has its own set of network interfaces, IP addresses, routing tables, and so on, which are all isolated from those of other containers. This isolation is maintained even when containers are connected to the same network.

So, while multiple containers can communicate with each other when they’re connected to the same network, they do not share a network namespace. Each container’s network resources are still isolated within its own network namespace.
but When a Docker container is run in host mode, it shares the same network namespace as the host machine. This means it uses the same network interfaces, IP addresses, routing tables, and so on, as the host machine. It’s as if the container is running directly on the host’s network. This can improve network performance, but it also means the container is less isolated from the host, which might be a concern depending on your security requirements.

---

## User-Defined Bridge Networks

### Create a user-defined bridge

```bash
docker network create -d bridge social
docker run -it --network=social busybox
```
-d bridge specifies the driver (bridge mode). You can omit -d because bridge is the default driver
### Differences: User-Defined vs. Default Bridge

| Feature        | Default Bridge          | User-Defined Bridge                          |
| -------------- | ----------------------- | -------------------------------------------- |
| DNS Resolution | No (IP only)            | Yes (by container name)                      |
| Isolation      | Basic                   | Better isolation; scoped to specific network |
| Flexibility    | Limited (global config) | Configurable per network                     |

**Note:**

* Containers without a `--network` flag attach to the default bridge.
* This can cause unrelated containers to communicate, posing a security risk.
* Use **user-defined networks** for better isolation and control.

### Remove a user-defined network

```bash
docker network rm milkyway
```

---

## Connect a Container to Multiple Networks

* **Add** an existing container to a network:

  ```bash
  docker network connect <network_name> <container_name_or_id>
  ```

* **Disconnect** a container from a network:

  ```bash
  docker network disconnect <network_name> <container_name_or_id>
  ```

---

## 🐳 Docker Network Drivers Summary

---

### 1️⃣ **Bridge** (Default)

* Containers are connected to a **default bridge network** unless specified.
* Isolated from the host network.
* Requires port mapping to communicate with the host.

---

### 2️⃣ **Host** Network Driver

```bash
docker run -it --network=host busybox
```

* Shares the **host’s network namespace**:

  * Same IP address
  * Same ports
  * Same routing table
* ✅ **Pros**: Better network performance.
* ❌ **Cons**: Less isolation; full access to host’s network.

---

### 3️⃣ **Overlay Network**

* Connects **multiple Docker daemons** (typically used in Swarm).
* Enables containers on different hosts to communicate securely.
* Useful for multi-host networking.

---

### 4️⃣ **IPvlan**

* Containers get **unique IPs** while sharing the **host’s NIC**.
* Operates in L2 or L3 mode.
* No port mapping needed.
* Great for **controlled IP management**.

---

### 5️⃣ **Macvlan**

* Each container gets its own MAC address and IP, and connects directly to the router.
* Appears as a **separate device** to the router.
* Behaves like a **virtual machine** on the network.
* Ideal for integrating containers into an existing physical network.

---

### 6️⃣ **None**

* **Disables all networking**:

  * No IP address
  * No MAC address
  * No virtual NIC or connectivity
* Used for **security** or custom networking setups.

---


## 🐳 Docker Volumes

### 🟢 Why Use Volumes?

When you delete a container, its data is gone.
To **save data** and **reuse it**, we use **volumes**.

---

## 🟢 Types of Docker Volumes

✅ **Both store data on host disk**.
✅ Host volume: You manage folder. use case:Edit code on PC, see changes inside container.
✅ Named volume: Docker manages location. use case: You want to share files/configs/code between your PC and container

---

## 🟢 Why Named Volumes are Better for Persistent Data

✅ In **named volumes**, Docker **chooses the storage location** (usually under `/var/lib/docker/volumes/`).
✅ Docker **manages the storage** — this means:

* It’s **more secure** for important data (like databases).
* It’s **easier to back up, restore, and migrate** — Docker handles the details.
* There’s **less risk of breaking** when Docker updates, because Docker controls the volume setup.

---

🔸 In **host volumes**, **you** choose the location and manage everything.

* This means **more work for you**:

  * You need to remember where the data is stored.
  * You have to handle backups, permissions, and migrations yourself.
  * If something goes wrong with the host filesystem, your data could break.

---

### 🔥 Conclusion

For **persistent data** like databases or app data that must not be lost:
✅ **Use named volumes.**
For **config files, code, logs**, where you want to edit from the host:
✅ Use **host volumes**.


---

## 🟢 Commands

### Host Volume

#### 1️⃣ Create & Run Container with Host Volume

```bash
docker run -it -v "D:\myfolder:/data" ubuntu
```

#### 2️⃣ Run Another Container with Existing Host Volume

Just **use the same host folder**:

```bash
docker run -it -v "D:\myfolder:/abc" busybox
```

---

### Named Volume

#### 1️⃣ Create a Named Volume

```bash
docker volume create my_volume
```

#### 2️⃣ Run Container with Named Volume

```bash
docker run -it -v my_volume:/data ubuntu
```

#### 3️⃣ Run Another Container with Existing Named Volume

```bash
docker run -it -v my_volume:/xyz busybox
```

---

### Manage Volumes

* **List volumes**

  ```bash
  docker volume ls
  ```
* **Inspect a volume**

  ```bash
  docker volume inspect my_volume
  ```
* **Delete a volume**

  ```bash
  docker volume rm my_volume
  ```

---

### If you have an existing application image and want to contribute, you have two main options:

1. Run a container from that image, mount your local code directory as a volume inside the container, do your coding locally (with full environment support from the container), then update the Dockerfile to reflect your changes, commit your changes in Git, and finally build a new image. This is best for development because it keeps your code versioned, environment consistent, and avoids rebuilding the image for every change.

2. Alternatively, you can run the container, make changes inside it, and commit those changes with `docker commit` to create a new image, but this approach is not recommended because it lacks version control, reproducibility, and clear documentation of changes.

---

## 1️⃣ **Single-Container App (like a React app):**

✅ Your flow:

* You develop the React app in a single container.
* After your work, you **create an image** (`myreactapp:latest`).
* Virat runs a container from that image, mounts his code via volume, and does his work.
* Virat updates the Dockerfile (if needed), commits changes to Git, and builds a new image.

✅ **Is this good?**
✅ **Yes, for small, single-container apps**—this is acceptable.
But:

* **Version control** is mostly done via Git (not Docker commits).
* **Volumes help Virat do live coding** without needing to rebuild the image.

---

## 2️⃣ **Multi-Container App (MERN stack: Node + Redis + MongoDB):**

✅ Your flow:

* You develop the Node.js app along with Redis and MongoDB using Docker Compose.
* After your work, you:

  * Create a **Node.js image** via a Dockerfile (with all your app code baked in).
  * Write a **`docker-compose.yml`** file for Redis + MongoDB + Node (using your built Node.js image).
* Share your **Node.js image + `docker-compose.yml`** with Virat.

✅ Virat’s flow:

1. **Downloads your Node.js image + `docker-compose.yml`**
2. Runs `docker-compose up` using your file, which:

   * Automatically runs your custom Node.js image (with app code inside)
   * Pulls official Redis and MongoDB images
   * Spins up all three containers, connected on the same network
3. (Optional) Mounts local code via volume for live dev in the Node container
4. Updates Dockerfile(s) as needed (e.g., for Node, Python), commits changes to Git, builds updated images
5. Updates `docker-compose.yml` with new custom images, ports, and envs

✅ **Is this good?**
✅ **Yes, this is the best industry approach.**

* Multi-container apps use **Docker Compose** for both development and deployment.
* Each service runs in its own isolated container.

---
### summary
You create the Node.js image with your code baked in. Virat runs docker-compose up with your compose file, which pulls your Node image + Redis + MongoDB images and runs all containers. No need for Virat to manually run the Node image before compose. This way, Virat gets the full app stack running with your code—perfect for collaboration and easy to maintain.

If multiple developers need to work, all they need is your custom Node.js image (with app code baked in) plus the same docker-compose.yml file.
This ensures everyone spins up the exact same environment (Node + Redis + MongoDB) easily and consistently.

Later, each developer can create custom images from their work and share them with the team. We can then use their custom Node.js image, custom Python image, etc., in the docker-compose.yml, so the next developer can continue from where the last one left off.
---
### extra
Compose creates and uses a user-defined bridge network automatically attach all the service in that network. Specify networks in docker-compose.yml only if you want to use or customize a particular network.

Dockerfile builds single image (usually for single service/app).

docker-compose.yml defines and runs multiple containers from multiple images—some can be official images (like Redis), others your custom-built images (like your Node app).













