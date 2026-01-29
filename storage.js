// Local storage utility functions
const STORAGE_KEYS = {
  PRODUCTS: 'gadgetstore_products',
  SALES: 'gadgetstore_sales',
  SETTINGS: 'gadgetstore_settings',
  CATEGORIES: 'gadgetstore_categories',
  BRANDS: 'gadgetstore_brands',
  EXPENSES: 'gadgetstore_expenses'
};

// Product storage functions
function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Sales storage functions
function saveSales(sales) {
  try {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch (error) {
    console.error('Error saving sales:', error);
  }
}

function loadSales() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading sales:', error);
    return [];
  }
}

// Settings storage functions
function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

function loadSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      currency: 'NGN',
      taxRate: 0,
      storeName: 'GadgetStore Pro',
      lowStockThreshold: 10
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {};
  }
}

// Export/Import functions
function exportData() {
  try {
    const data = {
      products: loadProducts(),
      sales: loadSales(),
      settings: loadSettings(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gadgetstore_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

// Category storage functions
function saveCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
}

function loadCategories() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [
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

// Brand storage functions
function saveBrands(brands) {
  try {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
  } catch (error) {
    console.error('Error saving brands:', error);
  }
}

function loadBrands() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BRANDS);
    return data ? JSON.parse(data) : [
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

// Expense storage functions
function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses:', error);
  }
}

function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    window.location.reload();
  }
}
