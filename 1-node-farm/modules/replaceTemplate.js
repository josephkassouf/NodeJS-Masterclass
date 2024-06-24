module.exports = (template, product) => {
  let output = template.replace(/{{productName}}/g, product.productName);
  output = output.replace(/{{productImage}}/g, product.image);
  output = output.replace(/{{productPrice}}/g, product.price);
  output = output.replace(/{{productLocation}}/g, product.from);
  output = output.replace(/{{productNutrients}}/g, product.nutrients);
  output = output.replace(/{{productQuantity}}/g, product.quantity);
  output = output.replace(/{{productDescription}}/g, product.description);
  output = output.replace(/{{productID}}/g, product.id);

  if (!product.organic)
    output = output.replace(/{{NOT_ORGANIC}}/g, "not-organic");
  output = output.replace(/{{productID}}/g, product.id);
  return output;
};
