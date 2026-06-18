'use client';

import React, { useState } from 'react';
import styles from "./product-detail.module.scss";
import Image from "next/image";
import { Product } from "@/types/product.types";
import { useCart } from '@/hooks/useCart';


export default function ProductDetail({ product }: { product: Product }){
    
    const { addProductToCart } = useCart(); // add the product to the cart

    const isInStock = product.stock > 0; // examine if the product is in stock based on the stcok property of the product object

    const [quantity, setQuantity] = useState(1);

    const handleDecrement = () => {
      if (quantity > 1) setQuantity((prevQuantity) => prevQuantity - 1);
    }

    const handleIncrement = () => {
      if (quantity < product.stock) setQuantity((prevQuantity) => prevQuantity + 1);
    }

    const handleAddToCart = () => {
      if (isInStock) {
        // an action that should be defined inside useCart hook
        addProductToCart({
          ...product,
          quantity,
        });

        setQuantity(1);

        alert("Added" + quantity + product.name + "to cart");
      }
    }

    return (
        <section className={styles.section}>
            {/* div container classname */}
            <div className={styles.container}>
              {/* The grid section */}
              <div className={styles.grid}>

                {/* image */}
                <div className={styles.imageWrapper}>
                  <Image 
                    src={product.imageUrl?.trimEnd()} // the image url of the product, which is trimmed at the end to remove any trailing whitespace
                    alt={product.name} // the name of the product
                    width={600} // the width of the image
                    height={600} // the height of the image
                    priority // The image is actually prioritized for loading, which means it will be loaded as soon as possible.
                   />
                </div>

                {/* info */}
                <div className={styles.info}>
                   <span className={styles.category}>{product.category}</span>  {/* the category section */}
                   <h1 className={styles.title}>{product.name}</h1> {/* the name of the product */}
                   <p className={styles.price}>{product.price.toFixed(2)}</p> {/* the price of the product */}
                   <span className={`${styles.stock} ${!isInStock ? styles.outOfStock : ""} `}>
                   {
                      isInStock ? `${product.stock} in stock`: "Out of stock"
                   }
                   </span> {/* the stock of the product */}
                   <hr className={styles.divider} /> {/* add a divider in hr element */}
                   
                   <p className={styles.description}>{product.description}</p> {/* the product description */}
                   <hr className={styles.divider} />

                   {
                        // quantity section
                        isInStock && (
                            <div className={styles.quantitySection}>
                                <label htmlFor="quantity" className={styles.label} > 
                                  Quantity 
                                </label>

                                {/* increase and decrease two buttons */}
                                <div className={styles.quantityControl}>

                                    {/* decrease the product quantity */}
                                    <button 
                                       className={styles.quantityButton} 
                                       onClick={handleDecrement}
                                       disabled={quantity <= 1}
                                       aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>

                                    <span className={styles.quantityValue}> quantity </span> {/* the value of the quantity */}

                                    {/* increase the product quantity */}
                                    <button 
                                       className={styles.quantityButton} 
                                       onClick={handleIncrement}
                                       disabled={quantity >= product.stock}
                                       aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    {/* a button used to add an item to a cart */} 
                    <button 
                       className={styles.addToCartButton}
                       onClick={handleAddToCart}
                       disabled={!isInStock} // disable the button if the product is out of stock
                    >
                        { isInStock ? "Add to cart" : "Out of stock" }
                    </button>

                    {/* sku */}
                    <p className={styles.sku}>SKU: {product.sku}</p>
                </div>
              </div>
            </div> 
        </section>
    );
};