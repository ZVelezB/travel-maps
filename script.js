// Initialize TomTom Map
function initMap() {
    tt.setProductInfo('Map Repo Site', '1.0');
    const map = tt.map({
        key: 'jvqsCjPo76SDmG4NETSyRSFEe6B4pNXV',  // Replace with your TomTom API key
        container: 'map',
        center: [-68.15, -16.5],     // La Paz, Bolivia (longitude, latitude)
        zoom: 12
    });
    map.addControl(new tt.NavigationControl());
    return map;
}

// Calculate Average Coordinates
function calculateAverage(coords) {
    const avgLat = coords.reduce((sum, p) => sum + p.Latitude, 0) / coords.length;
    const avgLon = coords.reduce((sum, p) => sum + p.Longitude, 0) / coords.length;
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
                    const data = results.data;
                    data.forEach(point => {
                        if (point.Latitude && point.Longitude) {
                            new tt.Marker().setLngLat([parseFloat(point.Longitude), parseFloat(point.Latitude)]).addTo(map);
                        }
                    });

                    // Display Metrics
                    const avg = calculateAverage(data);
                    document.getElementById('metrics').innerHTML = `
                        Total Points: ${data.length}<br>
                        Average Latitude: ${avg.Latitude.toFixed(5)}<br>
                        Average Longitude: ${avg.Longitude.toFixed(5)}
                    `;
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
