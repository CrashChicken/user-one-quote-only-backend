FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install --only=prod
EXPOSE 3000
CMD ["npm", "run", "start:prod"]