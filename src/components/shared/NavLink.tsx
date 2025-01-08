import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link, useColorModeValue } from '@chakra-ui/react';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  exact?: boolean;
}

export const NavLink = ({ to, children, exact = true }: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  const color = useColorModeValue('gray.700', 'gray.200');
  const activeColor = useColorModeValue('primary.600', 'primary.300');
  const hoverColor = useColorModeValue('primary.500', 'primary.400');

  return (
    <Link
      as={RouterLink}
      to={to}
      px={3}
      py={2}
      rounded="md"
      color={isActive ? activeColor : color}
      fontWeight={isActive ? 'semibold' : 'medium'}
      _hover={{
        textDecoration: 'none',
        color: hoverColor,
      }}
      transition="all 0.2s"
    >
      {children}
    </Link>
  );
};
