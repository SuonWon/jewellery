import { Button, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCheck, FaXmark } from "react-icons/fa6";

function DeleteModal({ deleteId, open, handleDelete, closeModal}) {

    return(
        <Dialog open={open} size="xs">
            <DialogBody className="flex flex-col items-center bg-red-200 rounded-md">
                <Typography variant="h5" className="text-white">
                    Are you sure?
                </Typography>
                <div className="flex items-center gap-4 mt-4">
                    <Button className="flex items-center gap-2" color="red" onClick={() => handleDelete(deleteId)}><FaCheck/> <span>Delete</span></Button>
                    <Button className="flex items-center gap-2" onClick={closeModal}><FaXmark/> <span>Cancel</span></Button>
                </div>
            </DialogBody>
        </Dialog>
    );

}

export default DeleteModal;