import { Button, Typography } from "@material-tailwind/react";
import { FaPlus } from "react-icons/fa6";

function SectionTitle({title, handleModal}) {

    return (
        <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
            <Typography variant="h5">
                {title}
            </Typography>
            <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleModal}>
                <FaPlus /> Create New
            </Button>
        </div>
    );
}

export default SectionTitle;