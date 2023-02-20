docker build -t api-server .
docker run -d -t -p 3000:3000 api-server