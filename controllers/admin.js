const Product = require("../models/product");

// Products data store

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
  //....
};
exports.getEditProduct = (req, res, next) => {
  const { productId } = req.params;
  const { user } = req;
  user
    .getProducts({ where: { userId: productId } })
    .then((products) => {
      if (products.length > 0) {
        const product = products[0];
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
          product: product,
        });
      } else {
        res.redirect("/admin/products");
      }
    })
    .catch((error) => console.log(error));

  //....
};
exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      console.log("updated product :", result);
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/products");
    });

  //....
};
exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  if (productId) {
    Product.findByPk(productId)
      .then((product) => {
        return product.destroy();
      })
      .then((result) => {
        console.log("Product destroyed :", result);
        res.redirect("/admin/products");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/admin/products");
      });
    //Product.delete(productId);
  }

  //....
};
exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((error) => console.log(error));

  //....
};

exports.postAddProduct = (req, res, next) => {
  const { title, description, price, imageUrl } = req.body;
  const { user } = req;
  user
    .createProduct({ title, description, price, imageUrl })
    .then((result) => {
      console.log("Created Product :", result);
      res.redirect("/");
    })
    .catch((error) => console.log(error));
};
