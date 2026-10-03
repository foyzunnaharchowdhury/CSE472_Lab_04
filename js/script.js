const STORAGE_KEY = "cse472Lab04Registration";

const form = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");
const jsonOutput = document.getElementById("jsonOutput");
const storageMessage = document.getElementById("storageMessage");
const downloadButton = document.getElementById("downloadJson");
const removeButton = document.getElementById("removeRegistration");

function setFormMessage(message, kind) {
    formMessage.textContent = message;
    formMessage.className = `message ${kind}`;
}

function displayRegistration(registration) {
    jsonOutput.textContent = JSON.stringify(registration, null, 2);
    downloadButton.disabled = false;
    removeButton.disabled = false;
}

function readSavedRegistration() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
        jsonOutput.textContent = "No registration has been saved yet.";
        storageMessage.textContent = "No saved registration found.";
        downloadButton.disabled = true;
        removeButton.disabled = true;
        return;
    }

    try {
        const registration = JSON.parse(savedData);
        displayRegistration(registration);
        document.getElementById("studentName").value = registration.name;
        document.getElementById("studentId").value = registration.studentId;
        document.getElementById("studentEmail").value = registration.email;
        document.getElementById("workshop").value = registration.workshop;
        storageMessage.textContent = "Saved registration restored from localStorage.";
    } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
        jsonOutput.textContent = "The saved registration was invalid and has been removed.";
        storageMessage.textContent = "Saved data could not be read.";
        downloadButton.disabled = true;
        removeButton.disabled = true;
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const workshop = document.getElementById("workshop").value;

    if (name === "") {
        setFormMessage("Please enter your full name.", "error");
        document.getElementById("studentName").focus();
        return;
    }
    if (studentId === "") {
        setFormMessage("Please enter your student ID.", "error");
        document.getElementById("studentId").focus();
        return;
    }
    if (email === "") {
        setFormMessage("Please enter your email address.", "error");
        document.getElementById("studentEmail").focus();
        return;
    }
    if (!document.getElementById("studentEmail").checkValidity()) {
        setFormMessage("Please enter a valid email address.", "error");
        document.getElementById("studentEmail").focus();
        return;
    }
    if (workshop === "") {
        setFormMessage("Please select a workshop.", "error");
        document.getElementById("workshop").focus();
        return;
    }

    const registration = {
        name: name,
        studentId: studentId,
        email: email,
        workshop: workshop
    };
    const jsonData = JSON.stringify(registration, null, 2);

    localStorage.setItem(STORAGE_KEY, jsonData);
    displayRegistration(registration);
    storageMessage.textContent = "Registration saved in localStorage.";
    setFormMessage("Registration complete. Your JSON data is ready below.", "success");
});

document.getElementById("clearForm").addEventListener("click", function () {
    form.reset();
    setFormMessage("Form fields cleared.", "");
});

downloadButton.addEventListener("click", function () {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData === null) return;

    const file = new Blob([savedData], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "registration.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
});

removeButton.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_KEY);
    form.reset();
    readSavedRegistration();
    setFormMessage("Saved registration removed.", "");
});

readSavedRegistration();
