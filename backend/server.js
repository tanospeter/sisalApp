require('dotenv').config()
const express = require('express')

const app = express()

app.use(express.json()) 

app.use("/api/step1", require("./routes/step1Routes"));
app.use("/api/step2", require("./routes/step2Routes"));

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went rely wrong",
  });
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on ${PORT}`))