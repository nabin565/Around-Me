function findNearbyShops() {
    const status = document.getElementById("status-msg");
    const container = document.getElementById("card-container");
    
    if (!navigator.geolocation) {
        status.innerText = "Geolocation is not supported by your browser.";
        return;
    }

    status.innerText = "Locating you...";

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        status.innerText = "Found you! Scanning for shops...";
        fetchShops(lat, lon);
    }

    function error() {
        status.innerText = "Unable to retrieve your location.";
    }
}

function fetchShops(lat, lon) {
    const radius = 1000; // 1km search
    const status = document.getElementById("status-msg");
    
    // Query: Find Ramen, Cafes, and Convenience Stores
    const query = `
        [out:json];
        (
          node["cuisine"="ramen"](around:${radius},${lat},${lon});
          node["amenity"="cafe"](around:${radius},${lat},${lon});
          node["shop"="convenience"](around:${radius},${lat},${lon});
        );
        out body;
    `;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const shops = data.elements;
            status.innerText = `Success! Found ${shops.length} spots nearby.`;
            generateCards(shops);
        })
        .catch(err => {
            console.error(err);
            status.innerText = "Error fetching data.";
        });
}

function generateCards(shops) {
    const container = document.getElementById("card-container");
    container.innerHTML = ""; // Clear the example card

    // Limit to 9 results so the page doesn't get too heavy
    const displayShops = shops.slice(0, 9); 

    displayShops.forEach(shop => {
        const name = shop.tags.name || "Unknown Shop";
        // Determine type for the tag
        let type = "Shop";
        let image = "https://images.unsplash.com/photo-1574315042637-2f63456c80c2?auto=format&fit=crop&w=800"; // Default image

        if (shop.tags.cuisine === "ramen") {
            type = "Ramen";
            image = "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800";
        } else if (shop.tags.amenity === "cafe") {
            type = "Cafe";
            image = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800";
        } else if (shop.tags.shop === "convenience") {
            type = "Konbini";
            image = "https://images.unsplash.com/photo-1585672840545-2e336d8d9b6c?auto=format&fit=crop&w=800";
        }

        // Create the Google Maps Link
        const mapLink = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lon}`;

        // Create the HTML Card
        const cardHTML = `
            <div class="card">
                <div class="card-img" style="background-image: url('${image}');"></div>
                <div class="card-content">
                    <span class="tag">${type}</span>
                    <h3>${name}</h3>
                    <div class="price">Distance: ${radiusCalc(shop.lat, shop.lon)} approx</div>
                    <p>Found nearby via live scan.</p>
                    <a href="${mapLink}" target="_blank" class="btn-nav">Navigate Here</a>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    });
}

// Simple helper to make the "Distance" text look technical (optional)
function radiusCalc(lat, lon) {
    return "Nearby"; 
}
/* --- ABOUT MODAL LOGIC --- */

// Open the modal
function openAbout() {
    document.getElementById("about-modal").style.display = "block";
}

// Close the modal
function closeAbout() {
    document.getElementById("about-modal").style.display = "none";
}

// Close if user clicks outside the white box
window.onclick = function(event) {
    const modal = document.getElementById("about-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
/* --- HOME BUTTON LOGIC --- */
/* --- HOME BUTTON LOGIC --- */
function goHome() {
    // 1. Scroll smoothly to the top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // 2. Reset the Status Text
    document.getElementById("status-msg").innerText = "";

    // 3. Reset the Card Container (Clear the found shops)
    // We replace the results with a friendly "Ready" message
    const container = document.getElementById("card-container");
    container.innerHTML = `
        <div class="card">
            <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800');"></div>
            <div class="card-content">
                <span class="tag">Welcome</span>
                <h3>Ready to search again?</h3>
                <div class="price">---</div>
                <p>Click the button above to find fresh spots near you.</p>
            </div>
        </div>
    `;
}