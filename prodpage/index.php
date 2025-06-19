<?php
/**
 * Tours Index Page
 * Generated automatically - lists all available tours
 */

$tours = [
  {
    "id": 1,
    "title": "Sahara Desert Adventure",
    "description": "Experience the magic of the Sahara Desert with our exclusive 2-day adventure tour. Discover ancient oases, ride camels across golden dunes, and sleep under a blanket of stars in our luxury desert camp.",
    "price": 299,
    "image_urls": [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    ],
    "tour_type": "Desert Safari",
    "duration": "2 Days / 1 Night",
    "location": "Sahara Desert, Tunisia",
    "pickup_location": "Hotel pickup from Djerba city center",
    "return_location": "Return to original pickup point",
    "main_stops": [
      "Matmata - Underground Berber homes",
      "Tataouine - Ancient fortified villages",
      "Sahara Desert - Camel trekking",
      "Desert Camp - Overnight stay",
      "Sunrise viewing point"
    ],
    "itinerary_map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3377.5",
    "highlights": [
      "Camel trekking across golden sand dunes",
      "Traditional Berber village visits",
      "Spectacular sunrise and sunset views",
      "Authentic desert camping experience",
      "Star gazing in the clear desert sky",
      "Traditional music and storytelling"
    ],
    "whats_included": [
      "Round-trip transportation",
      "Professional English/French guide",
      "Camel trekking experience",
      "Desert camp accommodation",
      "Traditional dinner and breakfast",
      "All entrance fees"
    ],
    "whats_not_included": [
      "Personal expenses",
      "Alcoholic beverages",
      "Travel insurance",
      "Tips for guides and drivers"
    ],
    "tour_languages": [
      "English",
      "French",
      "Arabic"
    ],
    "not_suitable_for": [
      "Children under 5 years",
      "Pregnant women",
      "People with serious back problems",
      "Those afraid of heights"
    ],
    "full_description": "Embark on an unforgettable journey into the heart of the Sahara Desert, where endless golden dunes meet the azure sky. This carefully crafted 2-day adventure combines cultural immersion with natural wonder, offering you the chance to experience authentic Berber hospitality while exploring one of the world's most magnificent landscapes.\n\nDay 1: Begin your adventure with a scenic drive through the unique landscapes of southern Tunisia. Visit the fascinating underground dwellings of Matmata, made famous by Star Wars movies, and explore the ancient ksour (fortified villages) of Tataouine. As the sun begins to set, embark on a magical camel trek across the rolling sand dunes, arriving at our traditional desert camp as darkness falls.\n\nDay 2: Wake before dawn to witness one of nature's most spectacular displays - sunrise over the Sahara. After breakfast, enjoy some free time to explore the desert surroundings before beginning your journey back, carrying with you memories that will last a lifetime.",
    "payment_link": "https://your-payment-gateway.com/sahara-desert-adventure",
    "reviews_import_url": "https://www.getyourguide.com/sample-reviews",
    "created_at": "2025-06-17T15:10:17.391Z",
    "updated_at": "2025-06-17T15:10:17.392Z"
  }
];

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
    <title>Our Tours - Depart Travel Services</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .tours-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 0; text-align: center; }
        .tours-header h1 { font-size: 3rem; margin-bottom: 1rem; }
        .tours-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; padding: 4rem 0; }
        .tour-card { background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.3s ease; }
        .tour-card:hover { transform: translateY(-5px); }
        .tour-image { width: 100%; height: 250px; object-fit: cover; }
        .tour-content { padding: 1.5rem; }
        .tour-title { font-size: 1.4rem; font-weight: 600; margin-bottom: 0.5rem; color: #2c3e50; }
        .tour-description { color: #666; margin-bottom: 1rem; font-size: 0.9rem; }
        .tour-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .tour-price { font-size: 1.2rem; font-weight: 600; color: #667eea; }
        .tour-duration { color: #666; font-size: 0.9rem; }
        .view-tour-btn { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.8rem 1.5rem; text-decoration: none; border-radius: 25px; font-weight: 500; transition: all 0.3s ease; width: 100%; text-align: center; }
        .view-tour-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        @media (max-width: 768px) {
            .tours-header h1 { font-size: 2rem; }
            .tours-grid { grid-template-columns: 1fr; padding: 2rem 0; }
        }
    </style>
</head>
<body>
    <div class="tours-header">
        <div class="container">
            <h1>Our Amazing Tours</h1>
            <p>Discover the beauty and culture of Tunisia with our carefully curated experiences</p>
        </div>
    </div>

    <div class="container">
        <div class="tours-grid">
            <?php foreach ($tours as $tour): 
                $images = $tour['image_urls'] ?? [];
                if (is_string($images)) {
                    $images = json_decode($images, true) ?? [];
                }
                $firstImage = !empty($images) ? $images[0] : 'https://via.placeholder.com/400x250/667eea/ffffff?text=Tour+Image';
                
                $title = $tour['title'] ?? 'Unknown Tour';
                $id = $tour['id'] ?? 0;
                $slug = strtolower(preg_replace('/[^a-z0-9\s-]/', '', $title));
                $slug = preg_replace('/\s+/', '-', $slug);
                $slug = substr($slug, 0, 50);
                $pageUrl = "/prodpage/{$slug}-{$id}.php";
            ?>
            <div class="tour-card">
                <img src="<?php echo htmlspecialchars($firstImage); ?>" 
                     alt="<?php echo htmlspecialchars($title); ?>" 
                     class="tour-image">
                
                <div class="tour-content">
                    <h3 class="tour-title"><?php echo htmlspecialchars($title); ?></h3>
                    
                    <p class="tour-description">
                        <?php echo htmlspecialchars(substr($tour['description'] ?? '', 0, 120)); ?>...
                    </p>
                    
                    <div class="tour-meta">
                        <span class="tour-price">€<?php echo htmlspecialchars($tour['price'] ?? '0'); ?></span>
                        <span class="tour-duration">
                            <i class="fas fa-clock"></i> 
                            <?php echo htmlspecialchars($tour['duration'] ?? 'Full Day'); ?>
                        </span>
                    </div>
                    
                    <a href="<?php echo htmlspecialchars($pageUrl); ?>" class="view-tour-btn">
                        <i class="fas fa-eye"></i> View Details
                    </a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>
</html>