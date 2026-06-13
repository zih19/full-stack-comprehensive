'use client';

import React from 'react';
import Link from 'next/link';
import styles from './product-card.module.scss';
import { Product } from '@/types/product.types';
import Image from 'next/image';

export default function ProductCard({ product }: { product: Product}){
    
    const currId = product.id; // extract my current id

    const isInStock = product.stock > 0; // check if the product is in stock

    return <Link href={`/${currId}`} className={styles.card}>
        {/* The first section handles the image of the product */}
        <div className={styles.imageWrapper}>
          <Image 
            src={product.imageUrl?.trimEnd() ?? 'https://via.placeholder.com/300'} // if the imageUrl is null, then I will use the placeholder image
            alt={product.name}
            width={400}
            height={400}
            loading='lazy' // load the image when the user sees the image for better performance, enabling the image to work faster
         />
        </div>

        {/* The second section handles the content of the product */}
        <div className={styles.content}>
           <span className={styles.category}>{product.category}</span>{/* the name of the product category */}
           <h3 className={styles.name}>{product.name}</h3> {/* the name of the product */}
           <p className={styles.description}>{product.description}</p> {/* the description of the product */}
           <div className={styles.footer}>
             {/* the footer section displaying the product's price and stock info */}
             <span className={styles.price}>${product.price.toFixed(2)}</span> {/* the product's price */}
             <span className=
                {`${styles.stock} ${!isInStock ? styles.outOfStock : ""}`}
             > 
                 {isInStock ? product.stock + "In Stock" : "Out of Stock"} 
             </span> {/* the product's stock */}
           </div>
        </div>
    </Link>; // my current link
};