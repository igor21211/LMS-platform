import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.svg';

const Logo = () => {
  return (
    <Link href="/">
      <Image src={logo} alt="logo" width={130} height={130} />
    </Link>
  );
};

export default Logo;
