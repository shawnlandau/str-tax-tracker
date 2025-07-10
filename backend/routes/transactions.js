const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get all transactions
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT t.*, p.address as property_address
        FROM transactions t
        JOIN properties p ON t.property_id = p.id
        ORDER BY t.date DESC, t.created_at DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  // Get transactions by property
  router.get('/property/:propertyId', async (req, res) => {
    try {
      const { propertyId } = req.params;
      const result = await pool.query(`
        SELECT t.*, p.address as property_address
        FROM transactions t
        JOIN properties p ON t.property_id = p.id
        WHERE t.property_id = $1
        ORDER BY t.date DESC, t.created_at DESC
      `, [propertyId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching property transactions:', error);
      res.status(500).json({ error: 'Failed to fetch property transactions' });
    }
  });

  // Get single transaction
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT t.*, p.address as property_address
        FROM transactions t
        JOIN properties p ON t.property_id = p.id
        WHERE t.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  });

  // Create transaction
  router.post('/', async (req, res) => {
    try {
      const {
        property_id,
        type,
        category,
        amount,
        description,
        date
      } = req.body;

      if (!property_id || !type || !category || !amount || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Type must be either "income" or "expense"' });
      }

      // Verify property exists
      const propertyCheck = await pool.query('SELECT id FROM properties WHERE id = $1', [property_id]);
      if (propertyCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const result = await pool.query(`
        INSERT INTO transactions (property_id, type, category, amount, description, date)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [property_id, type, category, amount, description, date]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  });

  // Update transaction
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        property_id,
        type,
        category,
        amount,
        description,
        date
      } = req.body;

      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Type must be either "income" or "expense"' });
      }

      const result = await pool.query(`
        UPDATE transactions 
        SET property_id = $1, type = $2, category = $3, amount = $4, description = $5, date = $6
        WHERE id = $7
        RETURNING *
      `, [property_id, type, category, amount, description, date, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  });

  // Delete transaction
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  });

  // Get transaction summary by property
  router.get('/summary/property/:propertyId', async (req, res) => {
    try {
      const { propertyId } = req.params;
      const { year } = req.query;
      
      let query = `
        SELECT 
          category,
          type,
          SUM(amount) as total_amount,
          COUNT(*) as transaction_count
        FROM transactions
        WHERE property_id = $1
      `;
      
      const params = [propertyId];
      
      if (year) {
        query += ` AND EXTRACT(YEAR FROM date) = $2`;
        params.push(year);
      }
      
      query += ` GROUP BY category, type ORDER BY category, type`;
      
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      res.status(500).json({ error: 'Failed to fetch transaction summary' });
    }
  });

  return router;
}; 