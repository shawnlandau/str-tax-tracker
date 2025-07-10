const express = require('express');

function taxFormsRoutes(pool) {
  const router = express.Router();

  // Get tax summary for a specific year
  router.get('/summary/:year', async (req, res) => {
    try {
      const { year } = req.params;
      
      const result = await pool.query(`
        SELECT 
          p.address,
          p.purchase_price,
          p.down_payment,
          p.monthly_mortgage,
          p.monthly_taxes,
          p.monthly_insurance,
          p.monthly_hoa_fees,
          d.year,
          d.straight_line,
          d.bonus_depreciation,
          d.section_179_deduction,
          d.total_depreciation,
          d.placed_in_service_date,
          d.business_use_percentage,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses
        FROM properties p
        LEFT JOIN depreciation d ON p.id = d.property_id AND d.year = $1
        LEFT JOIN transactions t ON p.id = t.property_id AND EXTRACT(YEAR FROM t.date) = $1
        GROUP BY p.id, p.address, p.purchase_price, p.down_payment, p.monthly_mortgage, 
                 p.monthly_taxes, p.monthly_insurance, p.monthly_hoa_fees, d.year, 
                 d.straight_line, d.bonus_depreciation, d.section_179_deduction, 
                 d.total_depreciation, d.placed_in_service_date, d.business_use_percentage
        ORDER BY p.address
      `, [year]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching tax summary:', error);
      res.status(500).json({ error: 'Failed to fetch tax summary' });
    }
  });

  // Get Section 179 deduction summary
  router.get('/section179/:year', async (req, res) => {
    try {
      const { year } = req.params;
      
      const result = await pool.query(`
        SELECT 
          p.address,
          p.purchase_price,
          d.section_179_deduction,
          d.placed_in_service_date,
          d.business_use_percentage,
          p.purchase_price * (d.business_use_percentage / 100) as qualified_business_use_amount
        FROM properties p
        LEFT JOIN depreciation d ON p.id = d.property_id AND d.year = $1
        WHERE d.section_179_deduction > 0
        ORDER BY p.address
      `, [year]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching Section 179 summary:', error);
      res.status(500).json({ error: 'Failed to fetch Section 179 summary' });
    }
  });

  // Get bonus depreciation summary
  router.get('/bonus-depreciation/:year', async (req, res) => {
    try {
      const { year } = req.params;
      
      const result = await pool.query(`
        SELECT 
          p.address,
          p.purchase_price,
          d.bonus_depreciation,
          d.placed_in_service_date,
          d.business_use_percentage
        FROM properties p
        LEFT JOIN depreciation d ON p.id = d.property_id AND d.year = $1
        WHERE d.bonus_depreciation > 0
        ORDER BY p.address
      `, [year]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching bonus depreciation summary:', error);
      res.status(500).json({ error: 'Failed to fetch bonus depreciation summary' });
    }
  });

  // Get rental income summary
  router.get('/rental-income/:year', async (req, res) => {
    try {
      const { year } = req.params;
      
      const result = await pool.query(`
        SELECT 
          p.address,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as rental_income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as rental_expenses,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) - 
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as net_rental_income
        FROM properties p
        LEFT JOIN transactions t ON p.id = t.property_id AND EXTRACT(YEAR FROM t.date) = $1
        GROUP BY p.id, p.address
        ORDER BY p.address
      `, [year]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching rental income summary:', error);
      res.status(500).json({ error: 'Failed to fetch rental income summary' });
    }
  });

  // Get property expenses breakdown
  router.get('/expenses/:year', async (req, res) => {
    try {
      const { year } = req.params;
      
      const result = await pool.query(`
        SELECT 
          p.address,
          p.monthly_mortgage * 12 as annual_mortgage,
          p.monthly_taxes * 12 as annual_taxes,
          p.monthly_insurance * 12 as annual_insurance,
          p.monthly_hoa_fees * 12 as annual_hoa_fees,
          COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.category = 'maintenance' THEN t.amount ELSE 0 END), 0) as maintenance_expenses,
          COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.category = 'utilities' THEN t.amount ELSE 0 END), 0) as utility_expenses,
          COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.category = 'repairs' THEN t.amount ELSE 0 END), 0) as repair_expenses,
          COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.category NOT IN ('maintenance', 'utilities', 'repairs') THEN t.amount ELSE 0 END), 0) as other_expenses
        FROM properties p
        LEFT JOIN transactions t ON p.id = t.property_id AND EXTRACT(YEAR FROM t.date) = $1
        GROUP BY p.id, p.address, p.monthly_mortgage, p.monthly_taxes, p.monthly_insurance, p.monthly_hoa_fees
        ORDER BY p.address
      `, [year]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching expenses breakdown:', error);
      res.status(500).json({ error: 'Failed to fetch expenses breakdown' });
    }
  });

  // Generate tax forms data for accountant
  router.get('/forms/:year', async (req, res) => {
    try {
      const { year } = req.params;
      
      // Get comprehensive tax data
      const taxData = await pool.query(`
        SELECT 
          p.address,
          p.purchase_price,
          p.down_payment,
          p.monthly_mortgage * 12 as annual_mortgage_interest,
          p.monthly_taxes * 12 as annual_property_taxes,
          p.monthly_insurance * 12 as annual_insurance,
          p.monthly_hoa_fees * 12 as annual_hoa_fees,
          d.section_179_deduction,
          d.bonus_depreciation,
          d.straight_line,
          d.total_depreciation,
          d.placed_in_service_date,
          d.business_use_percentage,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as rental_income,
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as other_expenses,
          COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) - 
          COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as net_rental_income
        FROM properties p
        LEFT JOIN depreciation d ON p.id = d.property_id AND d.year = $1
        LEFT JOIN transactions t ON p.id = t.property_id AND EXTRACT(YEAR FROM t.date) = $1
        GROUP BY p.id, p.address, p.purchase_price, p.down_payment, p.monthly_mortgage, 
                 p.monthly_taxes, p.monthly_insurance, p.monthly_hoa_fees, d.section_179_deduction,
                 d.bonus_depreciation, d.straight_line, d.total_depreciation, 
                 d.placed_in_service_date, d.business_use_percentage
        ORDER BY p.address
      `, [year]);
      
      // Calculate totals
      const totals = {
        total_purchase_price: 0,
        total_section_179: 0,
        total_bonus_depreciation: 0,
        total_rental_income: 0,
        total_expenses: 0,
        total_net_income: 0
      };
      
      taxData.rows.forEach(row => {
        totals.total_purchase_price += parseFloat(row.purchase_price || 0);
        totals.total_section_179 += parseFloat(row.section_179_deduction || 0);
        totals.total_bonus_depreciation += parseFloat(row.bonus_depreciation || 0);
        totals.total_rental_income += parseFloat(row.rental_income || 0);
        totals.total_expenses += parseFloat(row.other_expenses || 0);
        totals.total_net_income += parseFloat(row.net_rental_income || 0);
      });
      
      res.json({
        year: parseInt(year),
        properties: taxData.rows,
        totals: totals,
        forms_needed: [
          'Schedule E - Rental Income',
          'Form 4562 - Depreciation and Amortization',
          'Form 4797 - Sales of Business Property (if applicable)',
          'Schedule C - Business Income (if applicable)'
        ]
      });
    } catch (error) {
      console.error('Error generating tax forms data:', error);
      res.status(500).json({ error: 'Failed to generate tax forms data' });
    }
  });

  return router;
}

module.exports = taxFormsRoutes; 