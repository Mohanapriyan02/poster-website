import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DATA_DIR = path.join(ROOT_DIR, 'src', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const COLLECTIONS_FILE = path.join(DATA_DIR, 'collections.json');
const SITE_FILE = path.join(DATA_DIR, 'site.json');
const UPLOAD_DIR = path.join(ROOT_DIR, 'public', 'images', 'posters');
const BACKUPS_DIR = path.join(ROOT_DIR, 'backups');

// Ensure necessary directories exist
[UPLOAD_DIR, BACKUPS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const app = express();
const HOST = '127.0.0.1'; // Strictly localhost only
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images statically
app.use('/images/posters', express.static(UPLOAD_DIR));

// Helper: safe JSON read
function readJson(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) return defaultVal;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultVal;
  }
}

// Helper: create backup snapshot
function createBackup(prefix = 'auto') {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupSubdir = path.join(BACKUPS_DIR, `${prefix}-${timestamp}`);
    fs.mkdirSync(backupSubdir, { recursive: true });
    
    [PRODUCTS_FILE, CATEGORIES_FILE, COLLECTIONS_FILE, SITE_FILE].forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(backupSubdir, path.basename(file)));
      }
    });
    return backupSubdir;
  } catch (err) {
    console.error('Backup creation error:', err);
    return null;
  }
}

// Helper: atomic JSON write with backup
function atomicWriteJson(filePath, data, createBackupSnapshot = true) {
  if (createBackupSnapshot) {
    createBackup('pre-mutation');
  }
  const tmpFile = `${filePath}.tmp-${Date.now()}`;
  const serialized = JSON.stringify(data, null, 2);
  fs.writeFileSync(tmpFile, serialized, 'utf8');
  fs.renameSync(tmpFile, filePath);
}

// Helper: validate product payload
function validateProduct(p, existingProducts, isUpdate = false, currentId = null) {
  if (!p || typeof p !== 'object') return 'Invalid product payload.';
  if (!p.name || typeof p.name !== 'string' || !p.name.trim()) return 'Poster name is required.';
  if (!p.id || typeof p.id !== 'string' || !p.id.trim()) return 'Product ID is required.';
  if (!p.slug || typeof p.slug !== 'string' || !p.slug.trim()) return 'URL slug is required.';
  if (!p.category || !p.categorySlug) return 'Category is required.';

  // ID uniqueness
  const duplicateId = existingProducts.find(item => item.id.toLowerCase() === p.id.toLowerCase() && (!isUpdate || item.id !== currentId));
  if (duplicateId) return `Product ID "${p.id}" already exists. Please choose a unique ID.`;

  // Slug uniqueness
  const duplicateSlug = existingProducts.find(item => item.slug.toLowerCase() === p.slug.toLowerCase() && (!isUpdate || item.id !== currentId));
  if (duplicateSlug) return `URL Slug "${p.slug}" already exists. Please choose a unique slug.`;

  // Pricing & discount sanity check
  if (p.regularPrice !== undefined && Number(p.regularPrice) < 0) {
    return 'Regular price cannot be negative.';
  }
  if (p.discount && p.discount.enabled) {
    if (Number(p.discount.value) < 0) return 'Discount value cannot be negative.';
    if (p.discount.salePrice !== undefined && Number(p.discount.salePrice) < 0) {
      return 'Sale price cannot be negative.';
    }
    if (p.regularPrice && p.discount.salePrice && Number(p.discount.salePrice) > Number(p.regularPrice)) {
      return 'Sale price cannot exceed the regular price.';
    }
  }

  return null;
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const uniqueName = `${Date.now()}-${baseName}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and WebP image formats are permitted.'));
    }
  }
});

// ======================== ROUTES ========================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'poster-admin-local-backend',
    host: HOST,
    port: PORT,
    productsCount: readJson(PRODUCTS_FILE).length
  });
});

// --- PRODUCTS ---

// GET all products
app.get('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  res.json(products);
});

// GET single product by id or slug
app.get('/api/products/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const products = readJson(PRODUCTS_FILE);
  const found = products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!found) {
    return res.status(404).json({ error: 'Poster not found.' });
  }
  res.json(found);
});

// POST create new product
app.post('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const newProduct = req.body;

  const error = validateProduct(newProduct, products, false);
  if (error) {
    return res.status(400).json({ error });
  }

  // Ensure default fields
  newProduct.status = newProduct.status || 'published';
  newProduct.available = newProduct.available !== undefined ? newProduct.available : true;
  newProduct.sizes = newProduct.sizes && newProduct.sizes.length > 0 ? newProduct.sizes : ['A4', 'A3', 'A2', 'A1'];
  newProduct.galleryImages = Array.isArray(newProduct.galleryImages) ? newProduct.galleryImages : [];
  newProduct.tags = Array.isArray(newProduct.tags) ? newProduct.tags : [];
  newProduct.lastModified = new Date().toISOString();

  // If price object missing but regularPrice present, build price object
  if (!newProduct.price && newProduct.regularPrice) {
    const reg = Number(newProduct.regularPrice);
    newProduct.price = {
      A4: reg,
      A3: Math.round(reg * 1.5),
      A2: Math.round(reg * 2.5),
      A1: Math.round(reg * 3.8)
    };
  }

  products.unshift(newProduct); // Add to beginning of catalog
  atomicWriteJson(PRODUCTS_FILE, products);

  res.status(201).json({
    success: true,
    message: `Poster "${newProduct.name}" created successfully.`,
    product: newProduct
  });
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Poster with ID "${id}" not found.` });
  }

  const updatedData = { ...products[index], ...req.body };
  const error = validateProduct(updatedData, products, true, id);
  if (error) {
    return res.status(400).json({ error });
  }

  updatedData.lastModified = new Date().toISOString();
  products[index] = updatedData;
  atomicWriteJson(PRODUCTS_FILE, products);

  res.json({
    success: true,
    message: `Poster "${updatedData.name}" updated successfully.`,
    product: updatedData
  });
});

