const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Middleware to parse the body of POST requests
app.use(bodyParser.urlencoded({ extended: true }));

// Use session to store the number of guesses
app.use(session({
  secret: 'passwordcracker',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true when using HTTPS
}));

// Serve static files from the public directory
app.use(express.static('public'));

// Load the stored password and maximum guesses from a file
const passwordFilePath = path.join(__dirname, 'password.txt');
let storedPassword = '';
let maxGuesses = 3;  // Default in case it's not in the file

// Read the password and max guesses from the file
fs.readFile(passwordFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Could not read password file:', err);
  } else {
    const lines = data.split('\n');
    storedPassword = lines[0].trim();
    maxGuesses = parseInt(lines[1].trim(), 10);
  }
});

// Serve the login page
app.get('/', (req, res) => {
  if (!req.session.guessesLeft) {
    req.session.guessesLeft = maxGuesses; // Initialize guesses if not set
  }

  res.send(`
    <html>
      <head>
        <title>Super Secure Bank</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .login-container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
            width: 400px;
            text-align: center;
          }
          img {
            width: 150px;
            margin-bottom: 20px;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          h3 {
            color: blue;
            text-align: center;
          }
          h4 {
            color: green;
            text-align: center;
          }
          form {
            display: flex;
            flex-direction: column;
            margin-top: 20px;
          }
          label {
            margin: 10px 0 5px 0;
            font-weight: bold;
            text-align: left;
          }
          input[type="email"], input[type="password"] {
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          button {
            background-color: #28a745;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
          button:hover {
            background-color: #218838;
          }
        </style>
      </head>
      <body>
        <div class="login-container">
          <img src="/images/bank-logo.png" alt="Bank Logo">
          <h1>Login</h1>
          <h3>Dan's Online Banking Account!</h3>
          <h4>Crack the password to win a prize!</h4>          
          <form action="/login" method="POST">
            <label for="email">Username:</label>
            <input type="email" id="username" name="username" required oninvalid="this.setCustomValidity('Please enter a valid email address.')" oninput="this.setCustomValidity('')">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Handle the login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Capture the entered username and password
  const enteredData = `Username: ${username}, Password: ${password}\n`;

  // Append the captured data to a text file
  fs.appendFile('user_input_log.txt', enteredData, (err) => {
    if (err) {
      console.error('Error saving user input:', err);
    }
  });

  if (!req.session.guessesLeft) {
    req.session.guessesLeft = maxGuesses; // Initialize guesses if not set
  }

  // Check if the password matches the stored password
  if (password === storedPassword) {
    // Destroy the session and show the success message
    req.session.destroy(err => {
      if (err) {
        console.error("Error destroying session:", err);
      }

      // Display the success message and redirect to the main page after 3 seconds
      res.send(`
        <html>
          <head>
            <title>Super Secure Bank</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .message-container {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              h1 {
                color: #28a745;
              }
            </style>
            <script>
              // Redirect back to the main page after 3 seconds
              setTimeout(() => {
                window.location.href = "/";
              }, 3000);
            </script>
          </head>
          <body>
            <div class="message-container">
              <h1>Congratulations! You were able to crack the password. Reclaim your prize!</h1>
            </div>
          </body>
        </html>
      `);
    });
  } else {
    // Incorrect password logic (unchanged)
    req.session.guessesLeft -= 1;
    if (req.session.guessesLeft > 0) {
      res.send(`
        <html>
          <head>
            <title>Super Secure Bank</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .message-container {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              h1 {
                color: #dc3545;
              }
            </style>
            <script>
              // Redirect back to the login page after 3 seconds
              setTimeout(() => {
                window.location.href = "/";
              }, 3000);
            </script>
          </head>
          <body>
            <div class="message-container">
              <h1>Incorrect password. Try again. You have ${req.session.guessesLeft} guesses left.</h1>
            </div>
          </body>
        </html>
      `);
    } else {
      req.session.destroy(err => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.send(`
          <html>
            <head>
              <title>Super Secure Bank</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                }
                .message-container {
                  background-color: white;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
                  text-align: center;
                }
                h1 {
                  color: #dc3545;
                }
              </style>
              <script>
                // Redirect back to the login page after 3 seconds
                setTimeout(() => {
                  window.location.href = "/";
                }, 3000);
              </script>
            </head>
            <body>
              <div class="message-container">
                <h1>You were not able to crack the password. Better luck next time!</h1>
              </div>
            </body>
          </html>
        `);
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
