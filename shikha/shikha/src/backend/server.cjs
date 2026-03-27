require('dotenv').config(); // Local dev config map
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_here';

const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://crime-report-system-eight.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());

// --- 2. MONGODB CONNECTION ---
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crimePortalDB';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB (crimePortalDB)");
    // THIS IS THE FIX: This clears old "Required" rules that might be blocking your saves
    try {
      await mongoose.connection.db.collection('reports').dropIndexes();
      console.log("🧹 Old Database Indexes Cleared");
    } catch (e) {
      // If collection doesn't exist yet, it just skips this
    }

    // --- SEEDING INITIAL DATA ---
    const seedData = async () => {
      // 1. Seed Officers
      const officerCount = await Officer.countDocuments();
      if (officerCount === 0) {
        console.log("🌱 Seeding Officers...");
        await Officer.insertMany([
          { name: "Arjun Kumar", badgeNumber: "KP-101", rank: "Inspector", department: "Cyber Cell", contact: "9876543210", email: "arjun.k@keralapolice.gov" },
          { name: "Meena Satheesh", badgeNumber: "KP-102", rank: "Sub-Inspector", department: "Crime Branch", contact: "9876543211", email: "meena.s@keralapolice.gov" },
          { name: "Rahul Varma", badgeNumber: "KP-103", rank: "Constable", department: "General Duty", contact: "9876543212", email: "rahul.v@keralapolice.gov" }
        ]);
        console.log("✅ Officers Seeded");
      }

      // 2. Seed a sample Report and Update if none exist
      const reportCount = await Report.countDocuments();
      if (reportCount === 0) {
        console.log("🌱 Seeding Sample Case...");
        const sampleReport = new Report({
          reportId: "FIR-SAMPLE-001",
          category: "Theft",
          type: "Attempted Burglary",
          date: new Date().toISOString().split('T')[0],
          time: "14:30",
          location: "Kochi Marine Drive",
          description: "Sample report: A suspect was seen attempting to break into a locked vehicle near the jetty.",
          status: "Under Investigation",
          userId: "System_Seed",
          assignedOfficer: "Arjun Kumar"
        });
        await sampleReport.save();

        await new CaseUpdate({
          reportId: "FIR-SAMPLE-001",
          updateDescription: "Case registered and initial site visit completed.",
          statusChange: "Filed",
          updatedBy: "System"
        }).save();

        await new CaseUpdate({
          reportId: "FIR-SAMPLE-001",
          updateDescription: "Assigned to Inspector Arjun Kumar for further investigation.",
          statusChange: "Under Investigation",
          updatedBy: "Admin"
        }).save();

        console.log("✅ Sample Case & Updates Seeded");
      }

      // 3. Seed Criminal Records
      const criminalCount = await CriminalRecord.countDocuments();
      if (criminalCount === 0) {
        console.log("🌱 Seeding Criminal Records...");
        await CriminalRecord.insertMany([
          { name: "Suresh 'Snake' Rajan", age: 34, crimeType: "Robbery", status: "Wanted", lastSeen: "Kochi, Ernakulam", description: "Involved in multiple bank heists. Known to be armed and dangerous.", imageUrl: "https://images.unsplash.com/photo-1544211157-55866f86c87e?q=80&w=200&h=200&fit=crop" },
          { name: "Anish Gopi", age: 28, crimeType: "Cyber Fraud", status: "In Custody", lastSeen: "Trivandrum", description: "Phishing specialist targeting senior citizens.", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop" },
          { name: "Unknown Suspect", age: 0, crimeType: "Burglary", status: "Wanted", lastSeen: "Alappuzha", description: "Suspect in recent gold shop robbery. CCTV footage shows a tall male in black hoodie.", imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&h=200&fit=crop" }
        ]);
        console.log("✅ Criminal Records Seeded");
      }

      // 4. Seed Public Alerts
      const alertCount = await Alert.countDocuments();
      if (alertCount === 0) {
        console.log("🌱 Seeding Public Alerts...");
        await Alert.insertMany([
          { text: "High alert in Kochi area due to multiple chain snatching incidents report. Be vigilant.", type: "danger" },
          { text: "Cyber Cell warning: Do not click on suspicious Kerala Water Authority reward links.", type: "warning" },
          { text: "Monsoon Traffic Advisory: Avoid KSRTC bypass roads due to heavy flooding.", type: "info" }
        ]);
        console.log("✅ Public Alerts Seeded");
      }
    };
    seedData();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- 3. DATABASE SCHEMAS ---

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'citizen' }
}));

const criminalRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  crimeType: String,
  status: { type: String, default: 'Wanted' }, // Wanted, In Custody, Released
  lastSeen: String,
  description: String,
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

const CriminalRecord = mongoose.model('CriminalRecord', criminalRecordSchema);

const reportSchema = new mongoose.Schema({
  reportId: { type: String, default: () => `FIR-${Date.now()}` },
  category: String,
  type: String,
  date: String,
  time: String,
  location: String,
  lat: Number,
  lng: Number,
  description: String,
  status: { type: String, default: 'Filed' },
  userId: { type: String, default: 'ANONYMOUS' },
  isAnonymous: { type: Boolean, default: false },
  assignedOfficer: { type: String, default: '' },
  evidence: { type: String, default: '' },
  notes: [{ date: String, text: String }]
}, {
  timestamps: true,
  strict: false
});

const Report = mongoose.model('Report', reportSchema);

const officerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badgeNumber: { type: String, required: true, unique: true },
  rank: { type: String, default: 'Constable' },
  department: { type: String, default: 'General' },
  contact: String,
  email: { type: String, unique: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

const Officer = mongoose.model('Officer', officerSchema);

const caseUpdateSchema = new mongoose.Schema({
  reportId: { type: String, required: true },
  updateDescription: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'Officer' },
  statusChange: { type: String, default: '' }
}, { timestamps: true });

const CaseUpdate = mongoose.model('CaseUpdate', caseUpdateSchema);

const alertSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString() },
  type: { type: String, default: 'warning' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);

const tipSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  details: { type: String, required: true },
  location: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'New' }
}, { timestamps: true });

const Tip = mongoose.model('Tip', tipSchema);

// --- 4. ROUTES ---

// --- AUTHORIZATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

// Health Check
app.get('/', (req, res) => res.send("🚀 Police Server is Live!"));

// AUTH: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role: role || 'citizen' });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// AUTH: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: "Login successful",
      token, // Send token to client
      user: { _id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// REPORT: Submit New FIR
app.post('/api/reports/submit', async (req, res) => {
  console.log("📥 [SERVER] RECEIVED SUBMISSION REQUEST AT /api/reports/submit");
  console.log("📦 [SERVER] DATA BODY:", JSON.stringify(req.body, null, 2));

  try {
    const newReport = new Report(req.body);
    const savedReport = await newReport.save();
    console.log("✅ [SERVER] REPORT SAVED SUCCESSFULLY. ID:", savedReport._id);
    res.status(201).json({ message: "Report saved!", report: savedReport });
  } catch (error) {
    console.error("❌ [SERVER] DATABASE SAVE FAILED:", error.message);
    res.status(500).json({ message: "Database Save Failed", error: error.message });
  }
});

// REPORT: Delete
app.delete('/api/reports/:id', async (req, res) => {
  try {
    const reportList = await Report.find();
    // try to find by \_id or reportId
    const report = await Report.findOne({ $or: [{ _id: req.params.id }, { reportId: req.params.id }] });
    if (!report) return res.status(404).json({ message: "Report not found" });

    await Report.findByIdAndDelete(report._id);
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete report" });
  }
});

// REPORT: Get reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

// CRIMINAL RECORDS: Get all
app.get('/api/criminal-records', async (req, res) => {
  try {
    const records = await CriminalRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch criminal records" });
  }
});

// CRIMINAL RECORDS: Add new (For Official use)
app.post('/api/criminal-records', async (req, res) => {
  try {
    const newRecord = new CriminalRecord(req.body);
    await newRecord.save();
    res.status(201).json({ message: "Criminal record added!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add record" });
  }
});

// CRIMINAL RECORDS: Delete
app.delete('/api/criminal-records/:id', async (req, res) => {
  try {
    await CriminalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Criminal record deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete criminal record" });
  }
});

// OFFICERS: Get all
app.get('/api/officers', async (req, res) => {
  try {
    const officers = await Officer.find();
    res.json(officers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch officers" });
  }
});

// OFFICERS: Add new
app.post('/api/officers', async (req, res) => {
  try {
    const newOfficer = new Officer(req.body);
    await newOfficer.save();
    res.status(201).json({ message: "Officer added successfully!", officer: newOfficer });
  } catch (error) {
    res.status(500).json({ message: "Failed to add officer", error: error.message });
  }
});

// CASE UPDATES: Get for a report
app.get('/api/reports/:reportId/updates', async (req, res) => {
  try {
    const updates = await CaseUpdate.find({ reportId: req.params.reportId }).sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch case updates" });
  }
});

// CASE UPDATES: Get all globally (for dashboard feed)
app.get('/api/case-updates/recent', async (req, res) => {
  try {
    const updates = await CaseUpdate.find().sort({ createdAt: -1 }).limit(20);
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent case updates" });
  }
});

// CASE UPDATES: Add new
app.post('/api/case-updates', async (req, res) => {
  try {
    const { reportId, updateDescription, updatedBy, statusChange } = req.body;
    const newUpdate = new CaseUpdate({ reportId, updateDescription, updatedBy, statusChange });
    await newUpdate.save();

    // Optionally update the report status as well
    if (statusChange) {
      await Report.findOneAndUpdate({ reportId: reportId }, { status: statusChange });
    }

    res.status(201).json({ message: "Case update added!", update: newUpdate });
  } catch (error) {
    res.status(500).json({ message: "Failed to add update", error: error.message });
  }
});

// REPORTS: Update status & assigned officer
app.patch('/api/reports/:reportId', async (req, res) => {
  try {
    const { status, assignedOfficer } = req.body;
    const updated = await Report.findOneAndUpdate(
      { reportId: req.params.reportId },
      { ...(status && { status }), ...(assignedOfficer !== undefined && { assignedOfficer }) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report updated!", report: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error: error.message });
  }
});

// ALERTS: Get active
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

// ALERTS: Add new
app.post('/api/alerts', async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    await newAlert.save();
    res.status(201).json({ message: "Alert broadcasted!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to broadcast alert" });
  }
});

// ALERTS: Delete
app.delete('/api/alerts/:id', async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: "Alert deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete alert" });
  }
});

// TIPS: Add new
app.post('/api/tips', async (req, res) => {
  try {
    const newTip = new Tip(req.body);
    await newTip.save();
    res.status(201).json({ message: "Tip submitted anonymously!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit tip" });
  }
});

// TIPS: Get all
app.get('/api/tips', async (req, res) => {
  try {
    const tips = await Tip.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tips" });
  }
});

// --- 5. START SERVER ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});