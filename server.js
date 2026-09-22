const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function loadKeys() {
  return JSON.parse(fs.readFileSync("keys.json", "utf8"));
}

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "key-server"
  });
});

app.get("/validate", (req, res) => {
  const key = req.query.key;

  if (!key) {
    return res.status(400).json({
      valid: false,
      error: "missing_key"
    });
  }

  const data = loadKeys();
  const found = data.keys.find(k => k.key === key);

  if (!found) {
    return res.status(401).json({
      valid: false,
      error: "invalid_key"
    });
  }

  res.json({
    valid: true,
    plan: found.plan,
    duration_hours: found.duration_hours ?? null,
    duration_days: found.duration_days ?? null
  });
});

app.listen(PORT, () => {
  console.log(`Key server running on port ${PORT}`);
});
