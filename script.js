// Initialize TomTom Map
function initMap() {
    tt.setProductInfo('Map Repo Site', '1.0');
    const map = tt.map({
        key: 'YOUR_TOMTOM_API_KEY',  // Replace with your TomTom API key
        container: 'map',
        center: [-68.15, -16.5],     // La Paz, Bolivia (longitude, latitude)
        zoom: 12
    });
    map.addControl(new tt.NavigationControl());
    return map;
}

// Calculate Average Coordinates
function calculateAverage(coords) {
    const validCoords = coords.filter(p => !isNaN(p.Latitude) && !isNaN(p.Longitude));
    const avgLat = validCoords.reduce((sum, p) => sum + p.Latitude, 0) / validCoords.length;
    const avgLon = validCoords.reduce((sum, p) => sum + p.Longitude, 0) / validCoords.length;
    return { Latitude: avgLat, Longitude: avgLon };
}

// Handle CSV Upload
function handleCSVUpload(map) {
    document.getElementById('csvFile').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const data = results.data.map(point => ({
                        Latitude: parseFloat(point.Latitude.trim()),
                        Longitude: parseFloat(point.Longitude.trim())
                    })).filter(p => !isNaN(p.Latitude) && !isNaN(p.Longitude));

                    data.forEach(point => {
                        new tt.Marker().setLngLat([point.Longitude, point.Latitude]).addTo(map);
                    });

                    // Display Metrics
                    if (data.length > 0) {
                        const avg = calculateAverage(data);
                        document.getElementById('metrics').innerHTML = `
                            Total Points: ${data.length}<br>
                            Average Latitude: ${avg.Latitude.toFixed(3)}<br>
                            Average Longitude: ${avg.Longitude.toFixed(3)}
                        `;
                    } else {
                        document.getElementById('metrics').innerHTML = "No valid coordinates found.";
                    }
                }
            });
        }
    });
}

// Handle Repo Submission
function handleRepoSubmission() {
    document.getElementById("repoForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const repoURL = document.getElementById("repo").value;
        document.getElementById("submittedRepo").innerHTML = `Submitted Repo: <a href="${repoURL}" target="_blank">${repoURL}</a>`;
        document.getElementById("repo").value = "";
    });
}

// Initialize Everything on Load
window.onload = function () {
    const map = initMap();
    handleCSVUpload(map);
    handleRepoSubmission();
};
