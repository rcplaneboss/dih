const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors({
  origin: ['https://dih-iryq.vercel.app', 'http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
  credentials: true
}));
app.use(express.json());

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales endpoints
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sales', async (req, res) => {
  try {
    const sale = await prisma.sale.create({
      data: req.body
    });
    
    // Update product quantity
    await prisma.product.update({
      where: { id: sale.productId },
      data: {
        quantity: { decrement: sale.quantity },
        lastSold: new Date()
      }
    });
    
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(categories.map(c => c.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: { name: req.body.name }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:name', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { name: req.params.name }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Brands endpoints
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(brands.map(b => b.name));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/brands', async (req, res) => {
  try {
    const brand = await prisma.brand.create({
      data: { name: req.body.name }
    });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/brands/:name', async (req, res) => {
  try {
    await prisma.brand.delete({
      where: { name: req.params.name }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expenses endpoints
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const expense = await prisma.expense.create({
      data: req.body
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({
        data: {}
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: req.body.id || 'default' },
      update: req.body,
      create: req.body
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sales endpoint
app.post('/api/sales/bulk', async (req, res) => {
  try {
    const { salesData, batchNotes, paymentMethod } = req.body;
    const timestamp = new Date();
    const batchId = `BATCH_${Date.now()}`;
    
    const sales = await Promise.all(
      salesData.map(async (saleItem, index) => {
        const product = await prisma.product.findUnique({
          where: { id: saleItem.productId }
        });
        
        if (!product || product.quantity < saleItem.quantity) {
          throw new Error(`Insufficient stock for ${product?.name || 'product'}`);
        }
        
        const sale = await prisma.sale.create({
          data: {
            batchId,
            productId: saleItem.productId,
            productName: product.name,
            brand: product.brand,
            category: product.category,
            quantity: saleItem.quantity,
            price: product.price,
            cost: product.cost,
            subtotal: product.price * saleItem.quantity,
            total: product.price * saleItem.quantity,
            paymentMethod: paymentMethod || 'cash',
            customerNotes: batchNotes || 'Daily sales batch entry',
            saleDate: timestamp.toLocaleDateString(),
            saleTime: timestamp.toLocaleTimeString(),
            timestamp
          }
        });
        
        await prisma.product.update({
          where: { id: saleItem.productId },
          data: {
            quantity: { decrement: saleItem.quantity },
            lastSold: timestamp
          }
        });
        
        return sale;
      })
    );
    
    res.json({ count: sales.length, sales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);
}
module.exports = app;