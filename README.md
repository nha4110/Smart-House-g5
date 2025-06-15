# Smart-House-g5

A React-based Smart Home app developed by Group 5.

---

## Requirements

- **Node.js** (version 20.18 or higher)  
  Download and install Node.js from:  
  [https://nodejs.org/en/download](https://nodejs.org/en/download)

- **Git** (to clone the repository)  
  Download and install Git from:  
  [https://git-scm.com/downloads](https://git-scm.com/downloads)

- **Ubuntu** (to clone the repository)  
  Download and install Ubuntu from:  
  [https://apps.microsoft.com/detail/9PDXGNCFSCZV?hl=en-us&gl=US&ocid=pdpshare](Ubuntu)

- **Docker** (to clone the repository)  
  Download and install Docker from:  
  [https://www.docker.com/](Docker)
---

## Setup and Run Instructions

Open your terminal or command prompt and run the following commands step-by-step:

```bash
# 1. Clone the repository (replace with actual URL)
git clone https://github.com/yourusername/Smart-House-g5.git

# 2. Change directory into the project folder
cd Smart-House-g5/smart-app

# 3. Install dependencies
npm install

# 4. Start the development server
npm start


---
```bash

## how to run docker & thingsboard

cd Tb-docker
docker volume create mytb-data
docker volume create mytb-logs
docker compose logs -f thingsboard-ce


## how to run the fe

cd smart-app
npm run dev (if that don't work than do the command below)
cd smart-app
npm install vite @vitejs/plugin-react --save-dev
npm install --save-dev @types/node
npm install --save-dev @types/react @types/react-dom
-- close vscode and re-open it --
cd smart-app
=> npm run dev