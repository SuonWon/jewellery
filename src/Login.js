import { GoPerson, GoLock } from "react-icons/go";
import { useSignIn } from 'react-auth-kit';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "./const";

const validator = require('validator');

function Login() {

    const signIn = useSignIn();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "", 
        password: ""
    });
    const [ showPassword, setShowPassword ] = useState(false);

    const [validationText, setValidationText] = useState({});

    // Email data entry
    const handleUserNameChange = (e) => {
        setFormData({
            ...formData,
            username: e.target.value,
        })
    };

    // Password Data Entry
    const handlePasswordChange = (e) => {
        setFormData({
            ...formData,
            password: e.target.value,
        })
    };

    function validateForm() {
        const newErrors = {};

        if(validator.isEmpty(formData.username) || validator.isEmpty(formData.password)) {
            newErrors.err = "Username and password is empty."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    // Form submit function and check login user
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validateForm()) {
            axios.post(apiUrl + '/auth/login', formData)
            .then((res) => {
                const newErrors = {}
                if(res.data !== '') {
                    if(signIn(
                        {
                            token : res.data.token,
                            tokenType : "Bearer",
                            authState : res.data,
                            expiresIn : 3200,
                        }
                    )) {
                        navigate("/master");
                    }
                }
                else {
                    console.log("reach");
                    newErrors.err = "Username or password is wrong.";
                    setValidationText(newErrors);
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    return(

        <div className="flex bg-white items-center w-full h-screen justify-center">
            <div className="flex flex-col w-80 text-gray-900 bg-white rounded-md pb-12 shadow-xl">
                <div className="h-24 flex items-center text-neutral-100 justify-start px-7 rounded-t-md" style={{backgroundColor: '#51448a'}}>
                    <h3 className="text-2xl font-bold mt-6 text-white">Jewellery Sales</h3>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#51448a" fill-opacity="1" d="M0,160L480,224L960,288L1440,64L1440,0L960,0L480,0L0,0Z"></path>
                </svg>
                <form className="flex flex-col px-7 pt-3 pb-8" onSubmit={handleSubmit}>
                    <h3 className="text-2xl font-bold" style={{color: '#51448a'}}>Login</h3>
                    <h3 className="text-sm mt-1 text-gray-500">Please login to continue...</h3>
                    <div className="relative block mt-8">
                        <span className="absolute inset-y-0 left-0 flex items-center">
                            <GoPerson />
                        </span>
                        <input 
                            className="placeholder:italic placeholder:text-gray-500 block bg-transparent text-sm w-full border-b-2 border-b-gray-500 pl-7 py-1 focus:outline-none" 
                            placeholder="Enter username" 
                            onChange={handleUserNameChange}
                        />
                    </div>
                    <div className="relative block mt-6">
                        <span className="absolute inset-y-0 left-0 flex items-center">
                            <GoLock />
                        </span>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="placeholder:italic placeholder:text-gray-500 block bg-transparent text-sm w-full border-b-2 border-b-gray-500 pl-7 py-1 focus:outline-none" 
                            onChange={handlePasswordChange} 
                            placeholder="Enter password"
                        />
                        {/* <span className="absolute inset-y-0 right-0 flex items-center">
                            <GoEye />
                        </span> */}
                    </div>
                    {
                        validationText.err && <p className="block text-[12px] text-red-500 font-sans mb-2 text-right">{validationText.err}</p>
                    }
                    <div className="flex mt-2">
                        <input
                            type="checkbox"
                            className="mr-2 w-4 h-4"
                            checked={showPassword}
                            onChange={() => {setShowPassword(!showPassword)}}
                        />
                        <span className="text-[13px] text-gray-600">Show password</span>
                    </div>
                    <div className="flex justify-center mt-9">
                        <button className="flex items-center justify-center py-2 w-64 rounded-md text-neutral-50 hover:bg-purple-600 focus:bg-purple-600 drop-shadow-2xl" style={{backgroundColor: '#51448a', color: '#ffffff'}}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default Login;