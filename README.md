# Musiki

## Usage
From the project's root:

```bash
cd backend

# OPTIONAL
cp .env.example .env
# Fill .env with JDK9's bin path
# Ex: JAVA_9_PATH="C:\Program Files\Java\jdk-9.0.4\bin"

# REQUIRED
npm install
npm run server

cd ../frontend

npm install
npm start
```

Take note that for the main features of the application to work the server must be up and connected
to the dbpedia API (a message will be printed in the console when it is ready).