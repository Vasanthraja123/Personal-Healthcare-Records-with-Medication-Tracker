document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form from submitting

    const userType = document.getElementById('userType').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Sample credentials for doctor & patient
    const doctorEmail = "doctor@example.com";
    const doctorPassword = "doctor123";
    const patientEmail = "patient@example.com";
    const patientPassword = "patient123";

    if (userType === "doctor" && email === doctorEmail && password === doctorPassword) {
        alert("Doctor login successful!");
        window.location.href = "doctor.html";  // Redirect to doctor page
    } else if (userType === "patient" && email === patientEmail && password === patientPassword) {
        alert("Patient login successful!");
        window.location.href = "test.html";  // Redirect to patient page
    } else {
        alert("Invalid email or password. Please try again.");
    }
});
