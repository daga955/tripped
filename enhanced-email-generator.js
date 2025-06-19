/**
 * Enhanced Email Generator for Multi-Tour Bookings
 * This module provides improved email generation that properly handles multiple tour selections
 */

function generateEnhancedBookingEmail(bookingData, tourDetails = null) {
  console.log("Generating enhanced email template for booking:", bookingData.id);

  function safeGet(obj, path, defaultValue = "Not specified") {
    try {
      return path.split(".").reduce((o, p) => o && o[p] !== undefined ? o[p] : defaultValue, obj);
    } catch {
      return defaultValue;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
    } catch {
      return dateString;
    }
  }

  const isJoinTour = safeGet(bookingData, "type") === "join";
  
  // Parse contact details properly
  let contactDetails = {};
  try {
    if (typeof bookingData.contact_details === 'string') {
      contactDetails = JSON.parse(bookingData.contact_details);
    } else {
      contactDetails = bookingData.contact_details || {};
    }
  } catch (e) {
    console.error("Error parsing contact details:", e);
    contactDetails = bookingData.contact_details || {};
  }

  // Enhanced tour information section with multi-tour support
  let tourInfoSection = "";
  let selectedTours = [];
  let isMultiTourBooking = false;
  
  try {
    console.log("Analyzing booking data for tours:", {
      hasSelectedTours: !!bookingData.selectedTours,
      hasDays: !!bookingData.days,
      multiTourBooking: !!bookingData.multiTourBooking
    });

    // Parse selected tours from the enhanced booking data
    if (bookingData.selectedTours && Array.isArray(bookingData.selectedTours)) {
      selectedTours = bookingData.selectedTours;
      isMultiTourBooking = selectedTours.length > 1;
      console.log("Found selectedTours array:", selectedTours);
    } else if (bookingData.days && Array.isArray(bookingData.days) && bookingData.days.length > 0) {
      // Extract tours from days array
      selectedTours = bookingData.days
        .filter(day => day.tour && day.tour !== "")
        .map(day => ({
          id: day.tourId || null,
          title: day.tour,
          accommodation: day.accommodation || 'Standard'
        }));
      isMultiTourBooking = selectedTours.length > 1;
      console.log("Extracted tours from days array:", selectedTours);
    }
    
    // Also check for tour selection data
    if (bookingData.tourSelectionData) {
      console.log("Found tourSelectionData:", bookingData.tourSelectionData);
      if (bookingData.tourSelectionData.selectedTours) {
        selectedTours = bookingData.tourSelectionData.selectedTours;
        isMultiTourBooking = selectedTours.length > 1;
      }
    }
  } catch (e) {
    console.error("Error parsing selected tours:", e);
  }
  
  console.log("Final tour analysis:", {
    selectedTours: selectedTours,
    isMultiTourBooking: isMultiTourBooking,
    tourCount: selectedTours.length
  });
  
  if (isMultiTourBooking && selectedTours.length > 0) {
    // Multiple tours selected - show all of them with enhanced formatting
    const tourList = selectedTours.map((tour, index) => {
      const tourNumber = index + 1;
      return `
        <li style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-left: 4px solid #0073e6;">
          <strong>Tour ${tourNumber}:</strong> ${tour.title || 'Tour Name Not Available'}
          ${tour.id ? `<br><em>Tour ID: ${tour.id}</em>` : ''}
          ${tour.accommodation ? `<br><em>Accommodation: ${tour.accommodation}</em>` : ''}
        </li>
      `;
    }).join('');
    
    tourInfoSection = `
    <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">🏛️ Selected Tours (${selectedTours.length} tours)</h3>
    <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${tourList}
      </ul>
      <div style="margin-top: 15px; padding: 10px; background: #e0f2fe; border-radius: 5px;">
        <strong>Tour Type:</strong> ${isJoinTour ? "Group Tours" : "Private Tours"}<br>
        <strong>Total Tours:</strong> ${selectedTours.length}<br>
        <strong>Tour Titles:</strong> ${selectedTours.map(t => t.title).join(', ')}<br>
        <strong>Note:</strong> Multiple ${isJoinTour ? "group" : "private"} tours selected - pricing will be calculated for the complete package
      </div>
    </div>
    `;
  } else if (selectedTours.length === 1) {
    // Single tour selected
    const tour = selectedTours[0];
    tourInfoSection = `
    <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">🏛️ Selected Tour</h3>
    <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li><strong>Tour Title:</strong> ${tour.title}</li>
        ${tour.id ? `<li><strong>Tour ID:</strong> ${tour.id}</li>` : ''}
        <li><strong>Tour Type:</strong> ${isJoinTour ? "Group Tour" : "Private Tour"}</li>
        ${tour.accommodation ? `<li><strong>Accommodation:</strong> ${tour.accommodation}</li>` : ''}
        ${tourDetails && tourDetails.price ? `<li><strong>Tour Price:</strong> $${tourDetails.price} per person</li>` : ''}
      </ul>
      ${!isJoinTour ? `<p style="color: #666; font-style: italic;">Note: Private tour - final pricing may be customized</p>` : ""}
    </div>
    `;
  } else if (tourDetails && tourDetails.title) {
    // Fallback to original single tour details
    tourInfoSection = `
    <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">🏛️ Selected Tour</h3>
    <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li><strong>Tour Title:</strong> ${tourDetails.title}</li>
        <li><strong>Tour Type:</strong> ${isJoinTour ? "Group Tour" : "Private Tour"}</li>
        <li><strong>Tour Price:</strong> $${tourDetails.price} per person</li>
      </ul>
      ${!isJoinTour ? `<p style="color: #666; font-style: italic;">Note: Private tour - final pricing may be customized</p>` : ""}
    </div>
    `;
  } else {
    // Fallback for when tour details are not available
    const tourId = safeGet(bookingData, "tour_id");
    if (tourId && tourId !== "Not specified" && tourId !== null) {
      tourInfoSection = `
      <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">🏛️ Selected Tour</h3>
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li><strong>Tour ID:</strong> ${tourId}</li>
          <li><strong>Tour Type:</strong> ${isJoinTour ? "Group Tour" : "Private Tour"}</li>
        </ul>
        <p style="color: #666; font-style: italic;">Note: ${isJoinTour ? "Group" : "Private"} tour - pricing details will be confirmed</p>
      </div>
      `;
    } else {
      // When no tour is selected (custom tour build)
      tourInfoSection = `
      <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">🏛️ Tour Request</h3>
      <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li><strong>Tour Type:</strong> ${isJoinTour ? "Group Tour" : "Private/Custom Tour"}</li>
        </ul>
        <p style="color: #666; font-style: italic;">Note: Custom tour request - pricing will be provided based on requirements</p>
      </div>
      `;
    }
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <h2 style="color: #0073e6; text-align: center; padding: 20px; background: #f8f9fa; margin: 0;">
        🎉 New ${isJoinTour ? "Group" : "Private"} Tour Booking Request
      </h2>

      ${tourInfoSection}

      <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">📞 Contact Details</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li><strong>Name:</strong> ${safeGet(contactDetails, "fullName")}</li>
          <li><strong>Email:</strong> ${safeGet(contactDetails, "email")}</li>
          <li><strong>WhatsApp:</strong> ${safeGet(contactDetails, "whatsapp")}</li>
          <li><strong>Language:</strong> ${safeGet(contactDetails, "language")}</li>
          ${safeGet(contactDetails, "couponCode") !== "Not specified" && safeGet(contactDetails, "couponCode") !== "" ? 
            `<li><strong>Coupon Code:</strong> ${safeGet(contactDetails, "couponCode")}</li>` : ""}
          ${safeGet(contactDetails, "notes") !== "Not specified" && safeGet(contactDetails, "notes") !== "" ? 
            `<li><strong>Additional Notes:</strong> ${safeGet(contactDetails, "notes")}</li>` : ""}
        </ul>
      </div>

      <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">📅 Trip Details</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li><strong>Start Date:</strong> ${formatDate(bookingData.start_date)}</li>
          <li><strong>End Date:</strong> ${formatDate(bookingData.end_date)}</li>
          <li><strong>Departure City:</strong> ${safeGet(bookingData, "departure_city")}</li>
          <li><strong>Adults:</strong> ${safeGet(bookingData, "adults")}</li>
          <li><strong>Children:</strong> ${safeGet(bookingData, "children")}</li>
          ${safeGet(bookingData, "budget") !== "Not specified" && safeGet(bookingData, "budget") !== null ? 
            `<li><strong>Customer Budget:</strong> ${safeGet(bookingData, "budget")} ${safeGet(bookingData, "currency")}</li>` : ""}
          <li><strong>Accommodation:</strong> ${safeGet(bookingData, "accommodation")}</li>
        </ul>
      </div>

      <h3 style="color: #0073e6; border-bottom: 2px solid #0073e6; padding-bottom: 5px;">🏷️ Booking Information</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li><strong>Booking ID:</strong> ${bookingData.id}</li>
          <li><strong>Type:</strong> ${isJoinTour ? "Group Tour" : "Private Tour"}</li>
          <li><strong>Status:</strong> ${safeGet(bookingData, "status", "pending")}</li>
          ${isMultiTourBooking ? `<li><strong>Multi-Tour Booking:</strong> Yes (${selectedTours.length} tours)</li>` : ''}
        </ul>
      </div>

      <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #666; font-style: italic; text-align: center;">
        This booking was submitted on ${new Date().toLocaleString()}
      </p>
      <p style="color: #666; text-align: center;">
        Please contact the customer as soon as possible to confirm their booking details.
      </p>
    </div>
  `;
}

// Export for use in the main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateEnhancedBookingEmail };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
  window.generateEnhancedBookingEmail = generateEnhancedBookingEmail;
}