// POST toggle publication status (published/draft)
app.post('/api/products/:id/toggle-status', (req, res) => {
  const { id } = req.params;
  const products = readJson(PRODUCTS_FILE);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Poster not found.' });
  }

  product.status = product.status === 'draft' ? 'published' : 'draft';
  product.lastModified = new Date().toISOString();
  atomicWriteJson(PRODUCTS_FILE, products);

  res.json({
    success: true,
    message: `Poster status changed to ${product.status}.`,
    status: product.status,
    product
  });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  let products = readJson(PRODUCTS_FILE);
  const productToDelete = products.find(p => p.id === id);

  if (!productToDelete) {
    return res.status(404).json({ error: `Poster with ID "${id}" not found.` });
  }

  // Remove from catalog
  products = products.filter(p => p.id !== id);
  atomicWriteJson(PRODUCTS_FILE, products);

  // Check if image is local and not referenced by any remaining product before deleting
  const imagePath = productToDelete.image;
  if (imagePath && imagePath.startsWith('/images/posters/')) {
    const fileName = path.basename(imagePath);
    const isShared = products.some(p => 
      p.image === imagePath || 
      p.secondaryImage === imagePath || 
      (p.galleryImages && p.galleryImages.includes(imagePath))
    );
    if (!isShared) {
      const localFile = path.join(UPLOAD_DIR, fileName);
      if (fs.existsSync(localFile)) {
        try {
          fs.unlinkSync(localFile);
          console.log(`Unlinked unused image file: ${fileName}`);
        } catch (e) {
          console.warn(`Could not delete file ${fileName}:`, e);
        }
      }
    }
  }

  res.json({
    success: true,
    message: `Poster "${productToDelete.name}" deleted successfully.`
  });
});

// --- CATEGORIES ---

app.get('/api/categories', (req, res) => {
  const categories = readJson(CATEGORIES_FILE);
  const products = readJson(PRODUCTS_FILE);
  const mapped = categories.map(cat => ({
    ...cat,
    posterCount: products.filter(p => p.categorySlug === cat.slug).length
  }));
  res.json(mapped);
});

app.post('/api/categories', (req, res) => {
  const categories = readJson(CATEGORIES_FILE);
  const cat = req.body;

  if (!cat.name || !cat.slug) {
    return res.status(400).json({ error: 'Category name and slug are required.' });
  }

  const existingIndex = categories.findIndex(c => c.id === cat.id || c.slug === cat.slug);
  if (existingIndex >= 0) {
    categories[existingIndex] = { ...categories[existingIndex], ...cat };
  } else {
    cat.id = cat.id || `cat-${Date.now()}`;
    categories.push(cat);
  }

  atomicWriteJson(CATEGORIES_FILE, categories);
  res.json({ success: true, category: cat });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const categories = readJson(CATEGORIES_FILE);
  const cat = categories.find(c => c.id === id || c.slug === id);

  if (!cat) {
    return res.status(404).json({ error: 'Category not found.' });
  }

  // Guard: check if any posters currently use this category
  const products = readJson(PRODUCTS_FILE);
  const assigned = products.filter(p => p.categorySlug === cat.slug);
  if (assigned.length > 0) {
    return res.status(400).json({
      error: `Cannot delete "${cat.name}": ${assigned.length} posters are currently assigned to this category. Please reassign those posters first.`
    });
  }

  const updated = categories.filter(c => c.id !== cat.id);
  atomicWriteJson(CATEGORIES_FILE, updated);
  res.json({ success: true, message: `Category "${cat.name}" deleted.` });
});

// --- COLLECTIONS ---

app.get('/api/collections', (req, res) => {
  const collections = readJson(COLLECTIONS_FILE);
  res.json(collections);
});

