# # Usa una imagen base de Node.js
# FROM node:16

# # Establece el directorio de trabajo en el contenedor
# WORKDIR /app

# # Copia el package.json y package-lock.json para instalar dependencias
# COPY package*.json ./

# # Instala las dependencias
# RUN npm install

# # Copia el resto de los archivos de la aplicación
# COPY . .

# # Expone el puerto de la aplicación
# EXPOSE 3000

# # Comando para iniciar la aplicación
# CMD ["node", "index.js"]
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including dev dependencies to ensure nodemon is available
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the app's code
COPY . .

# Expose port 3000
EXPOSE 3000

# Use nodemon to start the app in development mode
CMD ["nodemon", "index.js"]
