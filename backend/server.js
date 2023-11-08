require('dotenv').config()
const express = require('express')
const cors = require("cors")

const app = express()
const prefix = process.env.API_ROUTE_PREFIX  || ""

app.use(cors())

app.use(express.json()) 

app.use(prefix+"/api/getentitymeta", require("./routes/getEntity"));
app.use(prefix+"/api/getdatinginfo", require("./routes/getDatingInfo"));
app.use(prefix+"/api/getsisalchrono", require("./routes/getSisalChrono"));
app.use(prefix+"/api/getAdvancedRes", require("./routes/getAdvancedRes"));

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong.",
  });
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on ${PORT}`))