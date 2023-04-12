const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mysql = require('mysql');

const app = express();
var count=0;
// Define the functionalities
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'none'; font-src 'self' http://localhost:3002/confirm");
    next();
});

// Generate a random 4-digit code
function generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
}

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'dummy',
    password: 'abi123abi',
    database: 'medico'
});
app.post('/login',(req,res)=>{
    const email=req.body.email;
    const pwd=req.body.pwd;
    connection.query(
        "SELECT * FROM users WHERE email =? AND pwd =?",[email,pwd],
        (err,result)=>{
            if(err){
                res.send({err:err});
            }
            if(result.length>0){
                console.log(email);
                res.send(result);
            }
            else{
                res.send({message:"error"});
            }
    
        }
        
    )
});
// Handle the insert route and send the verification email
app.post('/insert', (req, res) => {
    const mail = req.body.email;
    const name = req.body.name;
    const pwd = req.body.pwd;
    console.log(name + ' ' + mail + ' ' + pwd);

    const code = generateCode();

    // Insert the code into MySQL table
    const sql = `INSERT INTO val (code) VALUES (${code})`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ message: 'Error inserting code into MySQL table' });
            return;
        }
        console.log('Code inserted into MySQL table');

        // Create a transporter object for sending email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'medi.crusader@gmail.com',
                pass: 'knxdqrdaxgwcdfzl'
            }
        });

        // Create a mailOptions object
        const mailOptions = {
            from: 'medi.crusader@gmail.com',
            to: mail,
            subject: 'Confirm your email',
            text: `Your verification code is ${code}. Please enter this code to complete your registration.`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.send({ message: 'Verification code sent successfully', code: code });
            }
        });
    });
});
app.post('/check-email', (req, res) => {
    const email = req.body.email;
    const sql = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: 'Server Error' });
      } else {
        const count = results[0].count;
        if (count > 0) {
          res.send({ emailExists: true });
        } else {
          res.send({ emailExists: false });
        }
      }
    });
  });
// Handle the verification route and insert data into MySQL table
app.post('/verify', (req, res) => {
    const mail = req.body.email;
    const code = req.body.code;
    const name = req.body.name;
    const pwd = req.body.pwd;

    // Check if the verification code matches
    const sql = `SELECT * FROM val WHERE code = ${code}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ message: 'Error checking verification code' });
            return;
        }

        if (result.length > 0) {
            count=count+1;
            console.log(count);
            if(count>0){
            // Code matches, insert data into MySQL table
            const sql = `INSERT INTO users (name, email, pwd) VALUES ('${name}', '${mail}', '${pwd}')`;
            connection.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({ message: 'Error inserting data into MySQL table' });
                  } else {
                    console.log('Data inserted into MySQL table');
                    res.send({ message: 'Data inserted into MySQL table successfully' });
                  }
                  
    });
  }}});
});
app.post('/location', (req, res) => {
    const  latitude=req.body.lat;
    const longitude=req.body.lon;
    // Process location data
    // ...
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    res.send('Location received');
  });
// Start the server
app.listen(3002, () => {
  console.log('Server is running');
});
