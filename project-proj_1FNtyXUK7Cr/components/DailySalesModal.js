function DailySalesModal({ onClose, onProcessSales, products, categories, brands, onAddProduct }) {
  try {
    const [salesItems, setSalesItems] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [batchNotes, setBatchNotes] = React.useState('');
    const [paymentMethod, setPaymentMethod] = React.useState('cash');
    const [showQuickAdd, setShowQuickAdd] = React.useState(false);
    const [quickProduct, setQuickProduct] = React.useState({
      name: '',
      brand: '',
      category: '',
      price: '',
      cost: '',
      quantity: '1'
    });

    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addSalesItem = (product) => {
      const existingIndex = salesItems.findIndex(item => item.productId === product.id);
      if (existingIndex >= 0) {
        const updatedItems = [...salesItems];
        updatedItems[existingIndex].quantity += 1;
        setSalesItems(updatedItems);
      } else {
        setSalesItems([...salesItems, {
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          price: product.price,
          quantity: 1,
          availableStock: product.quantity
        }]);
      }
    };

    const updateQuantity = (productId, newQuantity) => {
      if (newQuantity <= 0) {
        setSalesItems(salesItems.filter(item => item.productId !== productId));
      } else {
        setSalesItems(salesItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity: Math.min(newQuantity, item.availableStock) }
            : item
        ));
      }
    };

    const getTotalAmount = () => {
      return salesItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleQuickAdd = () => {
      if (!quickProduct.name || !quickProduct.brand || !quickProduct.category || !quickProduct.price) {
        alert('Please fill in all required fields');
        return;
      }

      const newProduct = {
        ...quickProduct,
        price: parseFloat(quickProduct.price),
        cost: parseFloat(quickProduct.cost) || 0,
        quantity: parseInt(quickProduct.quantity) || 1,
        lowStockThreshold: 10
      };

      onAddProduct(newProduct);
      
      // Reset form and close quick add
      setQuickProduct({
        name: '',
        brand: '',
        category: '',
        price: '',
        cost: '',
        quantity: '1'
      });
      setShowQuickAdd(false);
      alert('Product added successfully! You can now add it to your sales.');
    };

    const handleProcessSales = () => {
      if (salesItems.length === 0) {
        alert('Please add at least one item to process sales');
        return;
      }

      const processedCount = onProcessSales(salesItems, batchNotes, paymentMethod);
      alert(`Successfully processed ${processedCount} sales transactions!\nBatch ID: BATCH_${Date.now()}`);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-name="daily-sales-modal" data-file="components/DailySalesModal.js">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Record Daily Sales</h2>
              <button onClick={onClose} className="text-gray-500">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Select Products</h3>
                  <button
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="btn-secondary text-sm flex items-center gap-1"
                  >
                    <div className="icon-plus text-sm"></div>
                    Quick Add
                  </button>
                </div>

                {showQuickAdd && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border">
                    <h4 className="font-medium mb-3">Quick Add New Product</h4>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input
                        type="text"
                        value={quickProduct.name}
                        onChange={(e) => setQuickProduct({...quickProduct, name: e.target.value})}
                        className="input-field text-sm"
                        placeholder="Product name"
                      />
                      <select
                        value={quickProduct.category}
                        onChange={(e) => setQuickProduct({...quickProduct, category: e.target.value})}
                        className="input-field text-sm"
                      >
                        <option value="">Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <select
                        value={quickProduct.brand}
                        onChange={(e) => setQuickProduct({...quickProduct, brand: e.target.value})}
                        className="input-field text-sm"
                      >
                        <option value="">Brand</option>
                        {brands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={quickProduct.price}
                        onChange={(e) => setQuickProduct({...quickProduct, price: e.target.value})}
                        className="input-field text-sm"
                        placeholder="Price"
                        step="0.01"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleQuickAdd} className="btn-primary text-sm flex-1">
                        Add Product
                      </button>
                      <button 
                        onClick={() => setShowQuickAdd(false)} 
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                    placeholder="Search products..."
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {product.brand} • ₦{product.price} • Stock: {product.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => addSalesItem(product)}
                        disabled={product.quantity === 0}
                        className="btn-primary text-sm disabled:opacity-50"
                      >
                        <div className="icon-plus text-sm"></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Cart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sales Cart ({salesItems.length})</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                  {salesItems.map(item => (
                    <div key={item.productId} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-[var(--text-secondary)]">{item.brand}</p>
                        </div>
                        <button
                          onClick={() => updateQuantity(item.productId, 0)}
                          className="text-red-600"
                        >
                          <div className="icon-trash-2 text-sm"></div>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center"
                          >
                            <div className="icon-minus text-sm"></div>
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.availableStock}
                            className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center disabled:opacity-50"
                          >
                            <div className="icon-plus text-sm"></div>
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₦{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-[var(--text-secondary)]">₦{item.price} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {salesItems.length === 0 && (
                    <p className="text-center text-[var(--text-secondary)] py-8">
                      No items added yet. Select products from the left to add them.
                    </p>
                  )}
                </div>

                {salesItems.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="input-field"
                      >
                        <option value="cash">Cash</option>
                        <option value="transfer">Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Batch Notes (Optional)</label>
                      <textarea
                        value={batchNotes}
                        onChange={(e) => setBatchNotes(e.target.value)}
                        className="input-field"
                        rows="2"
                        placeholder="Add notes for this sales batch..."
                      ></textarea>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-[var(--accent-color)]">
                        ₦{getTotalAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[var(--border-color)] flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button 
              onClick={handleProcessSales}
              disabled={salesItems.length === 0}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Process Sales ({salesItems.length} items)
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DailySalesModal component error:', error);
    return null;
  }
}