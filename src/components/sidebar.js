import { Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { FaRulerVertical } from "react-icons/fa6";
import { GiCheckeredDiamond, GiCutDiamond, GiDiamondHard, GiDiamonds } from "react-icons/gi";
import { Link } from "react-router-dom";

function Sidebar() {

    return (
        <Card className="max-w-[18rem] h-[calc(100% - 54px)] px-4 py-1 shadow-xl shadow-none border rounded-none">
            <div className="mb-2 px-4 py-3">
                <Typography color="blue-gray" variant="h5">
                    Master Data
                </Typography>
            </div>
            <List>
                <Link to="home/master/brightness" className="text-initial">
                    <ListItem>
                        <ListItemPrefix>
                            <GiCheckeredDiamond />
                        </ListItemPrefix>
                        Stone Brightness
                    </ListItem>
                </Link>
                <Link to="home/master/grade" className="text-initial">
                    <ListItem >
                        <ListItemPrefix>
                            <GiDiamonds />
                        </ListItemPrefix>
                        Stone Grade
                    </ListItem>
                </Link>
                <Link to="home/master/type" className="text-initial">
                    <ListItem>
                        <ListItemPrefix>
                            <GiDiamondHard />
                        </ListItemPrefix>
                        Stone Type
                    </ListItem>
                </Link>
                <Link to="home/master/stone" className="text-initial">
                    <ListItem>
                        <ListItemPrefix>
                            <GiCutDiamond />
                        </ListItemPrefix>
                        Stone
                    </ListItem>
                </Link>
                <Link to="home/master/uom" className="text-initial">
                    <ListItem>
                        <ListItemPrefix>
                            <FaRulerVertical />
                        </ListItemPrefix>
                        Unit
                    </ListItem>
                </Link>
            </List>
        </Card>
    );

}

export default Sidebar;