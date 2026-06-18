'use client';

import React from 'react';
import Link from 'next/link';
import styles from './breadcrumbs.module.scss';

export default function Breadcumbs({ productName } : { productName: string }) {
    return (
        <div className={styles.breadcrumbs}>

           {/* start with the implementation */}
           <div className={styles.container}>
              
                {/* the navigation bar signal = authentication section */}
                <nav className={styles.nav} aria-label="Breadcumb">
                    {/* Two links */}

                    {/* the first link to go back to the store */}
                    <Link className={styles.link} href='/'>
                        Store
                    </Link>

                    {/* the separator decorator  */} 
                    <span className={styles.separator}>/</span>

                    {/* the name of the product */}
                    <span className={styles.current}>{productName}</span>
                </nav>


           </div>
            
        </div>
    );
};