import type { Tool } from '@ai-hub/bot-core';
import { products, carts } from '../data/mockData';

export const addToCart: Tool = {
  definition: {
    type: 'function',
    function: {
      name: 'addToCart',
      description: 'Add a product to the customer cart. Use when customer says they want to buy or add something.',
      parameters: {
        type: 'object',
        properties: {
          phone: { type: 'string', description: 'Customer phone number' },
          product_id: { type: 'string', description: 'Product ID e.g. p1, p2' },
          quantity: { type: 'string', description: 'How many to add (default 1)' },
        },
        required: ['phone', 'product_id'],
      },
    },
  },

  handler: async (args) => {
    const product = products.find((p) => p.id === args.product_id);
    if (!product) return `Product ${args.product_id} not found.`;

    const qty = parseInt(args.quantity ?? '1');
    if (product.stock < qty) return `Sorry, only ${product.stock} units of ${product.name} available.`;

    const cart = carts.get(args.phone) ?? [];
    const existing = cart.find((i) => i.productId === args.product_id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ productId: args.product_id, quantity: qty });
    }

    carts.set(args.phone, cart);
    return `Added ${qty}x ${product.name} to your cart. Total items: ${cart.length}. Say "view cart" to see your cart or "checkout" to order.`;
  },
};

export const viewCart: Tool = {
  definition: {
    type: 'function',
    function: {
      name: 'viewCart',
      description: 'Show the customer their current cart. Use when customer asks to see cart or what they have.',
      parameters: {
        type: 'object',
        properties: {
          phone: { type: 'string', description: 'Customer phone number' },
        },
        required: ['phone'],
      },
    },
  },

  handler: async (args) => {
    const cart = carts.get(args.phone) ?? [];
    if (cart.length === 0) return 'Your cart is empty.';

    let total = 0;
    const lines = cart.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const subtotal = product.price * item.quantity;
      total += subtotal;
      return `• ${product.name} x${item.quantity} = ${subtotal} EGP`;
    });

    return `Your cart:\n${lines.join('\n')}\n\nTotal: ${total} EGP\n\nSay "checkout" to place your order.`;
  },
};

export const checkout: Tool = {
  definition: {
    type: 'function',
    function: {
      name: 'checkout',
      description: 'Place the order and clear the cart. Use when customer says checkout or wants to confirm order.',
      parameters: {
        type: 'object',
        properties: {
          phone: { type: 'string', description: 'Customer phone number' },
          address: { type: 'string', description: 'Delivery address' },
        },
        required: ['phone'],
      },
    },
  },

  handler: async (args) => {
    const cart = carts.get(args.phone) ?? [];
    if (cart.length === 0) return 'Your cart is empty. Add some products first.';

    let total = 0;
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      product.stock -= item.quantity;
      total += product.price * item.quantity;
    });

    const orderId = `ORD-${Date.now()}`;
    carts.delete(args.phone);

    return `Order confirmed!
Order ID: ${orderId}
Total: ${total} EGP
${args.address ? `Delivery to: ${args.address}` : 'We will contact you for delivery details.'}

Thank you for shopping with us!`;
  },
};
