import { Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { BiCategory } from "react-icons/bi";
import { FaRulerVertical } from "react-icons/fa6";
import { GiCheckeredDiamond, GiCutDiamond, GiDiamondHard, GiDiamonds } from "react-icons/gi";
import { Link } from "react-router-dom";
import { AuthContent } from '../context/authContext';
import { moduleName } from '../const';
import { useContext } from 'react';

function Sidebar() {

    const { permissions } = useContext(AuthContent);

    return (
        <Card className="w-full h-full py-1 shadow-none border rounded-none xl:px-4">
            <div className="mb-2 px-4 py-3 xl:px-4">
                <Typography color="blue-gray" variant="h5">
                    <span className="hidden xl:block">Master Data</span>
                    <span className="block xl:hidden">M</span>
                </Typography>
            </div>
            <List className="w-full w-min-full">
                {
                    permissions[3]?.view ? (
                        <Link to="brightness" className="text-initial w-fit">
                            <ListItem className="w-fit">
                                <ListItemPrefix className="mr-0 xl:mr-4">
                                    <GiCheckeredDiamond />
                                </ListItemPrefix>
                                <span className="hidden xl:block">Stone Brightness</span>
                            </ListItem>
                        </Link>
                    ) : null
                }
                {
                    permissions[2]?.view ? (
                        <Link to="grade" className="text-initial w-fit">
                            <ListItem className="w-fit">
                                <ListItemPrefix className="mr-0 xl:mr-4">
                                    <GiDiamonds />
                                </ListItemPrefix>
                                <span className="hidden xl:block">Stone Grade</span>
                            </ListItem>
                        </Link>
                    ) : null
                }
                {
                    permissions[1]?.view ? (
                        <Link to="type" className="text-initial w-fit">
                            <ListItem className="w-fit">
                                <ListItemPrefix className="mr-0 xl:mr-4">
                                    <GiDiamondHard />
                                </ListItemPrefix>
                                <span className="hidden xl:block">Stone Type</span>
                            </ListItem>
                        </Link>
                    ) : null
                }
                {
                    permissions[0]?.view ? (
                        <Link to="stone" className="text-initial w-fit">
                            <ListItem className="w-fit">
                                <ListItemPrefix className="mr-0 xl:mr-4">
                                    <GiCutDiamond />
                                </ListItemPrefix>
                                <span className="hidden xl:block">Stone</span>
                            </ListItem>
                        </Link>
                    ) : null
                }
                {
                    permissions[4]?.view ? (
                        <Link to="uom" className="text-initial w-fit">
                            <ListItem className="w-fit">
                                <ListItemPrefix className="mr-0 xl:mr-4">
                                    <FaRulerVertical />
                                </ListItemPrefix>
                                <span className="hidden xl:block">Stone Unit</span>
                            </ListItem>
                        </Link>
                    ) : null
                }
                {
                    permissions[5]?.view ? (
                        <Link to="walletCategory" className="text-initial w-fit" >
                            <ListItem className="w-fit">
                                <ListItemPrefix className="mr-0 xl:mr-4">
                                    <BiCategory />
                                </ListItemPrefix>
                                <span className="hidden xl:block">Wallet Category</span>
                            </ListItem>
                        </Link>
                    ) : null
                }
                
            </List>
        </Card>
    );

}

export default Sidebar;