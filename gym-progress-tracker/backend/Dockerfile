FROM node:18

WORKDIR /app

# Kopieren Sie nur die package.json-Dateien zunächst, um die Caching-Vorteile von Docker zu nutzen
COPY package*.json ./
RUN npm install

# Dann den Rest des Codes kopieren
COPY . .

# Stellen Sie sicher, dass der PORT aus der Umgebung verwendet wird (wichtig für Render)
ENV PORT=10000
EXPOSE 10000

# Umgebungsvariable für Produktionsumgebung setzen
ENV NODE_ENV=production

CMD ["node", "server.js"]