import 'dotenv/config';
import { createBotServer } from '@ai-hub/bot-core';
import { searchProducts } from './tools/searchProducts';
import { addToCart, viewCart, checkout } from './tools/manageCart';

createBotServer(
  {
    systemPrompt: `You are a friendly shopping assistant for a supermarket.
Your job is to help customers:
1. Search and browse products
2. Add items to their cart
3. View their cart
4. Place orders (checkout)

Always be helpful and suggest related products when relevant.
When adding to cart, use the customer's phone number from the conversation.
When showing prices, always mention the currency (EGP).
Respond in the same language the customer uses.`,

    tools: [
      searchProducts,
      addToCart,
      viewCart,
      checkout,
    ],

    apiKey: process.env.GROQ_API_KEY ?? '',
  },
  3002
);
