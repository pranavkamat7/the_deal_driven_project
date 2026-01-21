require("dotenv").config();
console.log("Checking MONGO_URI:", process.env.MONGO_URI ? "Found" : "NOT FOUND");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");


const port = process.env.PORT || 8080;
const ExpressError = require("./ExpressError");
const Admin = require("./models/admin");
const Product = require("./models/product");

// --------------------
// APP CONFIG
// --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// --------------------
// DATABASE CONNECTION
// --------------------
async function main() {

  await mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.error(err));

}

main().catch(err => console.log(err));




// --------------------
// ROUTES
// --------------------
app.get("/", async(req, res) => {
  // res.send("Working");
  let products = await Product.find({})
  res.render("Home",{products})
});

// --------------------
// ADMIN AUTH
// --------------------

// Admin Login Page
app.get("/admin", (req, res) => {
  res.render("admin/adminLogin.ejs");
});

// Admin Login Logic



app.post("/admin/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return next(new ExpressError(401, "Invalid Username or Password"));
    }

    res.redirect("/admin/dashboard");
  } catch (err) {
    next(err);
  }
});

// --------------------
// ADMIN DASHBOARD
// --------------------
app.get("/admin/dashboard", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render("admin/adminDashboard.ejs", { products });
  } catch (err) {
    next(err);
  }
});

// --------------------
// ADD PRODUCT
// --------------------
app.get("/admin/products/new", (req, res) => {
  res.render("admin/addProduct.ejs");
});

app.post("/admin/products", async (req, res, next) => {
  try {
    const { name, description, link, price, image, category } = req.body;

    await Product.create({
      name,
      description,
      link,
      price,
      image,
      category
    });

    res.redirect("/admin/dashboard");
  } catch (err) {
    next(err);
  }
});

// --------------------
// DELETE PRODUCT
// --------------------
app.post("/admin/products/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/admin/dashboard");
  } catch (err) {
    next(err);
  }
});

app.get("/search", async (req, res) => {
    try {
        const { query } = req.query; 
        if (!query) return res.redirect("/"); 

        
        const products = await Product.find({
            name: { $regex: query, $options: "i" } 
        });

      
        res.render("home", { products }); 
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/about", async (req, res) => {
  res.render('about')
})

app.get("/contact", async (req, res) => {
  res.render('contact')
})

app.get("/faq", async (req, res) => {
  res.render('faq')
})

app.get("/shipping", async (req, res) => {
  res.render('shipping')
})

app.get("/returns", async (req, res) =>{
  res.render('returns')
})

app.get("/privacy", async (req, res) =>{
  res.render('privacy')
})

// --------------------
// ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

// --------------------
// SERVER
// --------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
