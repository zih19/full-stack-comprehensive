"use client";
import React, { useEffect } from 'react';
import styles from './similar-products.module.scss';
import { useProducts } from '@/hooks/useProducts';

import ProductCard  from '@/component/modules/landing/ProductCard';

export default function SimilarProducts({
    category, 
    currProductId
}: {
    category: string, 
    currProductId: string
}) {
  
  // fetch similar products when category changes
  const { products, getProducts } = useProducts();

  useEffect(() => {
    if (category) {
      // fetch all products based on th category itself
      getProducts({ category, limit: 8});
    }
  }, [category, getProducts]);
  const similarProducts = products
                          .filter((currProduct) => currProduct.id !== currProductId && currProduct.category === category)
                          .slice(0, 4);

  
  return (
    <section className={styles.section}>
      
       {/* the container section */}
       <div className={styles.container}>

         {/* the header section */}
         <div className={styles.header}>
            <h2>Similar Products</h2>
            <p>You might also like these products</p>
         </div>

         {/* all similar products involved  */}
         <div className={styles.grid}>
         {
            // Then we have to import similar products using props: category and currProductId
            similarProducts.map((specifiedProduct) => (
              <ProductCard key={specifiedProduct.id} product={specifiedProduct} />
            ))
         }
         </div>

       </div>

    </section>
  );

}