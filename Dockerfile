# Imagen base con Node
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Copiar también el archivo .env si lo quieres embebido (opcional)
COPY .env .env

# Exponer el puerto en el que corre Express
EXPOSE 3000

# Comando para arrancar la app
CMD ["npm", "start"]
