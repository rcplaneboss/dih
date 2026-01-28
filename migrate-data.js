// Data Migration Script
// Run this in browser console to migrate localStorage data to API

async function migrateLocalStorageToAPI() {
  const API_BASE_URL = 'http://localhost:3001/api';
  
  console.log('Starting data migration...');
  
  try {
    // Get localStorage data
    const products = JSON.parse(localStorage.getItem('gadgetstore_products') || '[]');
    const sales = JSON.parse(localStorage.getItem('gadgetstore_sales') || '[]');
    const categories = JSON.parse(localStorage.getItem('gadgetstore_categories') || '[]');
    const brands = JSON.parse(localStorage.getItem('gadgetstore_brands') || '[]');
    const expenses = JSON.parse(localStorage.getItem('gadgetstore_expenses') || '[]');
    const settings = JSON.parse(localStorage.getItem('gadgetstore_settings') || '{}');
    
    console.log(`Found: ${products.length} products, ${sales.length} sales, ${categories.length} categories, ${brands.length} brands, ${expenses.length} expenses`);
    
    // Migrate categories first
    for (const category of categories) {
      try {
        await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: category })
        });
        console.log(`✓ Migrated category: ${category}`);
      } catch (error) {
        console.log(`✗ Failed to migrate category: ${category}`, error);
      }
    }
    
    // Migrate brands
    for (const brand of brands) {
      try {
        await fetch(`${API_BASE_URL}/brands`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: brand })
        });
        console.log(`✓ Migrated brand: ${brand}`);
      } catch (error) {
        console.log(`✗ Failed to migrate brand: ${brand}`, error);
      }
    }
    
    // Migrate products
    const productIdMap = new Map(); // Map old IDs to new IDs
    for (const product of products) {
      try {
        const { id, createdAt, ...productData } = product;
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const newProduct = await response.json();
        productIdMap.set(id, newProduct.id);
        console.log(`✓ Migrated product: ${product.name}`);
      } catch (error) {
        console.log(`✗ Failed to migrate product: ${product.name}`, error);
      }
    }
    
    // Migrate expenses
    for (const expense of expenses) {
      try {
        const { id, timestamp, ...expenseData } = expense;
        await fetch(`${API_BASE_URL}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData)
        });
        console.log(`✓ Migrated expense: ${expense.description}`);
      } catch (error) {
        console.log(`✗ Failed to migrate expense: ${expense.description}`, error);
      }
    }
    
    // Migrate sales (skip for now as they require product ID mapping)
    console.log('⚠️ Sales migration skipped - requires manual handling due to ID changes');
    
    // Migrate settings
    if (Object.keys(settings).length > 0) {
      try {
        await fetch(`${API_BASE_URL}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        console.log('✓ Migrated settings');
      } catch (error) {
        console.log('✗ Failed to migrate settings', error);
      }
    }
    
    console.log('Migration completed! Check the console for any errors.');
    console.log('Note: Sales data was not migrated due to ID changes. You may need to handle this manually.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Usage: Run this function in browser console after starting the backend
// migrateLocalStorageToAPI();