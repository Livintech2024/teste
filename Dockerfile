FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN chmod +x entrypoint.sh
COPY entrypoint.sh /

EXPOSE 8000

RUN npx prisma migrate

#CMD ["/bin/bash", "/entrypoint.sh"]

# CMD ["npm", "run", "dev"]