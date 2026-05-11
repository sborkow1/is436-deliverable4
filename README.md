# CueVision
CueVision is a billiards match recording and retrieval system. Players can create an account, log in, record their pool matches using an overhead table camera, and retrieve past recordings to review their gameplay.

## pull image
docker pull camronmdb/cuevision:latest

## run container  
docker run -p 8080:80 camronmdb/cuevision:latest

### open in browser
Open http://localhost:8080

### stopping container
docker stop $(docker ps -q)

## Features
- Login / Face ID
- Registration + payment
- Dashboard
- Record matches
- Retrieve recordings

### Demo credentials
- Username: `demo`
- Password: `pool123`

## Docker Hub
Image URL: https://hub.docker.com/r/camronmdb/cuevision/tags

## Tech Stack
- React + TypeScript
- Vite
- Motion (Framer Motion)
- HTML
- CSS
- JS
- React Router
- Nginx (production container)
- Docker + GitHub Actions

## Team
- Camron Headen
- Madeline Davis
- Stephen Borkowicz
- Wilfried Dim
- Jeffrey Buah
