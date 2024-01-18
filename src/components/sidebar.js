import { Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { BiCategory } from "react-icons/bi";
import { FaRulerVertical } from "react-icons/fa6";
import { GiCheckeredDiamond, GiCutDiamond, GiDiamondHard, GiDiamonds } from "react-icons/gi";
import { Link } from "react-router-dom";

function Sidebar() {

    return (
        <Card className="w-full h-full py-1 shadow-none border rounded-none xl:px-4">
            <div className="mb-2 px-4 py-3">
                <Typography color="blue-gray" variant="h5">
                    <span className="hidden xl:block">Master Data</span>
                    <span className="block xl:hidden">MD</span>
                </Typography>
            </div>
            <List className="w-full">
                <Link to="home/master/brightness" className="text-initial">
                    <ListItem className="w-fit">
                        <ListItemPrefix>
                            <GiCheckeredDiamond />
                        </ListItemPrefix>
                        <span className="hidden xl:block">Stone Brightness</span>
                        <span className="block xl:hidden">SB</span>
                    </ListItem>
                </Link>
                <Link to="home/master/grade" className="text-initial">
                    <ListItem className="w-fit">
                        <ListItemPrefix>
                            <GiDiamonds />
                        </ListItemPrefix>
                        <span className="hidden xl:block">Stone Grade</span>
                        <span className="block xl:hidden">SG</span>
                    </ListItem>
                </Link>
                <Link to="home/master/type" className="text-initial">
                    <ListItem className="w-fit">
                        <ListItemPrefix>
                            <GiDiamondHard />
                        </ListItemPrefix>
                        <span className="hidden xl:block">Stone Type</span>
                        <span className="block xl:hidden">ST</span>
                    </ListItem>
                </Link>
                <Link to="home/master/stone" className="text-initial">
                    <ListItem className="w-fit">
                        <ListItemPrefix>
                            <GiCutDiamond />
                        </ListItemPrefix>
                        <span className="hidden xl:block">Stone</span>
                        <span className="block xl:hidden">S</span>
                    </ListItem>
                </Link>
                <Link to="home/master/uom" className="text-initial">
                    <ListItem className="w-fit">
                        <ListItemPrefix>
                            <FaRulerVertical />
                        </ListItemPrefix>
                        <span className="hidden xl:block">Stone Unit</span>
                        <span className="block xl:hidden">SU</span>
                    </ListItem>
                </Link>
                <Link to="home/master/walletCategory" className="text-initial">
                    <ListItem className="w-fit">
                        <ListItemPrefix>
                            <BiCategory />
                        </ListItemPrefix>
                        <span className="hidden xl:block">Wallet Category</span>
                        <span className="block xl:hidden">WC</span>
                    </ListItem>
                </Link>
            </List>
        </Card>
    );

}

export default Sidebar;