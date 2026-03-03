const router = require('express').Router();
const Report = require('../models/Report');

router.post('/file-report', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(500).json({ message: "Error saving report", error: err });
    }
});

module.exports = router;