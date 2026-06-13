'use client';

import React, { useState, useCallback, useEffect } from 'react';
import styles from './product-list.module.scss';
import { useProducts } from '@/hooks/useProducts'; // the custom hook for fetching products
import ProductCard from './ProductCard'; // the component for displaying each product

export default function ProductList(){
    const [search, setSearch] = useState(""); // the state for the search input, default is an empty string
    
    const [page, setPage] = useState(1); // the state for the current page, which is 1 by default
    
    const [debouncedSearch, setDebouncedSearch] = useState(""); // the state for the debounced search input, 
                                                                // which is empty by default.
    
    const { isLoading, products, getProducts, error, meta } = useProducts(); // the loading state from the custom hook for fetching products
    
    const limit = 12;

    // A useEffect function is utilized to fetch products whenever the search input or page changes.
    useEffect(() => {
        getProducts({ page, limit, search: debouncedSearch})
    }, [getProducts, page, limit, debouncedSearch]);


    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
    
      const value = e.target.value; // the value of the search input
      setSearch(value); // update the search state with the new value

      // reset the page to 1 when the search input changes
      setPage(1);


      setTimeout(() => {
        setDebouncedSearch(value); // update the debounce search state with the new value after 5 seconds
      }, 5000);


    }, []);

    // the function for going back to the previous page
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1); // update the page state to the previous page
        }
    }

    // the function for proceeding to the next page
    const handleNextPage = () => {
        if (meta && page < meta.totalPages) {
            setPage(prevPage => prevPage + 1); // update the page state to the next page
        }
     }

    return (
        // use the <section> tag for better structure and adaptability
        <section className={styles.section}>
             
            <div className={styles.container}>

               {/* add a wrapper with div element */}
               <div className={styles.header}>
                  <h2>Our Products</h2>
                  <p>Discover our created collections of premium products</p>
               </div>

               {/* search bar */}
               <div className={styles.searchBar}>
                  {/* An input is treated as a search bar retrieving the item efficiently. */}
                  <input 
                    type="text" 
                    placeholder="Search Products..."
                    value={search} // the value is default at first
                    onChange={handleSearchChange} // the event function for changing the search input
                  />
               </div>

               {/* Next, we are going to load all products */}
               {/* Everything is based on isLoading from useProduct API call */}
               {
                  isLoading ? (
                    // display our loading text
                    <div className={styles.loading}>Loading Products...</div>
                  ) : products.length === 0 ? (
                    <div className={styles.empty}>
                    {
                         // debouncedSearch is a delayed version of the search input value
                         // The products are updated in a short delay instead of being updated immediately
                         // Only one product is fetched after the user stops trying for 5 seconds, which is more efficient than fetching products immediately after every stroke
                         // prevents unnecessary work while the user is typing
                         debouncedSearch ? `No Products found for "${debouncedSearch}"` : "No Products Available"
                    }
                    </div>
                  ) : (
                    <>
                        <div className={styles.grid}>
                        {
                        // map each product to a ProductCard component, and the key is the product id
                        products.map((specifiedProduct) => (
                            <ProductCard key={specifiedProduct.id} product={specifiedProduct} /> // It takes the product as an argument
                        ))
                        }
                        </div>

                        {/* Pagination */}
                        {
                            meta.totalPages > 1 && (
                                <div className={styles.pagination}>
                                    {/* the previous button */}
                                    {/* onClick: back to the previous page, disabled: page === 1 */}
                                    {/* purpose: prevent the user from being back to the negative page */}
                                    <button 
                                       onClick={handlePrevPage} 
                                       disabled={page === 1}
                                    >
                                      Previous
                                    </button>

                                    {/* the page info */}
                                    <span className={styles.pageInfo}>
                                      Page {page} of {meta.totalPages}
                                    </span>
                                    
                                    {/* the next button */}
                                    <button 
                                      onClick={handleNextPage} 
                                      disabled={page >= meta.totalPages}
                                    >
                                      Next
                                    </button>
                                </div>
                            )
                        }
                    </>
                  )
               }
            </div>
        </section>
    );
};