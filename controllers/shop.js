const Product = require("../models/product");
const Cart = require("../models/cart");
const Checkout = require("../models/checkout");

const ITEMS_PER_Page = 2;

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.send({ products });
      // res.render("shop/product-list", {
      //   prods: products,
      //   pageTitle: "All Products",
      //   path: "/products",
      // });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const value = req?.query?.page ? req.query.page : 1;
  const page = Number(value);
  console.log("====>", page);
  Product.findAndCountAll({
    offset: (page - 1) * ITEMS_PER_Page,
    limit: ITEMS_PER_Page,
  })
    .then((products) => {
      res.json({
        products: products,
        currentPage: page,
        nextPage: products.count / 2 > page ? page + 1 : 1,
        previousPage: page - 1,
      });
      // res.render("shop/index", {
      //   prods: products,
      //   pageTitle: "Shop",
      //   path: "/",
      // });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      console.log(cart);
      return cart
        .getProducts()
        .then((products) => {
          res.send(products);
          // res.render("shop/cart", {
          //   path: "/cart",
          //   pageTitle: "Your Cart",
          //   products: products,
          // });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  if (!req.body && !req.body.productId) {
    return res
      .status(400)
      .send({ status: error, message: "productId is missing in payload" });
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        console.log("====>", product);
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.json({ message: "Success" });
      //res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postCheckout = (req, res, next) => {
 req.user.getCart()
 .then(cart => {
  return cart.getProducts();
 })
 .then(products => {
  return req.user.createCheckout()
  .then(order => {
    order.addProducts(products.map(ele => {
      ele.customcheckout = {quantity: ele.cartItem.quantity };
      return ele;
    }));
  })
 .catch((err) => console.log(err));
 })
 .then((response)=> res.json(response))
 .catch((err) => console.log(err));
};
