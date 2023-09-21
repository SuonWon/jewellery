import { IconButton, Typography } from "@material-tailwind/react";
import { FaXmark } from "react-icons/fa6";

function ModalTitle({titleName, handleClick}) {

    return(
        <div className="mb-3 flex items-center justify-between p-4 bg-main text-white rounded-md">
            <Typography variant="h5">
                {titleName}
            </Typography>
            <IconButton variant="text" onClick={handleClick}>
                <FaXmark className="text-base text-white"/>
            </IconButton>
        </div>
    );

}

export default ModalTitle;