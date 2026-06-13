'use client';

import React from 'react';
import styles from './footer.module.scss';
import Link from 'next/link';

export default function Footer(){
    return (
       <footer className={styles.footer}>
         
         <div className={styles.container}>

            <div className={styles.content}>

                {/* brand */}
                <div className={styles.brand}>
                    <h3>STOREFRONT</h3>
                    <p>
                        Your first destination for quality products. We create the 
                        finest selection to meet your needs.
                    </p>
                </div>

                {/* SHOP section */}
                <div className={styles.section}>
                    <h4>Shop</h4>
                    {/* a list of links */}
                    <ul>
                        {/* All Products */}
                        <li>
                            <Link href="/">All products</Link>
                        </li>

                        {/* Categories */}
                        <li>
                            <Link href="/"> Categories </Link>
                        </li>

                        {/* New Arrivals */}
                        <li>
                            <Link href="/">New Arrivals</Link>
                        </li>

                        {/* Deals */}
                        <li>
                            <Link href="/">Deals</Link>
                        </li>
                    </ul>
                </div>

                {/* SUPPORT section */}
                <div className={styles.section}>
                    <h4>SUPPORT</h4>

                    <ul>
                        {/* Help Center */}
                        <li>
                            <Link href="/">Help Center</Link>
                        </li>

                        {/* Contact Us */}
                        <li>
                            <Link href="/">Contact Us</Link>
                        </li>

                        {/* Shipping Info */}
                        <li>
                           <Link href="/">Shipping Info</Link>
                        </li>

                        {/* Returns */}
                        <li>
                          <Link href="/">Returns</Link>
                        </li>
                    </ul>
                </div>

                {/* COMPANY section */}
                <div>
                    <h4>COMPANY</h4>

                    <ul>
                        {/* About Us */}
                        <li>
                            <Link href="/">About Us</Link>
                        </li>

                        {/* Careers */}
                        <li>
                            <Link href="/">Careers</Link>
                        </li>

                        {/* Privacy Policy */}
                        <li>
                            <Link href="/">Privacy Policy</Link>
                        </li>

                        {/* Terms of Service */}
                        <li>
                            <Link href="/">Terms of Service</Link>
                        </li>
                    </ul>
                </div>
            
            </div>
         
         </div>

       </footer>
    );
};