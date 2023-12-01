import { FaCircleCheck, FaXmark } from "react-icons/fa6";

function SuccessAlert({ title, message, handleAlert, isError, isWarning }) {
    return (
        <div role="alert"  style={{width: "400px", position: "fixed", top: 20, right: 10, zIndex: 9999 }}>
            <div className={`${isError ? "bg-red-500" : isWarning? "bg-yellow-500" : "bg-green-500"} text-white font-bold rounded-t px-4 py-2`}>
                {title}
            </div>
            <div className={`border border-t-0 rounded-b px-4 py-3 ${isError ? "border-red-400 text-red-700 bg-red-100 " : isWarning ? "border-yellow-400 text-yellow-800 bg-yellow-100 " : "border-green-400 text-green-700 bg-green-100 "}`}>
                <p>
                    {
                        message
                    }
                </p>
            </div>
        </div>
        // <div
        //     className="flex flex-row justify-between items-center rounded-md mt-3 border-l-4 border-[#2ec946] font-medium text-[#fff] p-4 gap-4" style={{backgroundColor: "green",}}
        // >
        //     <FaCircleCheck />
        //     <span>{message}</span>
        //     <FaXmark className="cursor-pointer" onClick={handleAlert} />
        // </div>
    )
}

export default SuccessAlert;