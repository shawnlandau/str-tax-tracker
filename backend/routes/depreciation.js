const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get all depreciation records
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT d.*, p.address as property_address
        FROM depreciation d
        JOIN properties p ON d.property_id = p.id
        ORDER BY d.property_id, d.year DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching depreciation:', error);
      res.status(500).json({ error: 'Failed to fetch depreciation' });
    }
  });

  // Get depreciation by property
  router.get('/property/:propertyId', async (req, res) => {
    try {
      const { propertyId } = req.params;
      const result = await pool.query(`
        SELECT d.*, p.address as property_address
        FROM depreciation d
        JOIN properties p ON d.property_id = p.id
        WHERE d.property_id = $1
        ORDER BY d.year DESC
      `, [propertyId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching property depreciation:', error);
      res.status(500).json({ error: 'Failed to fetch property depreciation' });
    }
  });

  // Get single depreciation record
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT d.*, p.address as property_address
        FROM depreciation d
        JOIN properties p ON d.property_id = p.id
        WHERE d.id = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Depreciation record not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching depreciation record:', error);
      res.status(500).json({ error: 'Failed to fetch depreciation record' });
    }
  });

  // Create depreciation record
  router.post('/', async (req, res) => {
    try {
      const {
        property_id,
        year,
        straight_line = 0,
        bonus_depreciation = 0,
        section_179_deduction = 0,
        placed_in_service_date,
        business_use_percentage = 100
      } = req.body;

      if (!property_id || !year) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Verify property exists
      const propertyCheck = await pool.query('SELECT id FROM properties WHERE id = $1', [property_id]);
      if (propertyCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      // Check if depreciation record already exists for this property and year
      const existingCheck = await pool.query(
        'SELECT id FROM depreciation WHERE property_id = $1 AND year = $2',
        [property_id, year]
      );
      
      if (existingCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Depreciation record already exists for this property and year' });
      }

      const total_depreciation = parseFloat(straight_line) + parseFloat(bonus_depreciation) + parseFloat(section_179_deduction);

      const result = await pool.query(`
        INSERT INTO depreciation (property_id, year, straight_line, bonus_depreciation, section_179_deduction, 
                                total_depreciation, placed_in_service_date, business_use_percentage)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [property_id, year, straight_line, bonus_depreciation, section_179_deduction, 
           total_depreciation, placed_in_service_date, business_use_percentage]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating depreciation record:', error);
      res.status(500).json({ error: 'Failed to create depreciation record' });
    }
  });

  // Update depreciation record
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        property_id,
        year,
        straight_line,
        bonus_depreciation,
        section_179_deduction,
        placed_in_service_date,
        business_use_percentage
      } = req.body;

      const total_depreciation = parseFloat(straight_line) + parseFloat(bonus_depreciation) + parseFloat(section_179_deduction);

      const result = await pool.query(`
        UPDATE depreciation 
        SET property_id = $1, year = $2, straight_line = $3, bonus_depreciation = $4, 
            section_179_deduction = $5, total_depreciation = $6, placed_in_service_date = $7,
            business_use_percentage = $8, updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `, [property_id, year, straight_line, bonus_depreciation, section_179_deduction, 
           total_depreciation, placed_in_service_date, business_use_percentage, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Depreciation record not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating depreciation record:', error);
      res.status(500).json({ error: 'Failed to update depreciation record' });
    }
  });

  // Delete depreciation record
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM depreciation WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Depreciation record not found' });
      }

      res.json({ message: 'Depreciation record deleted successfully' });
    } catch (error) {
      console.error('Error deleting depreciation record:', error);
      res.status(500).json({ error: 'Failed to delete depreciation record' });
    }
  });

  // Get depreciation summary by property
  router.get('/summary/property/:propertyId', async (req, res) => {
    try {
      const { propertyId } = req.params;
      const result = await pool.query(`
        SELECT 
          year,
          SUM(straight_line) as total_straight_line,
          SUM(bonus_depreciation) as total_bonus_depreciation,
          SUM(total_depreciation) as total_depreciation
        FROM depreciation
        WHERE property_id = $1
        GROUP BY year
        ORDER BY year DESC
      `, [propertyId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching depreciation summary:', error);
      res.status(500).json({ error: 'Failed to fetch depreciation summary' });
    }
  });

  return router;
}; 