import React from "react";
import ProductInfo from "../../components/ProductInfo";
import ProductService from "../../services/ProductService";
import ProductHelper from "../../tools/ProductHelper";
import Product from "../../types/Product";
import Sku from "../../types/Sku";

interface ProductState {
  product: Product;
  helper: ProductHelper;
  colors: string[];
  selectedColor: string;
  sizes: string[];
  selectedSize: string;
  quantity: number;
  sku: Sku;
}

/**
 * Product Detail Container
 * @extends {Component<Props, State>}
 */
class ProductDetail extends React.Component<{}, ProductState> {
  state = {
    product: {} as Product,
    helper: {} as ProductHelper,
    colors: [] as string[],
    selectedColor: "",
    sizes: [] as string[],
    selectedSize: "",
    quantity: 1,
    sku: {} as Sku,
  };

  /**
   * Renders the container.
   * @return {any} - HTML markup for the container
   */
  render() {
    return (
      <ProductInfo
        product={this.state.product}
        colors={this.state.colors}
        selectedColor={this.state.selectedColor}
        changedColor={this.changedColor}
        sizes={this.state.sizes}
        selectedSize={this.state.selectedSize}
        changedSize={this.changedSize}
        addToCart={this.addToCart}
      />
    );
  }

  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = Number(urlParams.get("productId"));

    ProductService.get(productId)
      .then((response) => {
        const product = response.data;
        console.log(product);
        const helper = new ProductHelper(product);
        const colors = helper.getColors();
        let sizes = [] as string[];
        let selectedColor = "";
        let selectedSize = "";

        if (colors.length >= 1) {
          sizes = helper.getSizes(colors[0]);
          selectedColor = colors[0];

          if (sizes.length >= 1) {
            selectedSize = sizes[0];
          }
        }

        console.log("Sizes: " + sizes);

        const sku = helper.getSku(selectedColor, selectedSize);

        this.setState({
          product,
          helper,
          colors,
          sizes,
          selectedColor,
          selectedSize,
          sku,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  changedColor = (event: any) => {
    let target = event.currentTarget as HTMLSelectElement;
    let value = target.value;
    const helper = this.state.helper;
    let selectedSize = "";
    console.log("selectedColor: " + value);

    const sizes = helper.getSizes(value);
    if (sizes.length >= 1) {
      selectedSize = sizes[0];
    }

    const sku = helper.getSku(value, selectedSize);

    this.setState({
      selectedColor: value,
      sizes,
      selectedSize,
      sku,
    });
  };

  changedSize = (event: any) => {
    let target = event.currentTarget as HTMLSelectElement;
    let value = target.value;

    console.log("selectedSize: " + value);

    const helper = this.state.helper;
    const sku = helper.getSku(this.state.selectedColor, value);

    this.setState({
      selectedSize: value,
      sku,
    });
  };

  addToCart = (event: any) => {
    console.log(this.state.sku);
  };
}

export default ProductDetail;
