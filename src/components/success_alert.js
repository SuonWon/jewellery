import { Alert } from "@material-tailwind/react";
import { FaCircleCheck, FaXmark } from "react-icons/fa6";

function SuccessAlert({ message, handleAlert }) {
    return (
        <div
            className="flex flex-row justify-between items-center rounded-md mt-3 border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946] p-4 gap-4"
        >
            <FaCircleCheck />
            <span>{message}</span>
            <FaXmark className="cursor-pointer" onClick={handleAlert} />
        </div>
    )
}

export default SuccessAlert;