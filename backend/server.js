const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { Pool } = require('pg');
const propertiesRoutes = require('./routes/properties');
const transactionsRoutes = require('./routes/transactions');
const depreciationRoutes = require('./routes/depreciation');
const dashboardRoutes = require('./routes/dashboard');
const bookingsRoutes = require('./routes/bookings');
const taxFormsRoutes = require('./routes/taxForms');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-app.onrender.com'] 
    : ['http://localhost:5173', 'http://localhost:3000']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/properties', propertiesRoutes(pool));
app.use('/api/transactions', transactionsRoutes(pool));
app.use('/api/depreciation', depreciationRoutes(pool));
app.use('/api/dashboard', dashboardRoutes(pool));
app.use('/api/bookings', bookingsRoutes(pool));
app.use('/api/tax-forms', taxFormsRoutes(pool));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Initialize database tables
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        address VARCHAR(255) NOT NULL,
        property_type VARCHAR(100) NOT NULL,
        purchase_price DECIMAL(12,2) NOT NULL,
        down_payment DECIMAL(12,2) NOT NULL,
        monthly_mortgage DECIMAL(10,2) NOT NULL,
        monthly_taxes DECIMAL(10,2) DEFAULT 0,
        monthly_insurance DECIMAL(10,2) DEFAULT 0,
        monthly_hoa_fees DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        guest_name VARCHAR(255) NOT NULL,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create depreciation table
    await client.query(`
      CREATE TABLE IF NOT EXISTS depreciation (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        year INTEGER NOT NULL,
        straight_line DECIMAL(10,2) DEFAULT 0,
        bonus_depreciation DECIMAL(10,2) DEFAULT 0,
        section_179_deduction DECIMAL(10,2) DEFAULT 0,
        total_depreciation DECIMAL(10,2) DEFAULT 0,
        placed_in_service_date DATE,
        business_use_percentage DECIMAL(5,2) DEFAULT 100.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    client.release();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});

module.exports = app; 