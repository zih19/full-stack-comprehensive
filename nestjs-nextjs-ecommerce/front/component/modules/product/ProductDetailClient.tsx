'use client';

import React, { useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import Breadcrumbs from './Breadcrumbs';
import ProductDetail from './ProductDetail';
import SimilarProducts from './SimilarProducts';
import styles from './product-detail-client.module.scss';

export default function ProductDetailClient({
    productId
}: {
  productId: string
}){

    // the custom hook to fetch the specified product details from the productId
    const { getProduct, product, isLoading, error } = useProducts();

    // take advantage of useEffect to fetch the product details
    useEffect(() => {
        if (productId) {
          getProduct(productId);
        }

    }, [productId, getProduct]);

    // It is important to note that the loading logic comes first.
    if (isLoading) {
      // If the result is loading, we will return a message loading the result.
      <div className={styles.loading}>
        <div className={styles.container}>
          <p>Loading product details...</p>
        </div>
       </div>
    }

    
    if (error || !product) {
        // If the product does not exist, we will return a message loading the result
        return  (
          <div className={styles.error}>
            <div className={styles.container}> 
                <h2>Product not found</h2>
                <p>The product you are looking for does not exist.</p>
            </div>      
          </div>
        );
    }

    return (
        <>
            <Breadcrumbs productName={product.name} />
            <ProductDetail product={product} />
            <SimilarProducts category={product.categoryId} currProductId={product.id} />
        </>
    );
};