import React from 'react';
import Header from '@/component/modules/landing/Header';
import ProductDetailClient from '@/component/modules/product/ProductDetailClient';
import Footer from '@/component/modules/landing/Footer';

// Nextjs ISR caching strategy
export const revalidate = false;

// identify the interface PageProps
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps){

    const { id } = await params;

    return (
        <>
         <Header />
         <ProductDetailClient productId={id} />
         <Footer />
        </>
    );
};

// Nextjs dynamic metadata
export function generateMetadata() {
    return {
        title: `Page - Title here`,
        description: `Page - Description here`,
        icons: {
            icon: `path to asset file`,
        },
    };
}