app.post('/api/collections', (req, res) => {
  const collections = readJson(COLLECTIONS_FILE);
  const col = req.body;

  if (!col.name || !col.slug) {
    return res.status(400).json({ error: 'Collection name and slug are required.' });
  }

  const existingIndex = collections.findIndex(c => c.id === col.id || c.slug === col.slug);
  if (existingIndex >= 0) {
    collections[existingIndex] = { ...collections[existingIndex], ...col };
  } else {
    col.id = col.id || `col-${Date.now()}`;
    collections.push(col);
  }

  atomicWriteJson(COLLECTIONS_FILE, collections);
  res.json({ success: true, collection: col });
});

app.delete('/api/collections/:id', (req, res) => {
  const { id } = req.params;
  const collections = readJson(COLLECTIONS_FILE);
  const updated = collections.filter(c => c.id !== id && c.slug !== id);
  atomicWriteJson(COLLECTIONS_FILE, updated);
  res.json({ success: true, message: 'Collection deleted.' });
});

// --- SETTINGS (src/data/site.json) ---

app.get('/api/settings', (req, res) => {
  const settings = readJson(SITE_FILE, {});
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  if (!newSettings || typeof newSettings !== 'object') {
    return res.status(400).json({ error: 'Invalid settings payload.' });
  }
  atomicWriteJson(SITE_FILE, newSettings);
  res.json({ success: true, settings: newSettings, message: 'Website configuration updated.' });
});

// --- IMAGE UPLOADS ---

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }
  const relativeUrl = `/images/posters/${req.file.filename}`;
  res.json({
    success: true,
    url: relativeUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

app.post('/api/upload-multiple', upload.array('images', 8), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded.' });
  }
  const urls = req.files.map(f => `/images/posters/${f.filename}`);
  res.json({
    success: true,
    urls
  });
});

// --- BACKUPS & SNAPSHOTS ---

app.get('/api/backups', (req, res) => {
  try {
    const list = fs.readdirSync(BACKUPS_DIR).map(name => {
      const p = path.join(BACKUPS_DIR, name);
      const stat = fs.statSync(p);
      return { name, createdAt: stat.birthtime || stat.mtime };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list backups.' });
  }
});

app.post('/api/backup', (req, res) => {
  const backupDir = createBackup('manual');
  if (backupDir) {
    res.json({ success: true, message: `Backup created at ${path.basename(backupDir)}` });
  } else {
    res.status(500).json({ error: 'Failed to create backup.' });
  }
});

app.post('/api/restore', (req, res) => {
  const { backupName } = req.body;
  if (!backupName || typeof backupName !== 'string') {
    return res.status(400).json({ error: 'Backup name is required.' });
  }
  // Sanitize name to prevent directory traversal
  const safeName = path.basename(backupName);
  const backupPath = path.join(BACKUPS_DIR, safeName);
  if (!fs.existsSync(backupPath)) {
    return res.status(404).json({ error: 'Backup not found.' });
  }

  try {
    // Create pre-restore safety snapshot
    createBackup('pre-restore');

    [
      { src: path.join(backupPath, 'products.json'), dest: PRODUCTS_FILE },
      { src: path.join(backupPath, 'categories.json'), dest: CATEGORIES_FILE },
      { src: path.join(backupPath, 'collections.json'), dest: COLLECTIONS_FILE },
      { src: path.join(backupPath, 'site.json'), dest: SITE_FILE }
    ].forEach(({ src, dest }) => {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    });

    res.json({ success: true, message: `Catalogue successfully restored from ${safeName}` });
  } catch (err) {
    console.error('Restore error:', err);
    res.status(500).json({ error: 'Failed to restore backup.' });
  }
});

// POST /api/git/push - 1-Click Sync to GitHub Repository
app.post('/api/git/push', async (req, res) => {
  try {
    // Stage modified catalogue data and images
    await execAsync('git add src/data/ public/images/', { cwd: ROOT_DIR });
    
    // Check if there are uncommitted changes
    try {
      await execAsync('git commit -m "chore(catalogue): sync updates from Admin Console"', { cwd: ROOT_DIR });
    } catch (commitErr) {
      // Nothing to commit is fine
    }

    // Push to GitHub origin main
    await execAsync('git push origin main', { cwd: ROOT_DIR });

    res.json({
      success: true,
      message: 'Catalogue changes pushed to GitHub! The live website is rebuilding and updating on GitHub Pages.',
      repoUrl: 'https://github.com/Mohanapriyan02/poster-website',
      liveUrl: 'https://mohanapriyan02.github.io/poster-website/'
    });
  } catch (err) {
    console.error('Git push error:', err);
    res.status(500).json({ error: err.message || 'Failed to push changes to GitHub.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

app.listen(PORT, HOST, () => {
  console.log(`[LOCAL ADMIN BACKEND] Running strictly on http://${HOST}:${PORT}`);
});
