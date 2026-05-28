FROM nginx:alpine

# Copy all static files into Nginx's serving directory
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]