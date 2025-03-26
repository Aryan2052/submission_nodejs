//handles the api logic

const School = require("../models/schoolModel");
const db = require("../../config/db");

// Function to add a school
exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    db.query(query, [name, address, latitude, longitude], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Function to list schools sorted by proximity
exports.listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    db.query("SELECT * FROM schools", (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      // Calculate distance using Haversine formula
      results.forEach((school) => {
        school.distance = getDistanceFromLatLonInKm(latitude, longitude, school.latitude, school.longitude);
      });

      // Sort by distance
      results.sort((a, b) => a.distance - b.distance);

      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Function to update school details
exports.updateSchool = async (req, res) => {
    const { id } = req.params;
    const { name, address, latitude, longitude } = req.body;
  
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const query = "UPDATE schools SET name = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?";
      db.query(query, [name, address, latitude, longitude, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "School not found" });
        }
  
        res.status(200).json({ message: "School updated successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
  

// Haversine formula to calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
