/**
 * Server-side API endpoint for generating tour pages
 * Add this to your app.js file
 */

// Add this route to your app.js file after the existing routes

app.post('/api/generate-tour-page', async (req, res) => {
  try {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ error: 'Filename and content are required' });
    }
    
    const fs = require('fs');
    const path = require('path');
    
    // Ensure prodpage directory exists
    const prodpageDir = path.join(__dirname, 'prodpage');
    if (!fs.existsSync(prodpageDir)) {
      fs.mkdirSync(prodpageDir, { recursive: true });
    }
    
    // Write the PHP file
    const filePath = path.join(prodpageDir, filename);
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Tour page generated: ${filePath}`);
    
    res.json({ 
      success: true, 
      filename, 
      path: `/prodpage/${filename}`,
      message: 'Tour page generated successfully' 
    });
    
  } catch (error) {
    console.error('Error generating tour page:', error);
    res.status(500).json({ error: 'Failed to generate tour page' });
  }
});

// Add this route to handle tour deletion (removes corresponding PHP file)
app.delete('/api/tours/:id', async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.is_admin !== true)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const tourId = req.params.id;

    // First, get the tour to find its title for filename
    const tourCheck = await pool.query('SELECT * FROM tours WHERE id = $1', [tourId]);
    if (tourCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const tour = tourCheck.rows[0];
    
    // Delete the corresponding PHP file
    const fs = require('fs');
    const path = require('path');
    
    const slug = tour.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
      .substring(0, 50);
    
    const filename = `${slug}-${tourId}.php`;
    const filePath = path.join(__dirname, 'prodpage', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted tour page: ${filePath}`);
    }

    // Delete all bookings associated with this tour first
    await pool.query('DELETE FROM bookings WHERE tour_id = $1', [tourId]);
    console.log(`Deleted bookings for tour ID: ${tourId}`);

    // Now delete the tour
    await pool.query('DELETE FROM tours WHERE id = $1 RETURNING *', [tourId]);

    res.json({ message: 'Tour and associated files deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ error: error.message });
  }
});