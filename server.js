const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "public")));

// MongoDB Connection
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("mini_project");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

connectDB();

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));

// Signup
app.post("/signup", async (req, res) => {
  const { userid, username, email, Mobile_number, password } = req.body;

  if (!userid || !username || !email || !Mobile_number || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await db.collection("profile").findOne({
      $or: [{ userid }, { email }, { Mobile_number }]
    });

    if (existing) {
      return res.status(409).json({ message: "User already exists with same ID, email, or mobile number" });
    }

    await db.collection("profile").insertOne({
      userid,
      username,
      email,
      Mobile_number,
      password
    });
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { userid, password } = req.body;

  if (!userid || !password) {
    return res.status(400).json({ message: "User ID and password are required" });
  }

  try {
    const user = await db.collection("profile").findOne({ userid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", userid: user.userid });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch profile
app.get("/profile/:userid", async (req, res) => {
  try {
    const user = await db.collection("profile").findOne(
      { userid: req.params.userid },
      { projection: { _id: 0, password: 0 } }
    );
    
    if (!user) return res.status(404).json({ error: "Profile not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch trains
app.get("/train", async (req, res) => {
  try {
    const trains = await db.collection("train").find().toArray();
    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Passenger Status
app.get("/passenger_status/:userid", async (req, res) => {
  try {
    const passenger = await db.collection("passenger").findOne({
      userid: req.params.userid
    });
    res.json({ exists: !!passenger, passenger });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Book Ticket
app.post("/book_ticket", async (req, res) => {
  const { userid, name, age, gender, mobile_number, aadhar, train_no, payment_method } = req.body;
  
  if (!userid || !name || !age || !gender || !mobile_number || !train_no || !payment_method) {
    return res.status(400).json({ message: "All required fields including payment method must be provided" });
  }

  try {
    const trainNum = parseInt(train_no);
    const train = await db.collection("train").findOne({ train_no: trainNum });
    if (!train) return res.status(400).json({ message: "Invalid train number" });

    // Check/insert passenger
    const passengerExists = await db.collection("passenger").findOne({ userid });
    if (!passengerExists) {
      await db.collection("passenger").insertOne({
        userid,
        name,
        mobile_number,
        aadhar,
        age,
        gender
      });
    }

    // Create payment with selected payment method
    const amount = Math.floor(Math.random() * 401) + 100;
    const payment = await db.collection("payment").insertOne({
      payment_Type: payment_method, // Use selected payment method instead of hardcoded "UPI"
      amount: amount,
      confirmation: "Confirmed",
      timestamp: new Date(),
      userid: userid
    });

    console.log("💰 Payment created with method:", payment_method);

    // Create ticket
    const ticket = await db.collection("tickets").insertOne({
      transaction_id: payment.insertedId.toString(),
      name,
      age,
      train_no: trainNum,
      train_name: train.name,
      reservation_type: train.class,
      source: train.source,
      destination: train.destination,
      booking_status: "Confirmed",
      booking_datetime: new Date(),
      mobile_number,
      userid: userid
    });

    res.status(201).json({
      message: "✅ Ticket booked successfully",
      ticket_id: ticket.insertedId.toString(),
      transaction_id: payment.insertedId.toString(),
      amount,
      train_name: train.name,
      payment_method: payment_method
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Past Tickets
app.get("/past_tickets/:userid", async (req, res) => {
  try {
    const tickets = await db.collection("tickets").find({
      userid: req.params.userid
    }).project({ 
      _id: 1, 
      transaction_id: 1, 
      train_no: 1, 
      train_name: 1, 
      reservation_type: 1, 
      source: 1, 
      destination: 1, 
      booking_status: 1, 
      booking_datetime: 1 
    }).toArray();
    
    // Convert ObjectIDs to strings
    const processedTickets = tickets.map(ticket => ({
      ...ticket,
      _id: ticket._id.toString()
    }));

    res.json(processedTickets);
  } catch (err) {
    console.error("Past tickets error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/payment_history/:userid", async (req, res) => {
    const { userid } = req.params;
    
    console.log("🔍 Searching for userid:", userid);

    try {
        // Direct query on payment collection (not aggregation)
        const payments = await db.collection("payment").find({
            userid: userid
        }).toArray();

        console.log("💰 Raw payments from DB:", JSON.stringify(payments, null, 2));

        if (payments.length === 0) {
            return res.json([]);
        }

        const formattedPayments = payments.map(payment => ({
            userid: payment.userid,
            transaction_id: payment._id.toString(),
            amount: payment.amount,
            confirmation: payment.confirmation,
            payment_Type: payment.payment_Type,
            timestamp: payment.timestamp
        }));

        console.log("📤 Formatted payments being sent:", JSON.stringify(formattedPayments, null, 2));

        res.json(formattedPayments);
    } catch (error) {
        console.error("Error fetching payment history:", error);
        res.status(500).json({ error: "Error fetching payment history" });
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
