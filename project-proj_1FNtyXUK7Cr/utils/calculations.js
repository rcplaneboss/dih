// Calculation utility functions for sales and analytics

function calculateTodaysSales(sales) {
  try {
    const today = new Date().toDateString();
    const todaysSales = sales.filter(sale => {
      const saleDate = new Date(sale.timestamp).toDateString();
      return saleDate === today;
    });
    
    return todaysSales.reduce((total, sale) => total + sale.total, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating today\'s sales:', error);
    return '0.00';
  }
}

function calculateTotalRevenue(sales) {
  try {
    return sales.reduce((total, sale) => total + sale.total, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return '0.00';
  }
}

function calculateTotalProfit(sales) {
  try {
    return sales.reduce((total, sale) => total + (sale.profit || 0), 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating total profit:', error);
    return '0.00';
  }
}

function calculateWeeklySales(sales) {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklySales = sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate >= oneWeekAgo;
    });
    
    return weeklySales.reduce((total, sale) => total + sale.total, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating weekly sales:', error);
    return '0.00';
  }
}

function calculateMonthlySales(sales) {
  try {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    
    return monthlySales.reduce((total, sale) => total + sale.total, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating monthly sales:', error);
    return '0.00';
  }
}

function getTopSellingProducts(sales, products, limit = 5) {
  try {
    const productSales = {};
    
    sales.forEach(sale => {
      if (productSales[sale.productId]) {
        productSales[sale.productId].quantity += sale.quantity;
        productSales[sale.productId].revenue += sale.total;
      } else {
        productSales[sale.productId] = {
          productId: sale.productId,
          productName: sale.productName,
          brand: sale.brand,
          quantity: sale.quantity,
          revenue: sale.total
        };
      }
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  } catch (error) {
    console.error('Error calculating top selling products:', error);
    return [];
  }
}

function getLowStockProducts(products) {
  try {
    return products.filter(product => product.quantity <= product.lowStockThreshold);
  } catch (error) {
    console.error('Error getting low stock products:', error);
    return [];
  }
}

function calculateInventoryValue(products) {
  try {
    return products.reduce((total, product) => {
      return total + (product.cost * product.quantity);
    }, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating inventory value:', error);
    return '0.00';
  }
}

function getSalesByBrand(sales) {
  try {
    const brandSales = {};
    
    sales.forEach(sale => {
      if (brandSales[sale.brand]) {
        brandSales[sale.brand].quantity += sale.quantity;
        brandSales[sale.brand].revenue += sale.total;
      } else {
        brandSales[sale.brand] = {
          brand: sale.brand,
          quantity: sale.quantity,
          revenue: sale.total
        };
      }
    });
    
    return Object.values(brandSales).sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error('Error calculating sales by brand:', error);
    return [];
  }
}

// Expense calculation functions
function calculateTodaysExpenses(expenses) {
  try {
    const today = new Date().toDateString();
    const todaysExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.timestamp).toDateString();
      return expenseDate === today;
    });
    
    return todaysExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating today\'s expenses:', error);
    return '0.00';
  }
}

function calculateTotalExpenses(expenses) {
  try {
    return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    return '0.00';
  }
}

function calculateMonthlyExpenses(expenses) {
  try {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.timestamp);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
  } catch (error) {
    console.error('Error calculating monthly expenses:', error);
    return '0.00';
  }
}
