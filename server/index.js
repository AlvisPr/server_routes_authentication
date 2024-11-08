import express from 'express';
import admin from './admin.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static('../public'));
app.use(express.json());

app.get('/open', (req, res) => {
    res.send("<h1>Welcome to Open Route</h1><p>Anyone can access this route</p>");
});

app.get('/auth', (req, res) => {
    const idToken = req.headers.authorization;
    if (!idToken) {
        return res.status(401).send("Authorization header missing");
    }

    console.log("idToken", idToken);

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            console.log("decodedToken", decodedToken);
            res.render("dashboard");
        })
        .catch((error) => {
            console.error("Error verifying token:", error);
            res.status(500).send("Authentication Fail!");
        });
});

// Route to handle retrieving data from Realtime Database
app.get('/realtime-data', async (req, res) => {
    try {
        const db = admin.database();
        const ref = db.ref('users');
        ref.once('value', (snapshot) => {
            const data = snapshot.val();
            res.json(data);
        });
    } catch (error) {
        console.error("Error accessing Realtime Database:", error);
        res.status(500).send("Error accessing Realtime Database");
    }
});

// Route to handle adding data to Realtime Database
app.post('/add-realtime-data', async (req, res) => {
    const { key, value } = req.body;
    console.log("Received data to add:", req.body);
    if (!key || !value) {
        console.log("Key and value are required");
        return res.status(400).send("Key and value are required");
    }

    try {
        console.log(`Received data to add: key=${key}, value=${JSON.stringify(value)}`);
        const db = admin.database();
        const ref = db.ref('users');
        await ref.child(key).set(value);
        console.log(`Data added successfully: key=${key}, value=${JSON.stringify(value)}`);
        res.status(200).send("Data added successfully");
    } catch (error) {
        console.error("Error adding data to Realtime Database:", error);
        res.status(500).send("Error adding data to Realtime Database");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});