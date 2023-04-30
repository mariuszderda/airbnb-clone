'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import logo from '@/public/images/logo_airbnb.svg';

const Logo = () => {
  return (
    <Link href={'/'}>
      <Image
        className="hidden md:block cursor-pointer h-auto"
        alt="logo"
        src={logo}
        width="100"
        height="100"
      />
    </Link>
  );
};

export default Logo;
