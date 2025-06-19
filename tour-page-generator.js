/**
 * Tour Page Generator - Creates PHP pages for each tour
 * Integrates with admin panel to generate individual tour pages
 */

class TourPageGenerator {
    constructor() {
        this.baseTemplate = null;
        this.menuBarTemplate = null;
        this.footerTemplate = null;
        this.init();
    }

    async init() {
        // Extract menu and footer from homepage
        await this.extractTemplates();
        this.setupAdminPanelIntegration();
    }

    async extractTemplates() {
        try {
            // Extract menu bar and footer from homepage-s-en.php
            const response = await fetch('/homepage-s-en.php');
            const homepageContent = await response.text();
            
            // Extract menu bar (between nav tags or header)
            const menuMatch = homepageContent.match(/<nav[\s\S]*?<\/nav>|<header[\s\S]*?<\/header>/i);
            this.menuBarTemplate = menuMatch ? menuMatch[0] : this.getDefaultMenuBar();
            
            // Extract footer
            const footerMatch = homepageContent.match(/<footer[\s\S]*?<\/footer>/i);
            this.footerTemplate = footerMatch ? footerMatch[0] : this.getDefaultFooter();
            
        } catch (error) {
            console.error('Error extracting templates:', error);
            this.menuBarTemplate = this.getDefaultMenuBar();
            this.footerTemplate = this.getDefaultFooter();
        }
    }

    getDefaultMenuBar() {
        return `
        <nav class="navbar">
            <div class="container">
                <div class="nav-brand">
                    <img src="/logo.jpg" alt="Depart Travel Services" class="logo">
                </div>
                <ul class="nav-menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/tours">Tours</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
        </nav>`;
    }

