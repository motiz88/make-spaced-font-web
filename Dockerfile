FROM node:8

RUN apt-get update \
    && apt-get install -y --no-install-recommends python-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN npm install --production
EXPOSE 3000
CMD ["npm start"]
