// Bus schedule data
const busSchedules = {
    'kotagiri-kengarai': ['06:50', '08:50', '09:20', '11:20', '14:30', '16:30', '18:20', '18:30'],
    'tirupur-kotagiri': ['06:00', '07:00', '08:20', '14:00', '15:10', '16:30'],
    'thunari-kotagiri': ['06:30', '08:00', '10:00', '12:00', '14:00', '16:00'],
    'kotagiri-thunari': ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00'],
    'kengarai-kotagiri': ['05:50', '07:00', '08:15', '10:00', '13:30', '16:30'],
};

// Update time
function updateCurrentTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent =
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Convert time string to minutes
function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

// Format time
function formatTime(t, tomorrow = false) {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2,'0')} ${period}${tomorrow ? " (Tomorrow)" : ""}`;
}

function findNextBus(origin, destination) {
    if (origin === destination) {
        return { error: "Origin and destination must be different." };
    }

    const key = `${origin}-${destination}`;
    const schedule = busSchedules[key];

    if (!schedule) return { error: "No bus route available for this selection." };

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let time of schedule) {
        if (timeToMinutes(time) > currentMinutes) {
            return {
                route: `${origin} → ${destination}`,
                displayTime: formatTime(time),
                isTomorrow: false
            };
        }
    }

    // No buses left today → next day's first bus
    return {
        route: `${origin} → ${destination}`,
        displayTime: formatTime(schedule[0], true),
        isTomorrow: true
    };
}

// Form submit
document.getElementById('busForm').addEventListener('submit', e => {
    e.preventDefault();

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    const result = findNextBus(origin, destination);
    const infoDiv = document.getElementById('busInfo');
    const resultDiv = document.getElementById('result');

    if (result.error) {
        infoDiv.innerHTML = `<p class="error">${result.error}</p>`;
    } else {
        infoDiv.innerHTML = `
            <p><strong>Route:</strong> ${result.route}</p>
            <p><strong>Departure Time:</strong> ${result.displayTime}</p>
            <p><strong>Status:</strong> ${result.isTomorrow ? 'Tomorrow' : 'Today'}</p>
        `;
    }

    resultDiv.classList.add('show');
});

updateCurrentTime();
setInterval(updateCurrentTime, 1000);
