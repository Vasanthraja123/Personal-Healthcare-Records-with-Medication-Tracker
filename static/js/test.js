// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get all elements with null checks
    const getElement = (id) => {
        const el = document.getElementById(id);
        if (!el) console.warn(`Element with ID '${id}' not found`);
        return el;
    };

    // Main elements
    const monthYear = getElement("calendar-month-year");
    const calendar = getElement("calendar");
    const prevBtn = getElement("prev-month");
    const nextBtn = getElement("next-month");
    
    // Exit if essential elements are missing
    if (!monthYear || !calendar || !prevBtn || !nextBtn) {
        console.error("Essential calendar elements missing - stopping execution");
        return;
    }

    // Optional elements
    const successfulBtn = getElement("successful-dose");
    const unsuccessfulBtn = getElement("unsuccessful-dose");
    const ackForm = getElement("acknowledgment-form");

    // Initialize app state
    let date = new Date();
    let selectedStatus = true;
    let medicationLog = JSON.parse(localStorage.getItem("medicationLog")) || {};
    let customTimes = JSON.parse(localStorage.getItem("customTimes")) || {
        morning: "08:00:00",
        afternoon: "14:00:00",
        evening: "20:00:00"
    };

    // Calendar rendering function
    function renderCalendar() {
        calendar.innerHTML = "";
        monthYear.textContent = date.toLocaleDateString("en-US", { 
            month: "long", 
            year: "numeric" 
        });

        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            calendar.innerHTML += "<div></div>";
        }

        // Create day cells
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement("div");
            day.className = "day";
            day.innerHTML = `<strong>${i}</strong>`;
            
            const dateString = `${date.getFullYear()}-${
                String(date.getMonth() + 1).padStart(2, "0")}-${
                String(i).padStart(2, "0")}`;

            // Add medication slots
            ["morning", "afternoon", "evening"].forEach((time) => {
                const slot = document.createElement("div");
                slot.className = `slot ${time}`;
                slot.textContent = time;

                // Set initial status if logged
                if (medicationLog[dateString] && medicationLog[dateString][time] !== undefined) {
                    slot.classList.add(medicationLog[dateString][time] ? "taken" : "missed");
                }

                // Add click handler
                slot.addEventListener("click", () => {
                    if (!medicationLog[dateString]) medicationLog[dateString] = {};
                    medicationLog[dateString][time] = selectedStatus;
                    slot.classList.toggle("taken", selectedStatus);
                    slot.classList.toggle("missed", !selectedStatus);
                    localStorage.setItem("medicationLog", JSON.stringify(medicationLog));
                });

                day.appendChild(slot);
            });

            calendar.appendChild(day);
        }
    }

    // Navigation handlers
    prevBtn.addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });

    // Status toggle handlers
    if (successfulBtn) {
        successfulBtn.addEventListener("click", () => {
            selectedStatus = true;
        });
    }

    if (unsuccessfulBtn) {
        unsuccessfulBtn.addEventListener("click", () => {
            selectedStatus = false;
        });
    }

    // Acknowledgment form handler
    if (ackForm) {
        ackForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const medTaken = getElement("medication-taken");
            const notificationBox = getElement("notification");
            
            if (medTaken && notificationBox) {
                const message = `Medication status: ${medTaken.value}`;
                showNotification(message);
                
                notificationBox.classList.remove("hidden");
                const notificationText = notificationBox.querySelector("p");
                if (notificationText) {
                    notificationText.textContent = `Recorded: ${medTaken.value}`;
                }
            }
        });
    }

    // Notification helper
    function showNotification(message) {
        if (!("Notification" in window)) {
            alert(message); // fallback
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(message);
        } 
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(message);
                } else {
                    alert(message);
                }
            });
        } else {
            alert(message);
        }
    }

    // Medication reminders
    function scheduleAlerts() {
        Object.entries(customTimes).forEach(([timeName, timeValue]) => {
            const now = new Date();
            const alertTime = new Date();
            const [hours, minutes, seconds] = timeValue.split(":").map(Number);
            alertTime.setHours(hours, minutes, seconds, 0);

            const timeDiff = alertTime - now;
            if (timeDiff > 0) {
                setTimeout(() => {
                    showNotification(`💊 Time for your ${timeName} medication!`);
                }, timeDiff);
            }
        });
    }

    // Initialize
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    renderCalendar();
    scheduleAlerts();
});
