require('dotenv').config()
const express = require('express')
const cors = require("cors")

const app = express()

app.use(cors())

app.use(express.json()) 

app.use("/api/getentitymeta", require("./routes/getEntity"));
app.use("/api/getdatinginfo", require("./routes/getDatingInfo"));
app.use("/api/getsisalchrono", require("./routes/getSisalChrono"));

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