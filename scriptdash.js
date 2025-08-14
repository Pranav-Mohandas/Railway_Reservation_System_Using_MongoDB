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
        
        console.log("👤 Profile data received:", profile);

        // Update profile section
        document.getElementById("userid").textContent = profile.userid || "N/A";
        document.getElementById("username1").textContent = profile.username || "N/A";
        document.getElementById("Mobile_number").textContent = profile.Mobile_number || "N/A";
        document.getElementById("email").textContent = profile.email || "N/A";

        // ✅ FIX: Update welcome section username
        document.getElementById("username").textContent = profile.username || "User";

        document.getElementById("profileSection").classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error loading profile. Please log in again.");
        sessionStorage.removeItem("userid");
        window.location.href = "login.html";
    }

    // ✅ FIX: Initialize payment form handlers after DOM is loaded
    initializePaymentHandlers();
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
                <td>${payment.payment_Type || 'N/A'}</td>
                <td>₹${payment.amount || '0'}</td>
                <td>${payment.confirmation || 'N/A'}</td>
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
        const response = await fetch(`http://localhost:5000/passenger_status/${userId}`);
        if (!response.ok) throw new Error("Failed to check passenger status");
        
        const { exists, passenger } = await response.json();
        
        if (exists) {
            document.getElementById("name").value = passenger.name;
            document.getElementById("mobile_number").value = passenger.mobile_number;
            document.getElementById("aadhar").value = passenger.aadhar;
            document.getElementById("age").value = passenger.age;
            document.getElementById("gender").value = passenger.gender;
        } else {
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

// ✅ FIX: Initialize payment handlers function
function initializePaymentHandlers() {
    // Payment method selection handler
    const paymentMethodSelect = document.getElementById("payment_method");
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener("change", function() {
            const paymentMethod = this.value;
            const paymentDetails = document.getElementById("paymentDetails");
            
            // Hide all payment options first
            document.querySelectorAll(".payment-option").forEach(option => {
                option.style.display = "none";
            });
            
            if (paymentMethod) {
                paymentDetails.style.display = "block";
                
                switch(paymentMethod) {
                    case "UPI":
                        document.getElementById("upiDetails").style.display = "block";
                        break;
                    case "Debit Card":
                    case "Credit Card":
                        document.getElementById("cardDetails").style.display = "block";
                        break;
                    case "Net Banking":
                        document.getElementById("netbankingDetails").style.display = "block";
                        break;
                    case "Digital Wallet":
                        document.getElementById("walletDetails").style.display = "block";
                        break;
                }
            } else {
                paymentDetails.style.display = "none";
            }
        });
    }

    // Card number formatting
    const cardNumberInput = document.getElementById("card_number");
    const expiryInput = document.getElementById("expiry_date");
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", function() {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
            this.value = formattedValue;
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener("input", function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }

    // ✅ FIX: Single booking form submit handler
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const userId = sessionStorage.getItem("userid");
            const paymentMethod = document.getElementById("payment_method").value;
            
            if (!paymentMethod) {
                alert("Please select a payment method");
                return;
            }

            console.log("🎫 Frontend - userId from sessionStorage:", userId, typeof userId);
            
            const payload = {
                userid: userId,
                name: document.getElementById("name").value,
                mobile_number: document.getElementById("mobile_number").value,
                aadhar: document.getElementById("aadhar").value,
                age: parseInt(document.getElementById("age").value),
                gender: document.getElementById("gender").value,
                train_no: parseInt(document.getElementById("train_no").value),
                payment_method: paymentMethod
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
                
                alert(`✅ Ticket booked successfully!\n🎟 Train Name: ${data.train_name}\n💳 Payment Method: ${paymentMethod}\n Ticket ID: ${data.ticket_id}\n💳 Transaction ID: ${data.transaction_id}\n💰 Amount: ₹${data.amount}`);
                
                // Reset form after successful booking
                bookingForm.reset();
                document.getElementById("paymentDetails").style.display = "none";
                document.querySelectorAll(".payment-option").forEach(option => {
                    option.style.display = "none";
                });
                
            } catch (err) {
                console.error("Booking failed:", err);
                alert(`Booking failed: ${err.message}`);
            }
        });
    }
}

// UPI App and Wallet selection handlers
document.addEventListener("click", function(e) {
    // UPI App selection
    if (e.target.classList.contains("app-btn") || e.target.closest(".app-btn")) {
        const btn = e.target.classList.contains("app-btn") ? e.target : e.target.closest(".app-btn");
        
        document.querySelectorAll(".app-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        
        const app = btn.dataset.app;
        const upiId = document.getElementById("upi_id");
        
        if (upiId) {
            switch(app) {
                case "googlepay":
                    upiId.placeholder = "yourname@oksbi, yourname@okaxis";
                    break;
                case "phonepe":
                    upiId.placeholder = "yourname@ybl, yourname@ibl";
                    break;
                case "paytm":
                    upiId.placeholder = "yourname@paytm";
                    break;
            }
        }
    }
    
    // Wallet selection
    if (e.target.classList.contains("wallet-btn") || e.target.closest(".wallet-btn")) {
        const btn = e.target.classList.contains("wallet-btn") ? e.target : e.target.closest(".wallet-btn");
        
        document.querySelectorAll(".wallet-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
    }
});
