const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Configuration de la connexion à la base de données
mongoose.connect('mongodb://localhost:27017/Ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à la base de données établie'))
  .catch((err) => console.error('Erreur lors de la connexion à la base de données', err));

// Définition du schéma du produit
const productSchema = new mongoose.Schema({
  slug: String,
  name: String,
  price: Number
});

// Définition du modèle du produit
const Product = mongoose.model('Product', productSchema);

// Route pour afficher les détails d'un produit à partir du slug
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;

  // Recherche du produit correspondant au slug
  Product.findOne({ slug }, (err, product) => {
    if (err) {
      console.error('Erreur lors de la recherche du produit', err);
      res.render('product', { product: null });
      return;
    }

    // Affichage du produit s'il a été trouvé, sinon affichage d'un message d'erreur
    res.render('product', { product: product || null });
  });
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
