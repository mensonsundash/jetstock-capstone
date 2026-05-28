# ----- Stage 1:- Build the react app -----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite needs this at BUILD TIME to know where the API is
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy the built files from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for single-page app routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]