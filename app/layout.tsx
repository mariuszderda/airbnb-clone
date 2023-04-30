import './globals.css';
import { Nunito } from 'next/font/google';
import Navbar from '@/app/components/navbar/Navbar';
import RegisterModal from '@/app/components/modals/RegisterModal';
import ClientOnly from '@/app/components/ClientOnly';
import ToasterProvider from '@/app/providers/ToasterProvider';
import LoginModal from '@/app/components/modals/LoginModal';
import getCurrentUser from '@/app/actions/getCurrentUser';
import RentModal from '@/app/components/modals/RentModal';
import SearchModal from '@/app/components/modals/SearchModal';

const nunito = Nunito({ subsets: ['latin'] });

export const metadata = {
  title: 'Airbnb',
  description: 'Find your flat',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={nunito.className}>
        {/* if you have a problem with render a component, surround this with ClientOnly component  */}
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <RentModal />
          <SearchModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
      </body>
    </html>
  );
}
