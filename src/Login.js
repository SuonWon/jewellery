import { GoPerson, GoLock, GoEye } from "react-icons/go";

function Login() {

    return(

        <div className="flex items-center w-full h-screen bg-white justify-center">
            <div className="flex flex-col w-80 text-gray-900 bg-white rounded-md pb-12 shadow-xl">
                <div className="h-24 flex items-center text-neutral-100 justify-start px-7 rounded-t-md" style={{backgroundColor: '#51448a'}}>
                    <h3 className="text-2xl font-bold mt-6">Jewellery Sales</h3>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#51448a" fill-opacity="1" d="M0,160L480,224L960,288L1440,64L1440,0L960,0L480,0L0,0Z"></path>
                </svg>
                <div className="flex flex-col px-7 pt-3 pb-8">
                    <h3 className="text-2xl font-bold" style={{color: '#51448a'}}>Login</h3>
                    <h3 className="text-sm mt-1 text-gray-500">Please login to continue...</h3>
                    <div className="relative block mt-8">
                        <span className="absolute inset-y-0 left-0 flex items-center">
                            <GoPerson />
                        </span>
                        <input className="placeholder:italic placeholder:text-gray-500 block bg-transparent text-sm w-full border-b-2 border-b-gray-500 pl-7 py-1 focus:outline-none" placeholder="Enter username"/>
                    </div>
                    <div className="relative block mt-6">
                        <span className="absolute inset-y-0 left-0 flex items-center">
                            <GoLock />
                        </span>
                        <input className="placeholder:italic placeholder:text-gray-500 block bg-transparent text-sm w-full border-b-2 border-b-gray-500 pl-7 py-1 focus:outline-none" placeholder="Enter password"/>
                        <span className="absolute inset-y-0 right-0 flex items-center">
                            <GoEye />
                        </span>
                    </div>
                    <div className="flex justify-center mt-9">
                        <button className="flex items-center justify-center py-2 w-64 rounded-md text-neutral-50 hover:bg-purple-600 focus:bg-purple-600 drop-shadow-2xl" style={{backgroundColor: '#51448a'}}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Login;