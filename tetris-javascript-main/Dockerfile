# Usa la imagen base de nginx
FROM nginx:latest

# Copia los archivos del proyecto a la carpeta predeterminada de nginx
COPY . /usr/share/nginx/html

# Expone el puerto 80 para acceder al juego
EXPOSE 80

# Inicia el servidor de nginx
CMD ["nginx", "-g", "daemon off;"]
