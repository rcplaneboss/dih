function Dashboard({ products, sales, onSellProduct, onAddProduct }) {
  try {
    const lowStockProducts = products.filter(p => p.quantity <= p.lowStockThreshold);
    const todaysSales = calculateTodaysSales(sales);
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

    return (
      <div className="space-y-8" data-name="dashboard" data-file="components/Dashboard.js">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">Welcome back! Here's what's happening in your store today.</p>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <div className="icon-dollar-sign text-xl text-green-600"></div>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Today's Sales</p>
                <p className="text-2xl font-bold text-[var(--accent-color)]">₦{todaysSales}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <div className="icon-package text-xl text-blue-600"></div>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total Products</p>
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
                <p className="text-sm text-[var(--text-secondary)]">Low Stock</p>
                <p className="text-2xl font-bold text-[var(--warning-color)]">{lowStockProducts.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <div className="icon-trending-up text-xl text-purple-600"></div>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total Revenue</p>
                <p className="text-2xl font-bold text-[var(--accent-color)]">₦{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="card border-l-4 border-[var(--warning-color)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-alert-triangle text-xl text-[var(--warning-color)]"></div>
                <h3 className="text-lg font-semibold">Low Stock Alert</h3>
              </div>
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <p className="text-sm text-[var(--text-secondary)]">{product.brand}</p>
                    </div>
                    <span className="status-badge status-low">{product.quantity} left</span>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <p className="text-sm text-[var(--text-secondary)]">
                    +{lowStockProducts.length - 5} more items
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onAddProduct} className="p-4 border border-[var(--border-color)] rounded-lg hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary-color)] flex items-center justify-center mx-auto mb-2">
                    <div className="icon-plus text-lg text-white"></div>
                  </div>
                  <p className="font-medium">Add Product</p>
                </div>
              </button>
              
              <button className="p-4 border border-[var(--border-color)] rounded-lg hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
                    <div className="icon-scan text-lg text-purple-600"></div>
                  </div>
                  <p className="font-medium">Scan Barcode</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        {products.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
            <div className="desktop-grid">
              {products.slice(-6).reverse().map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onSell={() => onSellProduct(product)}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Dashboard component error:', error);
    return null;
  }
}
