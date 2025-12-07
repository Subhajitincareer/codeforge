import { Preset } from './types';
import { ShoppingCart, Users, CreditCard, Server } from 'lucide-react';

export const PRESETS: Preset[] = [
  {
    id: 'users-social',
    name: 'Social Media Users',
    description: '10 users with profiles, recent posts, and friend lists.',
    category: 'social',
    prompt: 'Generate a JSON array of 10 fictional social media users. Each user should have a UUID, username, real name, avatar URL (use picsum), bio, a list of 3 recent posts (with content, timestamp, likes count), and a list of 5 friend user IDs. Make the data diverse and realistic.'
  },
  {
    id: 'ecommerce-orders',
    name: 'E-commerce Orders',
    description: 'Complex order history with line items and status.',
    category: 'e-commerce',
    prompt: 'Generate a JSON structure representing an order history for a customer. Include customer details, shipping address, and an array of 5 past orders. Each order should have an order ID, date, status (shipped, processing, delivered, returned), total amount, and a list of line items (product name, sku, quantity, price per unit). Include calculated totals.'
  },
  {
    id: 'fintech-transactions',
    name: 'Financial Transactions',
    description: 'Bank ledger with varied transaction types.',
    category: 'fintech',
    prompt: 'Generate a JSON list of 20 financial transactions. Include transaction ID, date (last 30 days), amount (positive for deposits, negative for expenses), currency (USD, EUR, GBP mix), merchant name, category (groceries, tech, salary, utilities), and status (pending, cleared, failed).'
  },
  {
    id: 'server-logs',
    name: 'Server Logs',
    description: 'Structured logs with severity levels and metadata.',
    category: 'system',
    prompt: 'Generate a JSON array of 15 server log entries. Fields: timestamp (ISO 8601), level (INFO, WARN, ERROR, DEBUG), service_name, message, request_id, ip_address, and user_agent. Ensure there are at least 3 ERROR logs with stack traces in a separate field.'
  }
];

export const CATEGORY_ICONS = {
  'e-commerce': ShoppingCart,
  'social': Users,
  'fintech': CreditCard,
  'system': Server
};