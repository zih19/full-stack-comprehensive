'use client';

import styles from './header.module.scss';
import Link from 'next/link';
import { ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';


export default function Header(){
    const { totalItems } = useCart(); // This is a placeholder for examining the total number of items
    const { isAuthenticated, isLoading, user, logout} = useAuth(); // This is a placeholder for verifying if the user is authenticatrd.
    
    const router = useRouter(); // the placeholder for navigating to the dashboard page, login page, etc.

    // This is the event function for clicking the dashboard button
    const handleDashboardClick = () => {
        // navigate to the dashboard page

        if (user && user.role === 'ADMIN') {
            // If the user exists and the role of the user is dashboard, then I will navigate to the dashboard page.
            router.push('/admin');
        } else {
            router.push('/user'); // If the user is not an admin, then I will navigate to the user page.
        }
    };

    // handle the login click
    const handleLoginClick = () => {
        // navigate to the login page
        // redirect the user to /auth/login
        router.push('/auth/login');
    };

    // handle the logout click
    const handleLogoutClick = async () => {
        // switch from logout to the login
        // log the user out when the button is clicked
        // an asynchronous function that clears the token, updates the state, and calls the backend
        await logout(); // -> implement the logout function inside the auth hook
    };
   
    return (
        <header className={styles.header}>
            <div className={styles.container}>

                {/* logo */}
                <Link href='/' className={styles.logo}>
                   STOREFRONT
                </Link>

                {/* icon */}
                <div className={styles.action}>
                    <Link href='/cart' className={styles.cartButton}>
                      <ShoppingCart size={20} />
                      {totalItems > 0 && ( 
                         <span className={styles.badge}>{totalItems}</span> 
                      )}
                    </Link>
                    {
                        isAuthenticated ? (
                            // The user is already authenticated, and we may need to log out
                            <>
                                <LayoutDashboard onClick={handleDashboardClick} />
                                <button 
                                   onClick={handleLogoutClick}
                                   className={styles.logoutButton}
                                   disabled={isLoading}
                                >
                                    { isLoading ? "Logging out ..." : "Logout" }
                                </button>
                            </>
                        ) : (
                            // The user is not authenticated, and we have to login in
                            <button className={styles.loginButton} onClick={handleLoginClick}>
                                  Login
                            </button>
                        )
                    }
                </div>
            </div>
        </header>
    );
};