
const path = require("path");
require('dotenv').config(); 

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;
const favicon = require("serve-favicon");

app.use(favicon(path.join(__dirname, "public", "favicon.png")));

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

console.log("MONGO_URI VALUE:", process.env.MONGO_URI);

async function main() {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  });
  console.log("MongoDB Atlas Connected");
}
main().catch(console.error);


// --------------------
// ROUTES
// --------------------
app.get("/", async (req, res) => {
  const { category } = req.query;

  let filter = {};
  if (category) {
    filter.category = category;
  }

  const products = await Product.find(filter);

  res.render("home.ejs", {
    products,
    selectedCategory: category || "all"
  });
});


//product details route
app.get("/products/:id", async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new ExpressError(404, "Product not found"));
  }

  res.render("showProduct.ejs", { product });
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

//update product
app.get("/admin/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/editProduct", { product });
});

app.post("/admin/products/:id/edit", async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndUpdate(id, {
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category
  });

  res.redirect("/admin/dashboard");
});


app.get("/search", async (req, res) => {
    try {
        const { query } = req.query; 
        if (!query) return res.redirect("/"); 

        
        const products = await Product.find({
            name: { $regex: query, $options: "i" } 
        });

      
        res.render("home.ejs", { products }); 
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.get("/about", async (req, res) => {
  res.render('about.ejs')
})

app.get("/contact", async (req, res) => {
  res.render('contact.ejs')
})

app.get("/faq", async (req, res) => {
  res.render('faq.ejs')
})

app.get("/shipping", async (req, res) => {
  res.render('shipping.ejs')
})

app.get("/returns", async (req, res) =>{
  res.render('returns.ejs')
})

app.get("/privacy", async (req, res) =>{
  res.render('privacy.ejs')
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
