function ProductCard({ product, onSell, onUpdate, compact = false }) {
  try {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editQuantity, setEditQuantity] = React.useState(product.quantity);

    const getStockStatus = () => {
      if (product.quantity <= product.lowStockThreshold) return 'status-low';
      if (product.quantity <= product.lowStockThreshold * 2) return 'status-medium';
      return 'status-high';
    };

    const handleQuantityUpdate = () => {
      onUpdate({ quantity: parseInt(editQuantity) });
      setIsEditing(false);
    };

    if (compact) {
      return (
        <div className="card" data-name="product-card-compact" data-file="components/ProductCard.js">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-sm text-[var(--text-secondary)]">{product.brand}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">₦{product.price}</p>
              <span className={`status-badge ${getStockStatus()}`}>
                {product.quantity} in stock
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card" data-name="product-card" data-file="components/ProductCard.js">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-[var(--text-secondary)] mb-1">Brand: {product.brand}</p>
            <p className="text-[var(--text-secondary)] text-sm">Category: {product.category}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[var(--accent-color)]">₦{product.price}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Stock:</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="w-16 px-2 py-1 border rounded text-sm"
                  min="0"
                />
                <button onClick={handleQuantityUpdate} className="text-green-600">
                  <div className="icon-check text-sm"></div>
                </button>
                <button onClick={() => setIsEditing(false)} className="text-red-600">
                  <div className="icon-x text-sm"></div>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`status-badge ${getStockStatus()}`}>
                  {product.quantity} units
                </span>
                <button onClick={() => setIsEditing(true)} className="text-blue-600">
                  <div className="icon-edit-2 text-sm"></div>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onSell}
            disabled={product.quantity === 0}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="icon-shopping-cart text-sm mr-2"></div>
            Sell
          </button>
          <button className="btn-secondary">
            <div className="icon-more-vertical text-sm"></div>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ProductCard component error:', error);
    return null;
  }
}