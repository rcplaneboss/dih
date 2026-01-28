class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentView, setCurrentView] = React.useState('dashboard');
    const [products, setProducts] = React.useState([]);
    const [sales, setSales] = React.useState([]);
    const [showSalesModal, setShowSalesModal] = React.useState(false);
    const [showAddProductModal, setShowAddProductModal] = React.useState(false);
    const [showCategoryBrandModal, setShowCategoryBrandModal] = React.useState(false);
    const [showDailySalesModal, setShowDailySalesModal] = React.useState(false);
    const [showExpenseModal, setShowExpenseModal] = React.useState(false);
    const [showReceiptModal, setShowReceiptModal] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [selectedSale, setSelectedSale] = React.useState(null);
    const [categories, setCategories] = React.useState([]);
    const [brands, setBrands] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);

    // Load data from API on mount
    React.useEffect(() => {
      const loadData = async () => {
        try {
          const [savedProducts, savedSales, savedCategories, savedBrands, savedExpenses] = await Promise.all([
            loadProducts(),
            loadSales(),
            loadCategories(),
            loadBrands(),
            loadExpenses()
          ]);
          setProducts(savedProducts);
          setSales(savedSales);
          setCategories(savedCategories);
          setBrands(savedBrands);
          setExpenses(savedExpenses);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      loadData();
    }, []);

    const addProduct = async (product) => {
      try {
        const newProduct = await apiService.createProduct(product);
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
      }
    };

    const updateProduct = async (productId, updates) => {
      try {
        const updatedProduct = await apiService.updateProduct(productId, updates);
        const updatedProducts = products.map(p => 
          p.id === productId ? updatedProduct : p
        );
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
      }
    };

    const addSale = async (sale) => {
      try {
        const saleData = {
          ...sale,
          receiptNumber: `RCP-${Date.now()}`,
          saleDate: new Date().toLocaleDateString(),
          saleTime: new Date().toLocaleTimeString()
        };
        const newSale = await apiService.createSale(saleData);
        const updatedSales = [...sales, newSale];
        setSales(updatedSales);

        // Update local product state
        const updatedProducts = products.map(p => 
          p.id === sale.productId 
            ? { ...p, quantity: p.quantity - sale.quantity, lastSold: new Date().toISOString() }
            : p
        );
        setProducts(updatedProducts);

        // Show receipt option
        setSelectedSale(newSale);
        setShowReceiptModal(true);
      } catch (error) {
        console.error('Error adding sale:', error);
        alert('Failed to record sale. Please try again.');
      }
    };

    const addCategory = async (category) => {
      if (!categories.includes(category)) {
        try {
          await apiService.createCategory(category);
          const updatedCategories = [...categories, category];
          setCategories(updatedCategories);
        } catch (error) {
          console.error('Error adding category:', error);
          alert('Failed to add category. Please try again.');
        }
      }
    };

    const addBrand = async (brand) => {
      if (!brands.includes(brand)) {
        try {
          await apiService.createBrand(brand);
          const updatedBrands = [...brands, brand];
          setBrands(updatedBrands);
        } catch (error) {
          console.error('Error adding brand:', error);
          alert('Failed to add brand. Please try again.');
        }
      }
    };

    const removeCategory = async (category) => {
      try {
        await apiService.deleteCategory(category);
        const updatedCategories = categories.filter(c => c !== category);
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Error removing category:', error);
        alert('Failed to remove category. Please try again.');
      }
    };

    const removeBrand = async (brand) => {
      try {
        await apiService.deleteBrand(brand);
        const updatedBrands = brands.filter(b => b !== brand);
        setBrands(updatedBrands);
      } catch (error) {
        console.error('Error removing brand:', error);
        alert('Failed to remove brand. Please try again.');
      }
    };

    const addExpense = async (expense) => {
      try {
        const expenseData = {
          ...expense,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        };
        const newExpense = await apiService.createExpense(expenseData);
        const updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
      }
    };

    const processBulkSales = async (salesData, batchNotes = '', paymentMethod = 'cash') => {
      try {
        const result = await apiService.createBulkSales(salesData, batchNotes, paymentMethod);
        
        // Update local state with new sales
        const allSales = [...sales, ...result.sales];
        setSales(allSales);
        
        // Update local product quantities
        const updatedProducts = products.map(product => {
          const soldItem = salesData.find(item => item.productId === product.id);
          if (soldItem) {
            return {
              ...product,
              quantity: product.quantity - soldItem.quantity,
              lastSold: new Date().toISOString()
            };
          }
          return product;
        });
        setProducts(updatedProducts);
        
        return result.count;
      } catch (error) {
        console.error('Error processing bulk sales:', error);
        alert('Failed to process bulk sales. Please try again.');
        return 0;
      }
    };

    const handleSellProduct = (product) => {
      setSelectedProduct(product);
      setShowSalesModal(true);
    };

    const renderCurrentView = () => {
      switch(currentView) {
        case 'dashboard':
          return (
            <Dashboard 
              products={products}
              sales={sales}
              onSellProduct={handleSellProduct}
              onAddProduct={() => setShowAddProductModal(true)}
            />
          );
        case 'inventory':
          return (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Inventory Management</h1>
                  <p className="text-[var(--text-secondary)] mt-1">Manage your product catalog and stock levels</p>
                </div>
                <button 
                  onClick={() => setShowAddProductModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <div className="icon-plus text-sm"></div>
                  Add Product
                </button>
              </div>
              <div className="desktop-grid">
                {products.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onSell={() => handleSellProduct(product)}
                    onUpdate={(updates) => updateProduct(product.id, updates)}
                  />
                ))}
              </div>
            </div>
          );
        case 'sales':
          return (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Sales History</h1>
                <p className="text-[var(--text-secondary)] mt-1">Track all your transactions and sales performance</p>
              </div>
              <div className="space-y-4">
                {sales.slice().reverse().map(sale => (
                  <div key={sale.id} className="card">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{sale.productName}</h3>
                        <p className="text-[var(--text-secondary)]">
                          {sale.brand} • Quantity: {sale.quantity} • Payment: {sale.paymentMethod}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Receipt: {sale.receiptNumber || `RCP-${sale.id}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[var(--accent-color)]">₦{sale.total}</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {new Date(sale.timestamp).toLocaleDateString()} at {new Date(sale.timestamp).toLocaleTimeString()}
                        </p>
                        <button 
                          onClick={() => {
                            setSelectedSale(sale);
                            setShowReceiptModal(true);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          Generate Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'daily-sales':
          return (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Daily Sales Entry</h1>
                  <p className="text-[var(--text-secondary)] mt-1">Record multiple sales at once and update inventory automatically</p>
                </div>
                <button 
                  onClick={() => setShowDailySalesModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <div className="icon-plus text-sm"></div>
                  Record Daily Sales
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <div className="icon-dollar-sign text-xl text-green-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Today's Sales</h3>
                      <p className="text-2xl font-bold text-[var(--accent-color)]">
                        ₦{calculateTodaysSales(sales)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <div className="icon-shopping-cart text-xl text-blue-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Transactions</h3>
                      <p className="text-2xl font-bold">{sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString()).length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <div className="icon-package text-xl text-purple-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Items Sold Today</h3>
                      <p className="text-2xl font-bold">
                        {sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
                          .reduce((sum, sale) => sum + sale.quantity, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Today's Sales History</h3>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString()).length > 0 ? (
                    console.log(sales),
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">#</th>
                          <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Time</th>
                          <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Product</th>
                          <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">Brand</th>
                          <th className="text-center py-2 px-3 font-medium text-[var(--text-secondary)]">Qty</th>
                          <th className="text-right py-2 px-3 font-medium text-[var(--text-secondary)]">Amount</th>
                          <th className="text-right py-2 px-3 font-medium text-[var(--text-secondary)]">Payment Method</th>
                        </tr>
                      </thead>
                      <tbody className="max-h-80 overflow-y-auto">
                        {sales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
                          .slice().reverse().map(sale => (
                          <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <span className="text-xs font-mono bg-[var(--primary-color)] text-white px-2 py-1 rounded">
                                #{sale.serialNumber || 'N/A'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-[var(--text-secondary)]">
                              {sale.saleTime || new Date(sale.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="py-2 px-3 font-medium">{sale.productName}</td>
                            <td className="py-2 px-3 text-[var(--text-secondary)]">{sale.brand}</td>
                            <td className="py-2 px-3 text-center">{sale.quantity}</td>
                            <td className="py-2 px-3 text-right font-bold text-[var(--accent-color)]">₦{sale.total}</td>
                            <td className="py-2 px-3 text-right font-bold">{sale.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <div className="icon-shopping-cart text-2xl text-blue-600"></div>
                      </div>
                      <p className="text-[var(--text-secondary)]">No sales recorded today</p>
                      <p className="text-sm text-[var(--text-secondary)]">Start recording your daily sales above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        case 'expenses':
          return (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Expenses Management</h1>
                  <p className="text-[var(--text-secondary)] mt-1">Track and manage all business expenses</p>
                </div>
                <button 
                  onClick={() => setShowExpenseModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <div className="icon-plus text-sm"></div>
                  Add Expense
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <div className="icon-credit-card text-xl text-red-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Today's Expenses</h3>
                      <p className="text-2xl font-bold text-red-600">
                        ₦{calculateTodaysExpenses(expenses)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                      <div className="icon-receipt text-xl text-orange-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Expenses</h3>
                      <p className="text-2xl font-bold text-orange-600">
                        ₦{calculateTotalExpenses(expenses)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <div className="icon-calculator text-xl text-blue-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Net Profit Today</h3>
                      <p className="text-2xl font-bold text-blue-600">
                        ₦{(parseFloat(calculateTodaysSales(sales)) - parseFloat(calculateTodaysExpenses(expenses))).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Expense History</h3>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expenses.slice().reverse().map(expense => (
                    <div key={expense.id} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium bg-red-500 text-white px-2 py-1 rounded">
                              {expense.category}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)]">
                              {expense.time}
                            </span>
                          </div>
                          <h4 className="font-semibold text-[var(--text-primary)]">{expense.description}</h4>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {expense.date} • Payment: {expense.paymentMethod}
                          </p>
                          {expense.notes && (
                            <p className="text-xs text-gray-600 mt-1">{expense.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">-₦{expense.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <div className="icon-credit-card text-2xl text-red-600"></div>
                      </div>
                      <p className="text-[var(--text-secondary)]">No expenses recorded yet</p>
                      <p className="text-sm text-[var(--text-secondary)]">Start tracking your business expenses</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        case 'categories':
          return (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Categories & Brands</h1>
                  <p className="text-[var(--text-secondary)] mt-1">Manage your product categories and brands</p>
                </div>
                <button 
                  onClick={() => setShowCategoryBrandModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <div className="icon-plus text-sm"></div>
                  Add Category/Brand
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Categories ({categories.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{category}</span>
                        <button 
                          onClick={() => removeCategory(category)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <div className="icon-trash-2 text-sm"></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Brands ({brands.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {brands.map(brand => (
                      <div key={brand} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">{brand}</span>
                        <button 
                          onClick={() => removeBrand(brand)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <div className="icon-trash-2 text-sm"></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        case 'reports':
          return (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Business Reports</h1>
                <p className="text-[var(--text-secondary)] mt-1">Analytics and insights for your store performance</p>
              </div>
              <div className="stats-grid mb-8">
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <div className="icon-dollar-sign text-xl text-green-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Today's Sales</h3>
                      <p className="text-2xl font-bold text-[var(--accent-color)]">
                        ₦{calculateTodaysSales(sales)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <div className="icon-package text-xl text-blue-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Products</h3>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <div className="icon-alert-triangle text-xl text-red-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Low Stock Items</h3>
                      <p className="text-2xl font-bold text-[var(--warning-color)]">
                        {products.filter(p => p.quantity <= p.lowStockThreshold).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <div className="icon-trending-up text-xl text-purple-600"></div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Total Revenue</h3>
                      <p className="text-2xl font-bold text-[var(--accent-color)]">
                        ₦{calculateTotalRevenue(sales)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return <Dashboard products={products} sales={sales} />;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50" data-name="app" data-file="app.js">
        <Header />
        
        <div className="flex">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          
          <main className="flex-1 ml-[var(--sidebar-width)] pt-[var(--header-height)]">
            <div className="p-6">
              {renderCurrentView()}
            </div>
          </main>
        </div>
        
        {showSalesModal && (
          <SalesModal
            product={selectedProduct}
            onClose={() => {
              setShowSalesModal(false);
              setSelectedProduct(null);
            }}
            onSale={addSale}
          />
        )}
        
        {showAddProductModal && (
          <AddProductModal
            onClose={() => setShowAddProductModal(false)}
            onAdd={addProduct}
            categories={categories}
            brands={brands}
          />
        )}
        
        {showCategoryBrandModal && (
          <CategoryBrandModal
            onClose={() => setShowCategoryBrandModal(false)}
            onAddCategory={addCategory}
            onAddBrand={addBrand}
            categories={categories}
            brands={brands}
          />
        )}
        
        {showDailySalesModal && (
          <DailySalesModal
            onClose={() => setShowDailySalesModal(false)}
            onProcessSales={processBulkSales}
            products={products}
            categories={categories}
            brands={brands}
            onAddProduct={addProduct}
          />
        )}
        
        {showExpenseModal && (
          <ExpenseModal
            onClose={() => setShowExpenseModal(false)}
            onAdd={addExpense}
          />
        )}
        
        {showReceiptModal && selectedSale && (
          <ReceiptModal
            sale={selectedSale}
            onClose={() => {
              setShowReceiptModal(false);
              setSelectedSale(null);
            }}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);