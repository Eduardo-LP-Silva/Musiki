# Musiki
Musiki is a web app that allows a user to search for music related topics and visualize them in a graph. Further information can then be obtained regarding a certain topic by enabling specific filters.

## Overview
The initial search is conducted, appropriately enough, through the search bar, with the help of one of the available filters. If successful, a single node will appear, which can then be selected. If available, a brief description and picture are displayed regarding the node's topic.

![image](https://user-images.githubusercontent.com/32617691/89716403-97087800-d9a4-11ea-8308-8249e197c39e.png)

From here, additional filters can be activated, with each one's results being displayed as children of the selected node. The process can then be repeated with different nodes to obtain further information.

![image](https://user-images.githubusercontent.com/32617691/89716440-f4042e00-d9a4-11ea-9013-9f09d16f32c8.png)

## Usage
From the project's root:

```bash
npm install
npm run server

cd frontend
npm install
npm start
```

Take note that for the main features of the application to work the server must be up and connected
to the dbpedia API (a message will be printed in the console when it is ready).

[Live Demo](https://musiki.herokuapp.com/)
