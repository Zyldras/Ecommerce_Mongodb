var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

// Configuration de la connexion à la base de données
mongoose.connect('mongodb://localhost:27017/Ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à la base de données établie'))
  .catch((err) => console.error('Erreur lors de la connexion à la base de données', err));

// Définition du schéma du produit
const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  slug: String,
  name: String,
  price: Number
}, { collection: "produits" });

// Définition du modèle du produit
const Product = mongoose.model('Product', productSchema);

// Définition du schéma de la catégorie
const categorySchema = new mongoose.Schema({
  slug: String,
  name: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { collection: "categorie" });

// Définition du modèle de la catégorie
const Category = mongoose.model('Category', categorySchema);

// Route pour afficher les détails d'un produit à partir du slug
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    // Recherche du produit correspondant au slug
    console.log(Product.find())
    const product = await Product.findOne({ slug }).exec();
    console.log(product)

    // Affichage du produit s'il a été trouvé, sinon affichage d'un message d'erreur
    res.render('product', { product: product || null });
  } catch (err) {
    console.error('Erreur lors de la recherche du produit', err);
    res.render('product', { product: null });
  }
});

// Route pour afficher tous les produits d'une catégorie à partir du slug
router.get('/category/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    // Recherche de la catégorie correspondant au slug
    const category = await Category.findOne({ slug }).populate('products').exec();

    if (category) {
      // Affichage des produits de la catégorie s'ils existent, sinon affichage d'un message
      res.render('category', { products: category.products, category: slug });
    } else {
      res.render('category', { products: [], category: slug });
    }
  } catch (err) {
    console.error('Erreur lors de la recherche de la catégorie', err);
    res.render('category', { products: [], category: slug });
  }
});

// Route pour afficher la page d'accueil avec la liste des catégories
router.get('/', async (req, res) => {
  try {
    // Récupération de toutes les catégories
    const categories = await Category.find().exec();

    // Affichage des catégories s'il en existe, sinon affichage d'un message
    res.render('index', { categories });
  } catch (err) {
    console.error('Erreur lors de la recherche des catégories', err);
    res.render('index', { categories: [] });
  }
});

module.exports = router;
