const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 5000;

// MongoDB URI และการตั้งค่า
require('dotenv').config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware สำหรับ CORS และ JSON
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// **Route: GET /api/menus**
// ดึงข้อมูลเมนูทั้งหมดจาก MongoDB
app.get('/api/menus', async (req, res) => {
  try {
    const db = client.db('phonedev');
    const menusCollection = db.collection('menus'); 
    const menus = await menusCollection.find().toArray();
    res.status(200).json(menus);
  } catch (err) {
    console.error("Error fetching menus:", err);
    res.status(500).send("Internal Server Error");
  }
});

// **Route: POST /api/menus**
// เพิ่มเมนูใหม่
app.post('/api/menus', async (req, res) => {
  try {
    const db = client.db('phonedev');
    const ordersCollection = db.collection('menus'); 

    const newOrder = req.body; 
    const result = await ordersCollection.insertOne(newOrder);

    res.status(201).json({ message: "Order created successfully", orderId: result.insertedId });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Internal Server Error");
  }
});

// **Route: POST /api/orders**
// สร้างคำสั่งซื้อใหม่
app.post('/api/orders', async (req, res) => {
  try {
    const db = client.db('phonedev');
    const ordersCollection = db.collection('orders'); 

    const newOrder = req.body; 
    const result = await ordersCollection.insertOne(newOrder);

    res.status(201).json({ message: "Order created successfully", orderId: result.insertedId });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Internal Server Error");
  }
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
});

