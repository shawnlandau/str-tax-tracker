const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Get portfolio overview
  router.get('/overview', async (req, res) => {
    try {
      // Total portfolio value
      const portfolioValue = await pool.query(`
        SELECT 
          COUNT(*) as total_properties,
          SUM(purchase_price) as total_purchase_value,
          SUM(purchase_price) as total_portfolio_value
        FROM properties
      `);

      // Monthly income vs expenses (current year)
      const currentYear = new Date().getFullYear();
      const monthlyData = await pool.query(`
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
        FROM transactions
        WHERE EXTRACT(YEAR FROM date) = $1
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `, [currentYear]);

      // Cash flow by property
      const cashFlowByProperty = await pool.query(`
        SELECT 
          p.id,
          p.address,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) as net_cash_flow
        FROM properties p
        LEFT JOIN transactions t ON p.id = t.property_id
        GROUP BY p.id, p.address
        ORDER BY net_cash_flow DESC
      `);

      // Depreciation summary
      const depreciationSummary = await pool.query(`
        SELECT 
          SUM(straight_line) as total_straight_line,
          SUM(bonus_depreciation) as total_bonus_depreciation,
          SUM(total_depreciation) as total_depreciation
        FROM depreciation
        WHERE year = $1
      `, [currentYear]);

      res.json({
        portfolio: portfolioValue.rows[0],
        monthlyData: monthlyData.rows,
        cashFlowByProperty: cashFlowByProperty.rows,
        depreciation: depreciationSummary.rows[0],
        currentYear
      });
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard overview' });
    }
  });

  // Get property performance chart data
  router.get('/property-performance', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          p.id,
          p.address,
          p.property_type,
          p.purchase_price,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) as net_cash_flow
        FROM properties p
        LEFT JOIN transactions t ON p.id = t.property_id
        GROUP BY p.id, p.address, p.property_type, p.purchase_price
        ORDER BY net_cash_flow DESC
      `);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching property performance:', error);
      res.status(500).json({ error: 'Failed to fetch property performance' });
    }
  });

  // Get monthly cash flow data
  router.get('/monthly-cashflow', async (req, res) => {
    try {
      const { year } = req.query;
      const currentYear = year || new Date().getFullYear();
      
      const result = await pool.query(`
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses,
          SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_cash_flow
        FROM transactions
        WHERE EXTRACT(YEAR FROM date) = $1
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `, [currentYear]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching monthly cash flow:', error);
      res.status(500).json({ error: 'Failed to fetch monthly cash flow' });
    }
  });

  // Get depreciation chart data
  router.get('/depreciation-chart', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          year,
          SUM(straight_line) as straight_line_total,
          SUM(bonus_depreciation) as bonus_depreciation_total,
          SUM(total_depreciation) as total_depreciation
        FROM depreciation
        GROUP BY year
        ORDER BY year DESC
        LIMIT 10
      `);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching depreciation chart data:', error);
      res.status(500).json({ error: 'Failed to fetch depreciation chart data' });
    }
  });

  // Get transaction categories summary
  router.get('/transaction-categories', async (req, res) => {
    try {
      const { year } = req.query;
      const currentYear = year || new Date().getFullYear();
      
      const result = await pool.query(`
        SELECT 
          category,
          type,
          SUM(amount) as total_amount,
          COUNT(*) as transaction_count
        FROM transactions
        WHERE EXTRACT(YEAR FROM date) = $1
        GROUP BY category, type
        ORDER BY type, total_amount DESC
      `, [currentYear]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching transaction categories:', error);
      res.status(500).json({ error: 'Failed to fetch transaction categories' });
    }
  });

  // Get property type distribution
  router.get('/property-distribution', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          property_type,
          COUNT(*) as property_count,
          SUM(purchase_price) as total_value,
          AVG(purchase_price) as avg_value
        FROM properties
        GROUP BY property_type
        ORDER BY total_value DESC
      `);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching property distribution:', error);
      res.status(500).json({ error: 'Failed to fetch property distribution' });
    }
  });

  return router;
}; 