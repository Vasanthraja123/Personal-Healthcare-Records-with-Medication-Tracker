document.addEventListener('DOMContentLoaded', function () {
    const patientListSection = document.getElementById('patient-list-section');
    const patientDetailsSection = document.getElementById('patient-details-section');
    const contactSection = document.getElementById('contact-section');
    const patientList = document.getElementById('patient-list');
    const patientsLink = document.getElementById('patients-link');
    const contactLink = document.getElementById('contact-link');
    const searchInput = document.getElementById('patient-search');
    const searchButton = document.getElementById('search-button');
    
    // Sample patient data
    const patients = [
        {
            name: "Willy",
            age: 45,
            healthProblems: "Hypertension, Diabetes",
            medications: [
                { name: "Losartan", dosage: "50mg", frequency: "Once daily", time: "8:00 AM" },
                { name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "8:00 AM and 8:00 PM" },
                { name: "Insulin", dosage: "10 units", frequency: "Before meals", time: "Before breakfast, lunch, and dinner" },
            ],
        },
        {
            name: "Chris",
            age: 53,
            healthProblems: "Asthma",
            medications: [
                { name: "Albuterol", dosage: "90 mcg", frequency: "As needed", time: "As needed" },
            ],
        },
        {
            name: "Sioun",
            age: 19,
            healthProblems: "Piles",
            medications: [
                { name: "Albuterol", dosage: "90 mcg", frequency: "As needed", time: "As needed" },
                { name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "8:00 AM and 8:00 PM" },
            ],
        },
    ];

    // Function to display patient list
    function displayPatientList(filteredPatients) {
        patientList.innerHTML = ''; // Clear previous list
        filteredPatients.forEach((patient, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p><strong>${patient.name}</strong> | Age: ${patient.age} | Problems: ${patient.healthProblems}</p>
                <button class="view-details" data-index="${index}">View Details</button>
            `;
            patientList.appendChild(listItem);
        });

        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                displayPatientDetails(filteredPatients[index]);
            });
        });
    }

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm !== "") {
            const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm));
            if (filteredPatients.length > 0) {
                displayPatientList(filteredPatients);
                patientListSection.classList.remove('hidden');
                patientDetailsSection.classList.add('hidden');
                contactSection.classList.add('hidden');
            } else {
                alert('No matching patients found');
                patientList.innerHTML = ''; // Clear list if no matches
            }
        } else {
            alert('Please enter a patient name to search');
        }
    });

    // Display full list of patients when "Patients" link is clicked
    patientsLink.addEventListener('click', () => {
        displayPatientList(patients);
        patientListSection.classList.remove('hidden');
        patientDetailsSection.classList.add('hidden');
        contactSection.classList.add('hidden');
    });

    // Contact link
    contactLink.addEventListener('click', () => {
        contactSection.classList.remove('hidden');
        patientListSection.classList.add('hidden');
        patientDetailsSection.classList.add('hidden');
    });

    // Function to display patient details
    function displayPatientDetails(patient) {
        patientDetailsSection.classList.remove('hidden');
        patientListSection.classList.add('hidden');
        contactSection.classList.add('hidden');

        const patientInfo = document.getElementById('patient-info');
        const medicationList = document.getElementById('medication-list');

        patientInfo.innerHTML = `
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Health Problems:</strong> ${patient.healthProblems}</p>
        `;

        medicationList.innerHTML = ''; // Clear previous medications
        patient.medications.forEach(medication => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medication.name}</td>
                <td>${medication.dosage}</td>
                <td>${medication.frequency}</td>
                <td>${medication.time}</td>
                <td><button>Edit</button></td>
            `;
            medicationList.appendChild(row);
        });
    }

    // Back to list button
    document.getElementById('back-to-list').addEventListener('click', () => {
        patientListSection.classList.remove('hidden');
        patientDetailsSection.classList.add('hidden');
    });
});
