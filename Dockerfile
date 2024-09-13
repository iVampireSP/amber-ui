# docker build -t registry.leafdev.top/leaf/amber-web:v0.0.1-fix-4 .
FROM nginx:1.27.0-alpine

COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]