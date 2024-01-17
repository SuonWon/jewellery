import { Button, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { FaArrowRightFromBracket, FaBoxesPacking, FaCartShopping, FaChartPie, FaChevronDown, FaDatabase, FaBoxOpen, FaListUl, FaMoneyBill1, FaSliders, FaUsers, FaWallet, FaArrowRotateLeft, FaPlusMinus, FaUser, FaLayerGroup } from "react-icons/fa6";
import { GiDiamondTrophy } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthUser, useSignOut } from "react-auth-kit";


function Nav() {

    const auth = useAuthUser();

    const logOut = useSignOut();

    const navigate = useNavigate();

    const handleLogout = () => {

        logOut();
        navigate('/login');

    }

    return(
        <div className='flex flex-col sticky top-0 z-[9999]'>
            <nav className="grid grid-cols-6 gap-2 items-center text-neutral-50 py-2 px-4 bg-main">
                <div className="">
                    <Typography as="a" href='/' variant='h5' className='text-white font-bold'>Jewellery Sales</Typography>
                </div>
                <div className="flex flex-row col-span-4 justify-center text-sm items-center font-medium space-x-2">
                    <NavLink to='/dashboard'>
                        <Typography variant='small' className="flex justify-center items-center text-white p-2 space-x-2 hover:bg-white hover:text-black rounded-lg ">
                            <FaChartPie className='text-base' /> <span className=''>Dashboard</span>
                        </Typography>
                    </NavLink>
                    <Menu>
                        <MenuHandler>
                            <Typography variant='small' className="flex justify-center items-center p-2 text-white space-x-2 hover:bg-white hover:text-black rounded-lg cursor-pointer">
                                <FaSliders className='text-base' /> 
                                <span className=''>Setup</span>
                                <FaChevronDown className='text-xs' />
                            </Typography>
                        </MenuHandler>
                        <MenuList className="z-[99999] bg-main text-white">
                            <NavLink className="nav-link" to='/master'>
                                <MenuItem className="flex items-center gap-2">
                                    <FaDatabase /><span>Master Data</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to='/stone_details'>
                                <MenuItem className="flex items-center gap-2">
                                    <GiDiamondTrophy /><span>Stone Selection</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to='/supplier'>
                                <MenuItem className="flex items-center gap-2">
                                    <FaUsers /><span>Suppliers</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to='/customer'>
                                <MenuItem className="flex items-center gap-2">
                                    <FaUsers /><span>Customers</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to='/share'>
                                <MenuItem className="flex items-center gap-2">
                                    <FaUsers /><span>Shares</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to='/wallet_list'>
                                <MenuItem className="flex items-center gap-2">
                                    <FaWallet /> <span>Wallet</span>
                                </MenuItem>
                            </NavLink>
                        </MenuList>
                    </Menu>  
                    <Menu>
                        <MenuHandler>
                            <Typography variant='small' className="flex justify-center items-center p-2 text-white space-x-2 hover:bg-white hover:text-black rounded-lg cursor-pointer">
                                <FaCartShopping className='text-base' /> 
                                    <span>Purchase</span>
                                <FaChevronDown className='text-xs' />
                            </Typography>
                        </MenuHandler>
                        <MenuList className="z-[99999] bg-main text-white">
                            <NavLink className="nav-link" to="/purchase_list">
                                <MenuItem className="flex items-center gap-2">
                                    <FaCartShopping /> <span>Purchase List</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to="/stone_details">
                                <MenuItem className="flex items-center gap-2">
                                    <GiDiamondTrophy /> <span>Stone Selection</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to="/purchase_return">
                                <MenuItem className="flex items-center gap-2">
                                    <FaArrowRotateLeft /> <span>Purchase Return List</span>
                                </MenuItem>
                            </NavLink>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuHandler>
                            <Typography variant='small' className="flex justify-center items-center p-2 text-white space-x-2 hover:bg-white hover:text-black rounded-lg cursor-pointer">
                                <FaBoxOpen className='text-base' /> 
                                    <span className=''>Issues</span>
                                <FaChevronDown className='text-xs' />
                            </Typography>
                        </MenuHandler>
                        <MenuList className="z-[99999] bg-main text-white">
                            <NavLink className="nav-link" to="/issue_list">
                                <MenuItem className="flex items-center gap-2">
                                    <FaBoxOpen /> <span>Issue List</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to="/issue_return">
                                <MenuItem className="flex items-center gap-2">
                                    <FaArrowRotateLeft /> <span>Issue Return List</span>
                                </MenuItem>
                            </NavLink>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuHandler>
                            <Typography variant='small' className="flex justify-center items-center p-2 text-white space-x-2 hover:bg-white hover:text-black rounded-lg cursor-pointer">
                                <FaMoneyBill1 className='text-base' /> 
                                    <span className=''>Sales</span>
                                <FaChevronDown className='text-xs' />
                            </Typography>
                        </MenuHandler>
                        <MenuList className="z-[99999] bg-main text-white">
                            <NavLink className="nav-link" to="/sales_list">
                                <MenuItem className="flex items-center gap-2">
                                    <FaMoneyBill1 /> <span>Sales List</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to="/sales_return">
                                <MenuItem className="flex items-center gap-2">
                                    <FaArrowRotateLeft /> <span>Sales Return List</span>
                                </MenuItem>
                            </NavLink>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuHandler>
                            <Typography variant='small' className="flex justify-center items-center p-2 text-white space-x-2 hover:bg-white hover:text-black rounded-lg cursor-pointer">
                                <FaBoxesPacking className='text-base' /> 
                                    <span>Stock</span>
                                <FaChevronDown className='text-xs' />
                            </Typography>
                        </MenuHandler>
                        <MenuList className="z-[99999] bg-main text-white">
                            <NavLink className="nav-link" to="/damage">
                                <MenuItem className="flex items-center gap-2">
                                    <FaListUl /> <span>Damage List</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to="/adjustment">
                                <MenuItem className="flex items-center gap-2">
                                    <FaPlusMinus /> <span>Adjustment List</span>
                                </MenuItem>
                            </NavLink>
                        </MenuList>
                    </Menu>
                    <NavLink className="nav-link" to='/wallet'>
                        <Typography variant='small' className="flex justify-center items-center text-white p-2 space-x-2 hover:bg-white hover:text-black rounded-lg ">
                            <FaWallet className='text-base' /> <span className=''>Wallet Transaction</span>
                        </Typography>
                    </NavLink>
                    
                </div>
                <div className='flex justify-end'>
                    <Menu>
                        <MenuHandler>
                            <Button size='sm' variant='text' className='flex items-center text-white gap-2 rounded-full py-2 px-3 '>
                                {/* <BiSolidUserCircle /> */}
                                <Typography variant='small' className='capitalize'>{auth()?.fullName}</Typography>
                                <FaChevronDown className='text-sm cursor-pointer' />
                            </Button>
                        </MenuHandler>
                        <MenuList  className="z-[99999] bg-main text-white">
                            <NavLink className="nav-link" to="/system_user">
                                <MenuItem className="flex items-center gap-2">
                                    <FaUser /> <span>System User</span>
                                </MenuItem>
                            </NavLink>
                            <NavLink className="nav-link" to="/system_role">
                                <MenuItem className="flex items-center gap-2">
                                    <FaLayerGroup /> <span>System Role</span>
                                </MenuItem>
                            </NavLink>
                            <MenuItem className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}>
                                <FaArrowRightFromBracket /> <span>Logout</span>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </nav>
        </div>
    );

}

export default Nav;