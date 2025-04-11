const express = require('express');
const router = express.Router();

// Serve the temple.ejs page
router.get('/', (req, res) => {
    res.render('temples'); // Ensure 'temple.ejs' exists in the 'views' folder
});

router.get('/', (req, res) => {
    res.render('agrarian'); 
});

router.get('/', (req, res) => {
    res.render('theNorth'); 
});

router.get('/', (req, res) => {
    res.render('fort'); 
});
router.get('/', (req, res) => {
    res.render('dance'); 
});
router.get('/', (req, res) => {
    res.render('festival'); 
});
router.get('/', (req, res) => {
    res.render('audioBooks'); 
});
router.get('/', (req, res) => {
    res.render('paintings'); 
});
router.get('/', (req, res) => {
    res.render('historic-cities'); 
});
router.get('/', (req, res) => {
    res.render('caves'); 
});
router.get('/', (req, res) => {
    res.render('ayurveda'); 
});
router.get('/', (req, res) => {
    res.render('scientist'); 
});


module.exports = router;