    getDefaultFooter() {
        return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Depart Travel Services</h3>
                        <p>Your trusted partner for unforgettable Tunisia experiences</p>
                    </div>
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/tours">Tours</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Contact Info</h4>
                        <p>Email: info@depart-travel-services.com</p>
                        <p>Phone: +216 XX XXX XXX</p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 Depart Travel Services. All rights reserved.</p>
                </div>
            </div>
        </footer>`;
    }

    setupAdminPanelIntegration() {
        // Intercept tour creation/update API calls
        this.interceptTourAPI();
        
        // Add new fields to admin panel
        this.enhanceAdminPanel();
    }

    interceptTourAPI() {
        // Override fetch to catch tour creation/updates
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options) => {
            const response = await originalFetch(url, options);
            
            // Check if this is a tour creation/update
            if (url.includes('/api/tours') && (options?.method === 'POST' || options?.method === 'PATCH')) {
                if (response.ok) {
                    const tourData = await response.clone().json();
                    await this.generateTourPage(tourData);
                }
            }
            
            return response;
        };
    }

    enhanceAdminPanel() {
        // Add new fields to the admin panel form
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    this.addNewFieldsToForm();
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial check
        setTimeout(() => this.addNewFieldsToForm(), 2000);
    }

    addNewFieldsToForm() {
        const adminForm = document.querySelector('form[data-tour-form], .admin-form, form:has(input[name*="title"])');
        if (!adminForm || adminForm.dataset.enhanced) return;
        
        adminForm.dataset.enhanced = 'true';
        
        // Find the last field to insert new fields after
        const lastField = adminForm.querySelector('input[name*="languages"], textarea[name*="description"]')?.closest('div');
        if (!lastField) return;
        
        // Create new fields container
        const newFieldsContainer = document.createElement('div');
        newFieldsContainer.className = 'new-tour-fields';
        newFieldsContainer.innerHTML = this.getNewFieldsHTML();
        
        // Insert after the last existing field
        lastField.parentNode.insertBefore(newFieldsContainer, lastField.nextSibling);
        
        console.log('Enhanced admin panel with new fields');
    }

    getNewFieldsHTML() {
        return `
            <div class="field-group">
                <h3>Itinerary Details</h3>
                <div class="form-field">
                    <label>Pickup Location</label>
                    <input type="text" name="pickup_location" placeholder="Hotel pickup from city center" />
                </div>
                <div class="form-field">
                    <label>Return Location</label>
                    <input type="text" name="return_location" placeholder="Return to original pickup point" />
                </div>
                <div class="form-field">
                    <label>Main Stops</label>
                    <div id="main-stops-container">
                        <input type="text" name="main_stops[]" placeholder="Stop 1 - Description" />
                        <button type="button" onclick="addMainStop()">+ Add Stop</button>
                    </div>
                </div>
                <div class="form-field">
                    <label>Itinerary Map (Google Maps Embed Link)</label>
                    <input type="url" name="itinerary_map" placeholder="https://www.google.com/maps/embed?pb=..." />
                </div>
            </div>
            
            <div class="field-group">
                <h3>Additional Information</h3>
                <div class="form-field">
                    <label>Not Suitable For</label>
                    <textarea name="not_suitable_for" rows="3" placeholder="Children under 5 years, Pregnant women, People with back problems"></textarea>
                </div>
                <div class="form-field">
                    <label>Full Description</label>
                    <textarea name="full_description" rows="6" placeholder="Detailed tour description for the product page"></textarea>
                </div>
                <div class="form-field">
                    <label>Payment Link</label>
                    <input type="url" name="payment_link" placeholder="https://your-payment-gateway.com/tour-payment" />
                </div>
                <div class="form-field">
                    <label>Reviews Import URL (GetYourGuide)</label>
                    <input type="url" name="reviews_import_url" placeholder="https://www.getyourguide.com/your-tour-reviews" />
                </div>
            </div>
            
            <div class="field-group">
                <h3>FAQ Section</h3>
                <div id="faq-container">
                    <div class="faq-item">
                        <input type="text" name="faq_questions[]" placeholder="Question" />
                        <textarea name="faq_answers[]" rows="2" placeholder="Answer"></textarea>
                        <button type="button" onclick="removeFAQ(this)">Remove</button>
                    </div>
                    <button type="button" onclick="addFAQ()">+ Add FAQ</button>
                </div>
            </div>
            
            <style>
                .new-tour-fields { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                .field-group { margin-bottom: 30px; }
                .field-group h3 { color: #0073e6; margin-bottom: 15px; }
                .form-field { margin-bottom: 15px; }
                .form-field label { display: block; margin-bottom: 5px; font-weight: bold; }
                .form-field input, .form-field textarea, .form-field select { 
                    width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; 
                }
                .faq-item { border: 1px solid #eee; padding: 15px; margin-bottom: 10px; border-radius: 4px; }
                #main-stops-container input { margin-bottom: 10px; }
            </style>
        `;
    }

    async generateTourPage(tourData) {
        console.log('Generating PHP page for tour:', tourData.title);
        
        try {
            // Create the PHP content
            const phpContent = this.createPHPContent(tourData);
            
            // Generate filename
            const slug = this.createSlug(tourData.title);
            const filename = `${slug}-${tourData.id}.php`;
            
            // Send to server to create the file
            await this.savePHPFile(filename, phpContent);
            
            console.log(`Tour page generated: /prodpage/${filename}`);
            
        } catch (error) {
            console.error('Error generating tour page:', error);
        }
    }

    createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-')
            .substring(0, 50);
    }

    createPHPContent(tour) {
        // Process arrays safely
        const images = Array.isArray(tour.images) ? tour.images : 
                      (typeof tour.images === 'string' ? [tour.images] : []);
        const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];
        const included = Array.isArray(tour.included) ? tour.included : [];
        const notIncluded = Array.isArray(tour.notIncluded) ? tour.notIncluded : [];
        const languages = Array.isArray(tour.languages) ? tour.languages : [];
        
        // Process new fields
        const mainStops = tour.main_stops || [];
        const notSuitableFor = tour.not_suitable_for || '';
        const fullDescription = tour.full_description || tour.description;
        const paymentLink = tour.payment_link || '#';
        const pickupLocation = tour.pickup_location || 'Hotel pickup available';
        const returnLocation = tour.return_location || 'Return to pickup point';
        const itineraryMap = tour.itinerary_map || '';
        
        return `<?php
/**
 * ${tour.title} - Tour Details Page
 * Generated automatically from admin panel
 */

// Tour data
$tour = ${JSON.stringify({
    id: tour.id,
    title: tour.title,
    description: tour.description,
    price: tour.price,
    image_urls: images,
    tour_type: tour.type,
    duration: tour.duration,
    location: tour.city,
    pickup_location: pickupLocation,
    return_location: returnLocation,
    main_stops: mainStops,
    itinerary_map: itineraryMap,
    highlights: highlights,
    whats_included: included,
    whats_not_included: notIncluded,
    tour_languages: languages,
    not_suitable_for: notSuitableFor.split(',').map(item => item.trim()).filter(item => item),
    full_description: fullDescription,
    payment_link: paymentLink,
    reviews_import_url: tour.reviews_import_url || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}, null, 2).replace(/"/g, '"')};

// Language detection function
function get_current_language() {
    $url = $_SERVER['REQUEST_URI'];
    if (strpos($url, '/en/') !== false || strpos($url, '/en') === 0) {
        return 'en';
    } elseif (strpos($url, '/it/') !== false || strpos($url, '/it') === 0) {
        return 'it';
    } elseif (strpos($url, '/de/') !== false || strpos($url, '/de') === 0) {
        return 'de';
    } else {
        return 'fr';
    }
}

function get_lang_prefix() {
    $lang = get_current_language();
    return $lang === 'fr' ? '' : '/' . $lang;
}
?>

<!DOCTYPE html>
<html lang="<?php echo get_current_language(); ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($tour['title']); ?> - Depart Travel Services</title>
    <meta name="description" content="<?php echo htmlspecialchars(substr($tour['description'], 0, 160)); ?>">
    
    <!-- Favicon -->
    <link rel="icon" href="/logo.jpg" type="image/jpeg">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Swiper CSS for carousel -->
    <link rel="stylesheet" href="https://unpkg.com/swiper@8/swiper-bundle.min.css">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        /* Navigation */
        .navbar { background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; }
        .navbar .container { display: flex; justify-content: space-between; align-items: center; padding: 1rem 20px; }
        .nav-brand .logo { height: 50px; }
        .nav-menu { display: flex; list-style: none; gap: 2rem; }
        .nav-menu a { text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s; }
        .nav-menu a:hover { color: #0073e6; }
        
        /* Image Carousel */
        .tour-carousel { height: 400px; margin-bottom: 2rem; }
        .swiper-slide img { width: 100%; height: 100%; object-fit: cover; }
        
        /* Tour Header */
        .tour-header { margin-bottom: 2rem; }
        .tour-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: #2c3e50; }
        .tour-meta { display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem; }
        .rating { display: flex; align-items: center; gap: 0.5rem; }
        .stars { color: #ffd700; }
        .tour-type { background: #0073e6; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; }
        
        /* Tour Info Grid */
        .tour-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
        .info-card { background: #f8f9fa; padding: 1.5rem; border-radius: 10px; text-align: center; }
        .info-icon { font-size: 2rem; color: #0073e6; margin-bottom: 0.5rem; }
        .info-label { font-weight: 600; color: #666; }
        .info-value { font-size: 1.2rem; font-weight: 700; color: #2c3e50; }
        
        /* Sections */
        .section { margin: 3rem 0; }
        .section-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #2c3e50; }
        
        /* Itinerary */
        .itinerary-map { width: 100%; height: 300px; border: none; border-radius: 10px; margin: 1rem 0; }
        .stops-list { list-style: none; }
        .stops-list li { padding: 0.8rem 0; border-bottom: 1px solid #eee; display: flex; align-items: center; }
        .stops-list li:before { content: "📍"; margin-right: 1rem; font-size: 1.2rem; }
        
        /* Lists */
        .highlight-list, .included-list, .not-included-list { list-style: none; }
        .highlight-list li:before { content: "✨"; margin-right: 0.5rem; }
        .included-list li:before { content: "✅"; margin-right: 0.5rem; }
        .not-included-list li:before { content: "❌"; margin-right: 0.5rem; }
        
        /* Two Column Layout */
        .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        /* Languages */
        .languages { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .language-tag { background: #e3f2fd; color: #1976d2; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; }
        
        /* FAQ */
        .faq-item { border: 1px solid #eee; border-radius: 8px; margin-bottom: 1rem; }
        .faq-question { background: #f8f9fa; padding: 1rem; cursor: pointer; font-weight: 600; }
        .faq-answer { padding: 1rem; display: none; }
        .faq-item.active .faq-answer { display: block; }
        
        /* Book Now Button */
        .book-now-section { text-align: center; margin: 3rem 0; }
        .book-now-btn { 
            background: linear-gradient(135deg, #0073e6, #0066cc); 
            color: white; 
            padding: 1rem 3rem; 
            border: none; 
            border-radius: 50px; 
            font-size: 1.2rem; 
            font-weight: 600; 
            text-decoration: none; 
            display: inline-block; 
            transition: transform 0.3s ease; 
        }
        .book-now-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,115,230,0.3); }
        
        /* Footer */
        .footer { background: #2c3e50; color: white; padding: 3rem 0 1rem; margin-top: 4rem; }
        .footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .footer-section h3, .footer-section h4 { margin-bottom: 1rem; }
        .footer-section ul { list-style: none; }
        .footer-section ul li { margin-bottom: 0.5rem; }
        .footer-section a { color: #bdc3c7; text-decoration: none; }
        .footer-section a:hover { color: white; }
        .footer-bottom { text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #34495e; }
        
        /* Responsive */
        @media (max-width: 768px) {
            .tour-title { font-size: 2rem; }
            .tour-meta { flex-direction: column; align-items: flex-start; gap: 1rem; }
            .two-columns { grid-template-columns: 1fr; }
            .nav-menu { display: none; }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    ${this.menuBarTemplate}
    
    <!-- Image Carousel -->
    <div class="tour-carousel">
        <div class="swiper">
            <div class="swiper-wrapper">
                <?php foreach ($tour['image_urls'] as $image): ?>
                <div class="swiper-slide">
                    <img src="<?php echo htmlspecialchars($image); ?>" alt="<?php echo htmlspecialchars($tour['title']); ?>">
                </div>
                <?php endforeach; ?>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    </div>
    
    <div class="container">
        <!-- Tour Header -->
        <div class="tour-header">
            <h1 class="tour-title"><?php echo htmlspecialchars($tour['title']); ?></h1>
            <div class="tour-meta">
                <div class="rating">
                    <div class="stars">★★★★★</div>
                    <span>4.8 (127 reviews)</span>
                </div>
                <span class="tour-type"><?php echo ucfirst($tour['tour_type']); ?> Tour</span>
            </div>
            <p class="tour-description"><?php echo htmlspecialchars($tour['description']); ?></p>
        </div>
        
        <!-- Tour Info Grid -->
        <div class="tour-info-grid">
            <div class="info-card">
                <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div class="info-label">Location</div>
                <div class="info-value"><?php echo htmlspecialchars($tour['location']); ?></div>
            </div>
            <div class="info-card">
                <div class="info-icon"><i class="fas fa-clock"></i></div>
                <div class="info-label">Duration</div>
                <div class="info-value"><?php echo $tour['duration']; ?> Day<?php echo $tour['duration'] > 1 ? 's' : ''; ?></div>
            </div>
            <div class="info-card">
                <div class="info-icon"><i class="fas fa-euro-sign"></i></div>
                <div class="info-label">Price</div>
                <div class="info-value">€<?php echo $tour['price']; ?></div>
            </div>
        </div>
        
        <!-- Itinerary -->
        <div class="section">
            <h2 class="section-title">Itinerary</h2>
            <div class="two-columns">
                <div>
                    <h3>Pickup & Return</h3>
                    <ul class="stops-list">
                        <li><strong>Pickup:</strong> <?php echo htmlspecialchars($tour['pickup_location']); ?></li>
                        <li><strong>Return:</strong> <?php echo htmlspecialchars($tour['return_location']); ?></li>
                    </ul>
                    
                    <?php if (!empty($tour['main_stops'])): ?>
                    <h3>Main Stops</h3>
                    <ul class="stops-list">
                        <?php foreach ($tour['main_stops'] as $stop): ?>
                        <li><?php echo htmlspecialchars($stop); ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <?php endif; ?>
                </div>
                <div>
                    <?php if (!empty($tour['itinerary_map'])): ?>
                    <iframe class="itinerary-map" src="<?php echo htmlspecialchars($tour['itinerary_map']); ?>" allowfullscreen></iframe>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Tour Highlights -->
        <?php if (!empty($tour['highlights'])): ?>
        <div class="section">
            <h2 class="section-title">Tour Highlights</h2>
            <ul class="highlight-list">
                <?php foreach ($tour['highlights'] as $highlight): ?>
                <li><?php echo htmlspecialchars($highlight); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php endif; ?>
        
        <!-- What's Included / Not Included -->
        <div class="section">
            <h2 class="section-title">What's Included</h2>
            <div class="two-columns">
                <div>
                    <h3>✅ Included</h3>
                    <ul class="included-list">
                        <?php foreach ($tour['whats_included'] as $item): ?>
                        <li><?php echo htmlspecialchars($item); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div>
                    <h3>❌ Not Included</h3>
                    <ul class="not-included-list">
                        <?php foreach ($tour['whats_not_included'] as $item): ?>
                        <li><?php echo htmlspecialchars($item); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Tour Languages -->
        <?php if (!empty($tour['tour_languages'])): ?>
        <div class="section">
            <h2 class="section-title">Tour Languages</h2>
            <div class="languages">
                <?php foreach ($tour['tour_languages'] as $language): ?>
                <span class="language-tag"><?php echo htmlspecialchars($language); ?></span>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
        
        <!-- Not Suitable For -->
        <?php if (!empty($tour['not_suitable_for'])): ?>
        <div class="section">
            <h2 class="section-title">Not Suitable For</h2>
            <ul class="not-included-list">
                <?php foreach ($tour['not_suitable_for'] as $item): ?>
                <li><?php echo htmlspecialchars($item); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
        <?php endif; ?>
        
        <!-- Full Description -->
        <div class="section">
            <h2 class="section-title">Full Description</h2>
            <div class="full-description">
                <?php echo nl2br(htmlspecialchars($tour['full_description'])); ?>
            </div>
        </div>
        
        <!-- Book Now -->
        <div class="book-now-section">
            <a href="<?php echo htmlspecialchars($tour['payment_link']); ?>" class="book-now-btn">
                <i class="fas fa-calendar-check"></i> Book Now - €<?php echo $tour['price']; ?>
            </a>
        </div>
    </div>
    
    <!-- Footer -->
    ${this.footerTemplate}
    
    <!-- Swiper JS -->
    <script src="https://unpkg.com/swiper@8/swiper-bundle.min.js"></script>
    <script>
        // Initialize Swiper
        const swiper = new Swiper('.swiper', {
            loop: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            autoplay: { delay: 5000 }
        });
        
        // FAQ Toggle
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
            });
        });
    </script>
</body>
</html>`;
    }

    async savePHPFile(filename, content) {
        try {
            // Send to server endpoint to save the file
            const response = await fetch('/api/generate-tour-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename, content })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save PHP file');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving PHP file:', error);
            throw error;
        }
    }
}

// Global functions for admin panel
window.addMainStop = function() {
    const container = document.getElementById('main-stops-container');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'main_stops[]';
    input.placeholder = 'Stop description';
    container.insertBefore(input, container.lastElementChild);
};

window.addFAQ = function() {
    const container = document.getElementById('faq-container');
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item';
    faqItem.innerHTML = `
        <input type="text" name="faq_questions[]" placeholder="Question" />
        <textarea name="faq_answers[]" rows="2" placeholder="Answer"></textarea>
        <button type="button" onclick="removeFAQ(this)">Remove</button>
    `;
    container.insertBefore(faqItem, container.lastElementChild);
};

window.removeFAQ = function(button) {
    button.parentElement.remove();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TourPageGenerator());
} else {
    new TourPageGenerator();
}

console.log('Tour Page Generator loaded successfully');