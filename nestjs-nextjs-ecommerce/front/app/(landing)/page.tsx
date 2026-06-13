import Header from "@/component/modules/landing/Header";
import ProductList from "@/component/modules/landing/ProductList";
import Footer from "@/component/modules/landing/Footer";

export default function Home() {
  return (
    <>
     <Header />
     {/* ensure the content can take at least 60 percent of the port height */}
     <main style={{ minHeight: "60vh" }}>
       <ProductList /> {/* use paginated lists of products */}
     </main>
     <Footer />
    </>
    
  );
}

// <div className={styles.page}>
    //   <main className={styles.main}>
    //     <Image
    //       className={styles.logo}
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={100}
    //       height={20}
    //       priority
    //     />
    //     <div className={styles.intro}>
    //       <h1>To get started, edit the page.tsx file.</h1>
    //       <p>
    //         Looking for a starting point or more instructions? Head over to{" "}
    //         <a
    //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           Templates
    //         </a>{" "}
    //         or the{" "}
    //         <a
    //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           Learning
    //         </a>{" "}
    //         center.
    //       </p>
    //     </div>
    //     <div className={styles.ctas}>
    //       <a
    //         className={styles.primary}
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className={styles.logo}
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={16}
    //           height={16}
    //         />
    //         Deploy Now
    //       </a>
    //       <a
    //         className={styles.secondary}
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Documentation
    //       </a>
    //     </div>
    //   </main>
    // </div>
