function SalesModal({ product, onClose, onSale }) {
  try {
    const [quantity, setQuantity] = React.useState(1);
    const [discount, setDiscount] = React.useState(0);
    const [paymentMethod, setPaymentMethod] = React.useState('cash');
    const [customerNotes, setCustomerNotes] = React.useState('');

    const subtotal = product.price * quantity;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const handleSale = () => {
      if (quantity > product.quantity) {
        alert('Not enough stock available');
        return;
      }

      const sale = {
        productId: product.id,
        productName: product.name,
        brand: product.brand,
        quantity: parseInt(quantity),
        price: product.price,
        subtotal,
        discount: discountAmount,
        total,
        paymentMethod,
        customerNotes
      };

      onSale(sale);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-name="sales-modal" data-file="components/SalesModal.js">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Record Sale</h2>
              <button onClick={onClose} className="text-gray-500">
                <div className="icon-x text-xl"></div>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Product Info */}
            <div className="card bg-gray-50">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-[var(--text-secondary)]">Brand: {product.brand}</p>
              <p className="text-sm text-[var(--text-secondary)]">Available: {product.quantity} units</p>
              <p className="font-bold text-[var(--accent-color)]">₦{product.price} each</p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center"
                >
                  <div className="icon-minus text-sm"></div>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input-field text-center flex-1"
                  min="1"
                  max={product.quantity}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center"
                >
                  <div className="icon-plus text-sm"></div>
                </button>
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium mb-2">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                className="input-field"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="input-field"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Bank Transfer</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>

            {/* Customer Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Customer Notes (Optional)</label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="input-field"
                rows="2"
                placeholder="Customer name, phone, etc."
              ></textarea>
            </div>

            {/* Sale Summary */}
            <div className="card bg-blue-50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({discount}%):</span>
                    <span>-₦{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-[var(--accent-color)]">₦{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[var(--border-color)] flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSale} className="btn-primary flex-1">
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SalesModal component error:', error);
    return null;
  }
}