const express = require("express");
const app = express();

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  return res.json({ message: "nodejs application running inside container" });
});

app.listen(PORT, () => console.log(`server is running at Port:${PORT}`));
