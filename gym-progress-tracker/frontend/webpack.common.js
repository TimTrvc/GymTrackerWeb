const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Lade Umgebungsvariablen aus .env-Datei
const env = dotenv.config().parsed || {};

module.exports = {
  entry: {
    app: './js/app.js',
    auth: './js/auth.js', // Auth als separaten Einstiegspunkt hinzugefügt
    workout: './js/workout.js' // Workout als separaten Einstiegspunkt hinzugefügt
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/[name].js', // Generiert separate Dateien für jeden Einstiegspunkt
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(env.API_URL || "http://localhost:5000"),
      'process.env.AUTH_SECRET': JSON.stringify(env.AUTH_SECRET)
    })
  ],
};
