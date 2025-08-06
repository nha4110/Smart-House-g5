https://smart-house-g5.vercel.app/
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

---

## Setup and Run Instructions

Open your terminal or command prompt and run the following commands step-by-step:

```bash
# 1. Clone the repository (replace with actual URL)
git clone https://github.com/yourusername/Smart-House-g5.git

# 2. Change directory into the project folder
cd Smart-House-g5/smart-app

split the termial in 2

## The first terminal
cd backend2
npm install
make .env
**
PORT=8081
DATABASE_URL=postgresql://neondb_owner:npg_xl1DVLsv3Gyj@ep-royal-firefly-a1q38ta4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
**
npm run dev

Do the same for frontend
cd smart-app
npm install
npm run dev

## If any error happen in frontend make this 2 file

make smart-app/vite-env.d.ts
**
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: 'development' | 'production';
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
**

