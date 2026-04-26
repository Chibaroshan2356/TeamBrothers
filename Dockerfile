# Build stage
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production stage
FROM node:18
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]