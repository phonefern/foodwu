const express = require("express");
const QRCode = require("qrcode");

const app = express();
const PORT = 3000;

// Route สำหรับสร้าง QR Code
app.get("/generate-qr", async (req, res) => {
  const userId = "12345"; // ตัวอย่าง userId
  const url = `http://localhost:5173/${userId}`;

  try {
    // สร้าง QR Code และส่งกลับเป็น Data URI
    const qrCodeData = await QRCode.toDataURL(url);
    res.send(`
      <h1>QR Code</h1>
      <img src="${qrCodeData}" alt="QR Code">
    `);
  } catch (error) {
    res.status(500).send("Error generating QR Code");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
