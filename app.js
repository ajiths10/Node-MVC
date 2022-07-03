const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Checkout = require("./models/checkout");
const CustomCheckout = require("./models/customcheckout");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use((req, res, next)=> {
  res.sendFile(path.join(__dirname,`public/${req.url}`));
})

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Checkout.belongsTo(User);
User.hasMany(Checkout);
Checkout.belongsToMany(Product, { through: CustomCheckout });

sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Pretty", email: "pretty@email.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    //return user.createCart();
    //return user.createCheckout();
  })
  .then((cart) => {
    app.listen(4000);
    console.log(`Port running on ${4000}`);
  })
  .catch((err) => {
    console.log(err);
  });
