import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

import styles from "./layout.module.scss";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <>
      <header className={styles.header}>
        <span className={styles.welcome}>Welcome, {user?.firstName}</span>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main>{children}</main>
    </>
  );
}
