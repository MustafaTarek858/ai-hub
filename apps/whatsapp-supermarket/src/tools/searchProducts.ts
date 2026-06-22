import type { Tool } from '@ai-hub/bot-core';
import { products } from '../data/mockData';

export const searchProducts: Tool = {
  definition: {
    type: 'function',
    function: {
      name: 'searchProducts',
      description: 'Search for products by name or category. Use when customer asks about products, prices, or availability.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Product name or keyword to search for',
          },
          category: {
            type: 'string',
            description: 'Category filter: dairy, bakery, meat, veggies, drinks, grains',
          },
        },
      },
    },
  },

  handler: async (args) => {
    let results = products.filter((p) => p.stock > 0);

    if (args.query) {
      results = results.filter((p) =>
        p.name.toLowerCase().includes(args.query.toLowerCase())
      );
    }

    if (args.category) {
      results = results.filter((p) =>
        p.category.toLowerCase() === args.category.toLowerCase()
      );
    }

    if (results.length === 0) {
      return 'No products found matching your search.';
    }

    const formatted = results.map(
      (p) => `[${p.id}] ${p.name} — ${p.price} EGP (${p.stock} in stock)`
    ).join('\n');

    return `Found ${results.length} product(s):\n${formatted}`;
  },
};
