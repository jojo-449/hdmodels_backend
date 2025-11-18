const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 1. BOOKING ROUTES (MySQL)
// ==========================================
// This imports the logic from your routes/bookings.js file
const bookingsRoute = require("./routes/bookings");
app.use("/api/bookings", bookingsRoute);


// ==========================================
// 2. EMAIL CONFIGURATION (Gmail)
// ==========================================
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, 
            pass: process.env.GMAIL_APP_PASSWORD 
        }
    });
};

// ==========================================
// 3. EMAIL ROUTE (Model Application)
// ==========================================
app.post('/api/model-application', async (req, res) => {
    try {
        const applicationData = req.body;

        // Create email content
        const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #fff, #f8bbd9); padding: 20px; border-radius: 15px;">
        <h1 style="color: #e91e63; text-align: center; margin-bottom: 30px;">🌟 NEW MODEL APPLICATION - HDMODELS AGENCY 🌟</h1>
        
        <div style="background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #e91e63; border-bottom: 2px solid #e91e63; padding-bottom: 10px;">PERSONAL INFORMATION</h2>
          <p><strong>Name:</strong> ${applicationData.name}</p>
          <p><strong>Email:</strong> ${applicationData.email}</p>
          <p><strong>WhatsApp:</strong> +${applicationData.whatsapp}</p>
          <p><strong>Instagram:</strong> ${applicationData.instagram}</p>
          <p><strong>Age:</strong> ${applicationData.age} years</p>
          <p><strong>Location:</strong> ${applicationData.location}</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #e91e63; border-bottom: 2px solid #e91e63; padding-bottom: 10px;">PHYSICAL MEASUREMENTS</h2>
          <p><strong>Height:</strong> ${applicationData.height}cm</p>
          <p><strong>Dress Size:</strong> ${applicationData.dressSize}</p>
          <p><strong>Bust:</strong> ${applicationData.bust}" | <strong>Waist:</strong> ${applicationData.waist}" | <strong>Hips:</strong> ${applicationData.hips}"</p>
          <p><strong>Shoe Size:</strong> ${applicationData.shoeSize}</p>
          <p><strong>Hair Color:</strong> ${applicationData.hairColor}</p>
          <p><strong>Eye Color:</strong> ${applicationData.eyeColor}</p>
        </div>

        <div style="background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #e91e63; border-bottom: 2px solid #e91e63; padding-bottom: 10px;">EXPERIENCE & PORTFOLIO</h2>
          <p><strong>Experience Level:</strong> ${applicationData.experience}</p>
          <p><strong>Portfolio:</strong> ${applicationData.portfolio}</p>
          <p><strong>Previous Work:</strong> ${applicationData.previousWork}</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #e91e63; border-bottom: 2px solid #e91e63; padding-bottom: 10px;">AVAILABILITY & MOTIVATION</h2>
          <p><strong>Availability:</strong> ${applicationData.availability || 'Not specified'}</p>
          <p><strong>Motivation:</strong> ${applicationData.motivation}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 15px; background: rgba(233, 30, 99, 0.1); border-radius: 10px;">
          <p style="color: #e91e63; margin: 0;"><strong>Application submitted on:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.AGENCY_EMAIL || process.env.GMAIL_USER,
            subject: `🌟 New Model Application: ${applicationData.name}`,
            html: emailHTML
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Application sent successfully to agency email'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application. Please try again.'
        });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running (Bookings + Email)', timestamp: new Date().toISOString() });
});

// ==========================================
// 4. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Merged Server running on port ${PORT}`);
});
