'use client';

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { useLogout } from '../../hooks/useLogout';
export default function WithSubnavigation({ user, currentPage }) {
  const { logout } = useLogout();
  const navbarState = {
    '/': true,
    '/about': true,
  };

  const loginButtonState = {
    '/': true,
    '/about': false,
  };

  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      {navbarState[currentPage] && (
        <Box bg={'white'}>
          <Image
            src="/images/coep_new_logo.png"
            alt="COEP TECH ERP PORTAL LOGO"
            margin={'auto'}
          />
        </Box>
      )}

      <Flex
        bg={useColorModeValue('blue.600', 'gray.800')}
        color={useColorModeValue('black', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
          <Text
            as={Button}
            fontFamily={'monospace'}
            fontSize={'x-large'}
            fontWeight={700}
            bg={'blue.300'}
            _hover={{ bg: 'blue.400' }}
            onClick={() => (window.location.href = '/')}
            color={useColorModeValue('white', 'white')}>
            COEP TECH ERP PORTAL
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        {!user && loginButtonState[currentPage] && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            <Button
              as={'a'}
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'lg'}
              fontWeight={600}
              color={'white'}
              bg={'blue.700'}
              href={'/'}
              _hover={{
                bg: 'blue.500',
              }}>
              Login{' '}
            </Button>
          </Stack>
        )}
        {user && (
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'lg'}
                  src={'https://avatar.iran.liara.run/public'}
                  border={'4px solid black'}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem
                  bg={'red.200'}
                  textColor={'black'}
                  onClick={() => {
                    logout();
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav user={user} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Box
      as="a"
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ user }) => {
  const { logout } = useLogout();
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {/* {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))} */}
      {user && (
        <>
          {window.location.pathname !== '/dashboard' && (
            <Box
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              cursor={'pointer'}
              py={2}
              justifyContent="space-between"
              alignItems="center"
              _hover={{
                textDecoration: 'none',
              }}>
              <Text
                fontWeight={600}
                color={useColorModeValue('gray.600', 'gray.200')}>
                Dashboard
              </Text>
            </Box>
          )}
          <Box
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            cursor={'pointer'}
            py={2}
            justifyContent="space-between"
            alignItems="center"
            _hover={{
              textDecoration: 'none',
            }}>
            <Text
              fontWeight={600}
              color={useColorModeValue('gray.600', 'gray.200')}>
              Logout
            </Text>
          </Box>
        </>
      )}
      {!user && (
        <Box
          onClick={() => {
            window.location.href = '/';
          }}
          cursor={'pointer'}
          py={2}
          justifyContent="space-between"
          alignItems="center"
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            Login
          </Text>
        </Box>
      )}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, onClick }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle && onClick}>
      <Box
        py={2}
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

// interface NavItem {
//   label: string
//   subLabel?: string
//   children?: Array<NavItem>
//   href?: string
// }

// const NAV_ITEMS = [
//   {
//     label: 'Inspiration',
//     children: [
//       {
//         label: 'Explore Design Work',
//         subLabel: 'Trending Design to inspire you',
//         href: '#',
//       },
//       {
//         label: 'New & Noteworthy',
//         subLabel: 'Up-and-coming Designers',
//         href: '#',
//       },
//     ],
//   },
//   {
//     label: 'Find Work',
//     children: [
//       {
//         label: 'Job Board',
//         subLabel: 'Find your dream design job',
//         href: '#',
//       },
//       {
//         label: 'Freelance Projects',
//         subLabel: 'An exclusive list for contract work',
//         href: '#',
//       },
//     ],
//   },
//   {
//     label: 'Learn Design',
//     href: '#',
//   },
//   {
//     label: 'Hire Designers',
//     href: '#',
//   },
// ];

const NAV_ITEMS = [];
