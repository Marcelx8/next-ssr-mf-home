import NextLink from "next/link"
import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

export type NavItem = {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href: string;
}

export type NavProps = {
  navItems: NavItem[];
};

export default function WithSubnavigation({ navItems }: {navItems: NavItem[] | undefined}) {
  const { isOpen, onToggle } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'white');
  const headingTextColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.900');
  const headingTextBreakpoint = useBreakpointValue({ base: 'center', md: 'left' });

  if(!navItems) {
    return (
      <div>No Nav items</div>
    )
  }

  return (
    <Box>
      <Flex
        bg={bgColor}
        color={textColor}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={borderColor}
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
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            variant={headingTextBreakpoint}
            fontFamily={'heading'}
            fontWeight={'bold'}
            color={headingTextColor}>
            App
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav navItems={navItems} />
          </Flex>
        </Flex>

        {/* <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <Button
            as={'a'}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            href={'#'}>
            Sign In
          </Button>
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            href={'#'}
            _hover={{
              bg: 'pink.300',
            }}>
            Sign Up
          </Button>
        </Stack> */}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={navItems} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navItems }: NavProps) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  return (
    <Stack direction={'row'} spacing={4}>
      {navItems.map((item) => (
        <Box key={item.label}>
          <NextLink href={item.href} passHref>
            <Link
              p={2}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}>
              {item.label}
            </Link>
          </NextLink>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  const linkHoverBg = useColorModeValue('pink.50', 'gray.900')
  return (
    <NextLink href={href} passHref>
      <Link
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: linkHoverBg }}>
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
      </Link>
    </NextLink>
  );
};

const MobileNav = ({ navItems }: NavProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  return (
    <Stack
      bg={bgColor}
      p={4}
      display={{ md: 'none' }}>
      {navItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={textColor}>
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
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={borderColor}
          align={'start'}>
          {children &&
            children.map((child) => (
              <NextLink key={child.label} href={child.href} passHref>
                <Link py={2}>
                  {child.label}
                </Link>
              </NextLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
