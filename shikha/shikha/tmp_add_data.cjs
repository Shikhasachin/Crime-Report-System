require('dotenv').config();
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, default: () => `FIR-${Date.now()}` },
  category: String,
  type: String,
  date: String,
  time: String,
  location: String,
  description: String,
  status: { type: String, default: 'Filed' },
  userId: { type: String, default: 'ANONYMOUS' },
  assignedOfficer: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String
}));

const Report = mongoose.model('Report', reportSchema);

async function addData() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  const user = await User.findOne({ email: 'shikhasachin008n@gmail.com' });
  if (!user) {
    console.log("User not found");
    process.exit(1);
  }

  console.log(`Found user: ${user.username} (${user._id})`);

  const reports = [
    {
      reportId: `FIR-${Date.now()}-1`,
      category: "Cyber Crime",
      type: "Phishing Attack",
      date: "2026-03-27",
      time: "10:30",
      location: "Kochi, Kerala",
      description: "Received a suspicious link regarding electricity bill payment. Account was debited by 5000 INR.",
      status: "Under Investigation",
      userId: user._id.toString(),
      assignedOfficer: "Arjun Kumar"
    },
    {
      reportId: `FIR-${Date.now()}-2`,
      category: "Theft",
      type: "Bag Snatching",
      date: "2026-03-26",
      time: "18:45",
      location: "Marine Drive, Kochi",
      description: "A suspect on a black bike snatched a gold chain while walking near the jetty.",
      status: "Filed",
      userId: user._id.toString()
    }
  ];

  await Report.insertMany(reports);
  console.log("Successfully added 2 reports for user!");
  process.exit(0);
}

addData();
