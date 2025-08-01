document.addEventListener("DOMContentLoaded", async function () {
    const userId = sessionStorage.getItem("userid");

    if (!userId) {
        alert("User not logged in! Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/profile/${userId}`);

        if (!response.ok) throw new Error("Failed to fetch profile");

        const profile = await response.json();
        
        console.log("👤 Profile data received:", profile); // Debug log

        document.getElementById("userid").textContent = profile.userid || "N/A";
        document.getElementById("username1").textContent = profile.username || "N/A";  // ✅ This should work
        document.getElementById("Mobile_number").textContent = profile.Mobile_number || "N/A";
        document.getElementById("email").textContent = profile.email || "N/A";

        document.getElementById("profileSection").classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile. Please log in again.");
        sessionStorage.removeItem("userid");
        window.location.href = "login.html";
    }
});


// Logout function
document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("userid");
    alert("Logged out successfully!");
    window.location.href = "login.html";
});

// Utility function to toggle sections
function showSection(sectionId) {
    document.querySelectorAll("main section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// Nav Event Handlers
document.getElementById("profileBtn").addEventListener("click", () => showSection("profileSection"));
document.getElementById("bookTicketsBtn").addEventListener("click", () => {
    showSection("bookingSection");
    loadTrainList();
});
document.getElementById("pastTicketsBtn").addEventListener("click", () => {
    showSection("pastTicketsSection");
    fetchPastTickets();
});
document.getElementById("paymentHistoryBtn").addEventListener("click", () => {
    showSection("paymentHistorySection");
    fetchPaymentHistory();
});

// Fetch Past Tickets
async function fetchPastTickets() {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
        alert("User not logged in!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/past_tickets/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch past tickets");

        const tickets = await response.json();
        const tableBody = document.getElementById("pastTicketsTable");
        tableBody.innerHTML = "";

        if (tickets.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9">No past tickets found</td></tr>`;
            return;
        }

        tickets.forEach(ticket => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${ticket._id}</td>
                <td>${ticket.transaction_id}</td>
                <td>${ticket.train_no}</td>
                <td>${ticket.train_name}</td>
                <td>${ticket.reservation_type}</td>
                <td>${ticket.source}</td>
                <td>${ticket.destination}</td>
                <td>${ticket.booking_status}</td>
                <td>${new Date(ticket.booking_datetime).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching past tickets:", error);
        alert("Error loading past tickets.");
    }
}

// Fetch Payment History
async function fetchPaymentHistory() {
    const userId = sessionStorage.getItem("userid");
    
    if (!userId) {
        alert("User not logged in!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/payment_history/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch payment history");

        const payments = await response.json();
        console.log("📊 Raw payment data received:", payments);
        console.log("📊 First payment object:", payments[0]);
        
        // Log each field individually to see what's undefined
        if (payments.length > 0) {
            const firstPayment = payments[0];
            console.log("🔍 Field analysis:");
            console.log("   userid:", firstPayment.userid);
            console.log("   transaction_id:", firstPayment.transaction_id);
            console.log("   amount:", firstPayment.amount);
            console.log("   confirmation:", firstPayment.confirmation);
            console.log("   payment_Type:", firstPayment.payment_Type);
        }
        
        const tableBody = document.getElementById("paymentHistoryTable");
        tableBody.innerHTML = "";

        if (payments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5">No payment history found</td></tr>`;
            return;
        }

        payments.forEach((payment, index) => {
            console.log(`💳 Processing payment ${index}:`, payment);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${payment.userid || 'N/A'}</td>
                <td>${payment.transaction_id || 'N/A'}</td>
                <td>₹${payment.amount || '0'}</td>
                <td>${payment.confirmation || 'N/A'}</td>
                <td>${payment.payment_Type || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("❌ Error fetching payment history:", error);
        alert("Error loading payment history.");
    }
}


// Populate Train Dropdown
async function loadTrainList() {
    try {
        const response = await fetch("http://localhost:5000/train");
        const trains = await response.json();

        const trainSelect = document.getElementById("train_no");
        trainSelect.innerHTML = `<option value="">Select Train</option>`;

        trains.forEach(train => {
            const option = document.createElement("option");
            option.value = train.train_no;
            option.textContent = `${train.train_no} - ${train.name}`;
            option.dataset.name = train.name;
            option.dataset.source = train.source;
            option.dataset.destination = train.destination;
            option.dataset.class = train.class;
            trainSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading trains:", error);
    }
}

// Add event listener for train selection
document.getElementById("train_no").addEventListener("change", function() {
    const selected = this.options[this.selectedIndex];
    document.getElementById("name1").textContent = selected.dataset.name || "--";
    document.getElementById("source").textContent = selected.dataset.source || "--";
    document.getElementById("destination").textContent = selected.dataset.destination || "--";
    document.getElementById("class").textContent = selected.dataset.class || "--";
});

// Book Tickets Button Handler
document.getElementById("bookTicketsBtn").addEventListener("click", async () => {
    showSection("bookingSection");
    await loadTrainList();
    
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        // Check passenger status
        const response = await fetch(`http://localhost:5000/passenger_status/${userId}`);
        if (!response.ok) throw new Error("Failed to check passenger status");
        
        const { exists, passenger } = await response.json();
        
        if (exists) {
            // Existing passenger - auto-fill all details
            document.getElementById("name").value = passenger.name;
            document.getElementById("mobile_number").value = passenger.mobile_number;
            document.getElementById("aadhar").value = passenger.aadhar;
            document.getElementById("age").value = passenger.age;
            document.getElementById("gender").value = passenger.gender;
        } else {
            // New passenger - auto-fill from profile
            const profileRes = await fetch(`http://localhost:5000/profile/${userId}`);
            if (!profileRes.ok) throw new Error("Failed to fetch profile");
            
            const profile = await profileRes.json();
            document.getElementById("name").value = profile.username || "";
            document.getElementById("mobile_number").value = profile.Mobile_number || "";
        }
    } catch (error) {
        console.error("Error checking passenger status:", error);
        alert("Error loading booking form");
    }
});

// Booking Form Submit Handler
document.getElementById("bookingForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = sessionStorage.getItem("userid");
    console.log("🎫 Frontend - userId from sessionStorage:", userId, typeof userId);
    
    const payload = {
        userid: userId,
        name: document.getElementById("name").value,
        mobile_number: document.getElementById("mobile_number").value,
        aadhar: document.getElementById("aadhar").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        train_no: parseInt(document.getElementById("train_no").value)
    };

    console.log("📤 Frontend - Sending payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch("http://localhost:5000/book_ticket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Booking failed");
        }

        const data = await response.json();
        
        alert(`✅ Ticket booked successfully!\n🎟 Train Name: ${data.train_name}\n Ticket ID: ${data.ticket_id}\n💳 Transaction ID: ${data.transaction_id}\n💰 Amount: ₹${data.amount}`);
        
    } catch (err) {
        console.error("Booking failed:", err);
        alert(`Booking failed: ${err.message}`);
    }
});
    
        // // Reset form
        // document.getElementById("bookingForm").reset();
        // document.getElementById("name1").textContent = "--";
        // document.getElementById("source").textContent = "--";
        // document.getElementById("destination").textContent = "--";
        // document.getElementById("reservation_type").textContent = "--";
        
   
  