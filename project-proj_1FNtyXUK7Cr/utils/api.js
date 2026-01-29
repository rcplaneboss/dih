// API service to replace localStorage functions
const API_BASE_URL = 'https://dih-ten.vercel.app/api';

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  async createProduct(product) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id, updates) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Sales
  async getSales() {
    return this.request('/sales');
  }

  async createSale(sale) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    });
  }

  async createBulkSales(salesData, batchNotes = '', paymentMethod = 'cash') {
    return this.request('/sales/bulk', {
      method: 'POST',
      body: JSON.stringify({ salesData, batchNotes, paymentMethod }),
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(name) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deleteCategory(name) {
    return this.request(`/categories/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  }

  // Brands
  async getBrands() {
    return this.request('/brands');
  }

  async createBrand(name) {
    return this.request('/brands', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deleteBrand(name) {
    return this.request(`/brands/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  }

  // Expenses
  async getExpenses() {
    return this.request('/expenses');
  }

  async createExpense(expense) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  // Settings
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settings) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

const apiService = new ApiService();

// Updated storage functions that use API instead of localStorage
async function saveProducts(products) {
  // This function is no longer needed as products are saved individually via API
  console.warn('saveProducts is deprecated - use apiService.createProduct instead');
}

async function loadProducts() {
  try {
    return await apiService.getProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

async function saveSales(sales) {
  // This function is no longer needed as sales are saved individually via API
  console.warn('saveSales is deprecated - use apiService.createSale instead');
}

async function loadSales() {
  try {
    return await apiService.getSales();
  } catch (error) {
    console.error('Error loading sales:', error);
    return [];
  }
}

async function saveSettings(settings) {
  try {
    return await apiService.updateSettings(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

async function loadSettings() {
  try {
    const settings = await apiService.getSettings();
    return settings || {
      currency: 'NGN',
      taxRate: 0,
      storeName: 'GadgetStore Pro',
      lowStockThreshold: 10
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      currency: 'NGN',
      taxRate: 0,
      storeName: 'GadgetStore Pro',
      lowStockThreshold: 10
    };
  }
}

async function saveCategories(categories) {
  // Categories are now managed individually via API
  console.warn('saveCategories is deprecated - use apiService.createCategory instead');
}

async function loadCategories() {
  try {
    const categories = await apiService.getCategories();
    return categories.length > 0 ? categories : [
      'POWERBANK', 'CLIPPER', 'EXTENSIONS BOX', 'AUX WIRE', 'FAN', 'RINGLIGHT', 
      'K9 MICROPHONE', 'ORAIMO SMART WATCH', 'BL 5C BATTERY', '25BT BATTERY', 
      '21CL BATTERY', 'IIDT', 'I5DT', '24ET', '40DT', 'CLIPPERS', 'EARBUDS', 
      'EARPHONES', 'MP3S', 'CAR CHARGERS', 'FLASH DRIVES', 'CARD READERS', 
      'MEMORY CARDS', 'ADAPTERS', 'UK ADAPTERS', 'TRIMMERS', 'SMALL PHONES', 
      'SELFIE STICK'
    ];
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

async function saveBrands(brands) {
  // Brands are now managed individually via API
  console.warn('saveBrands is deprecated - use apiService.createBrand instead');
}

async function loadBrands() {
  try {
    const brands = await apiService.getBrands();
    return brands.length > 0 ? brands : [
      'ORAIMO', 'ITEL', 'TELEXON', 'INFINIX', 'SH PLUS', 'GPOWER', 'DAGE', 
      'FLICK', 'FOOMEE', 'CHUPEZ', 'APPLE', 'TRANSPARENT', 'SAMSUNG', 
      'CENTMARK', 'JAMAX', 'MAJOR', 'BAMIPLUS', 'POGA', 'REAL', 'ITOP', 
      'HISTER', 'GODFREY LOKO HIGHMARKS', 'MOL', 'AOZENKAI', 'RECREST', 
      'JBL', 'REXI'
    ];
  } catch (error) {
    console.error('Error loading brands:', error);
    return [];
  }
}

async function saveExpenses(expenses) {
  // Expenses are now managed individually via API
  console.warn('saveExpenses is deprecated - use apiService.createExpense instead');
}

async function loadExpenses() {
  try {
    return await apiService.getExpenses();
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
}

function exportData() {
  // This function would need to be updated to fetch data from API
  console.warn('exportData needs to be updated to work with API');
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    console.warn('clearAllData needs to be implemented for API');
    // Would need to call API endpoints to clear data
    window.location.reload();
  }
}