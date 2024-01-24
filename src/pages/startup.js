/* eslint-disable eqeqeq */
import { useState } from "react";
import { Button, Step, Stepper, Typography } from "@material-tailwind/react";
import { ReactComponent as WelcomeImage } from '../images/welcome_01.svg';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useAddCompanyMutation, useAddDefaultCategoryMutation, useAddDefaultRoleMutation, useAddDefaultUserMutation } from "../store";
import { moduleName } from "../const";
const validator = require('validator');

function Startup(props) {

    const [addCompany] = useAddCompanyMutation();

    const [addDefaultUser] = useAddDefaultUserMutation();

    const [addDefaultRole] = useAddDefaultRoleMutation();

    const [addDefaultCategory] = useAddDefaultCategoryMutation();

    const [roleCode, setRoleCode] = useState(0);

    const [roleData, setRoleData] = useState({
        roleDesc: "Super Admin",
        remark: "",
        createdBy: "Admin",
        updatedBy: "",
        permissions: moduleName.map((el) => {
            return {
                moduleName: el,
                view: true,
                create: true,
                update: true,
                delete: true,
            }
        })
    });

    const [companyData, setCompanyData] = useState({
        companyLogo: "",
        companyName: "",
        city: "",
        street: "",
        hotLineNo: "",
        officeNo: "",
        createdBy: "Admin",
        updatedBy: "",
    });

    const [userData, setUserData] = useState({
        username: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        remark: "",
    })

    const [activeStep, setActiveStep] = useState(0);

    const [showPass, setShowPass] = useState(false);

    const [validationText, setValidationText] = useState({});

    function validateCompanyForm() {
        const newErrors = {};
        if(validator.isEmpty(companyData.companyName)) {
            newErrors.companyName = "Company name is required."
        }
        setValidationText(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function validateUserForm() {
        const newErrors = [];
        if (validator.isEmpty(userData.username)) {
            newErrors.username = "Username is required."
        }
        if (validator.isEmpty(userData.fullName)) {
            newErrors.fullName = "Full name is required."
        }
        if (validator.isEmpty(userData.password)) {
            newErrors.password = "Password is required."
        }
        if (validator.isEmpty(userData.confirmPassword)) {
            newErrors.confirmPassword = "Confirm password is required."
        }
        if (userData.password !== userData.confirmPassword) {
            newErrors.misPassword = "The password and confirmation password do not match."
        }
        setValidationText(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const createCompany = () => {
        if(validateCompanyForm()) {
            addCompany(companyData).then((res) => {
                console.log(res.data);
            });
            addDefaultRole(roleData).then((res) => {
                console.log(res.data);
                setRoleCode(res.data.roleCode);
            });
            setActiveStep(2);
        }
    };

    const createUser = () => {
        if (validateUserForm()) {
            console.log(userData);
            addDefaultUser({
                username: userData.username,
                fullName: userData.fullName,
                password: userData.password,
                isActive: true,
                roleCode: roleCode,
                remark: userData.remark,
                createdBy: "",
                updatedBy: "",
            }).then((res) => {
                console.log(res.data);
            });
            addDefaultCategory({
                categoryDesc: "Stone",
                status: true,
                isDefault: true,
                createdBy: "Admin",
                updatedBy: "",
            });
            props.handleOpen();
        }
    }

    return (
        <>
            {/* Welcome Page */}
            <div className={`w-full ${activeStep === 0 ? "block" : "hidden"} h-[400px] transition-all duration-300`}>
                <WelcomeImage className="w-full h-[180px] mb-8" />
                <Typography variant="h4" color="black" className="px-2 rounded mb-3">
                    Welcome to <span className="text-main">Jewellery POS</span>
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="px-2 rounded mb-3">
                    We're excited to have you along for the ride. This walk-through will help you get started using <span className="text-main font-bold">Jewellery POS</span>.
                </Typography>
                <div className="mb-3 flex justify-end">
                    <Button variant="gradient" color="deep-purple" onClick={() => setActiveStep(1)}>Next</Button>
                </div>
            </div>
            {/* Company Info */}
            <div className={`w-full ${activeStep === 1 ? "block" : "hidden"} h-[400px]`}>
                <Typography variant="h4" color="deep-purple" className="border-l-4 border-main px-2 rounded mb-6">Company Information</Typography>
                <div className="mb-3 grid grid-cols-3">
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                        {/* Company Name */}
                        <div>
                            <label className="text-black text-sm mb-2">Company Name</label>
                            <input 
                                type="text" 
                                className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-lg"
                                value={companyData.companyName}
                                onChange={(e) => {
                                    setCompanyData({
                                        ...companyData,
                                        companyName: e.target.value
                                    });
                                }}
                            />
                            {
                                validationText.companyName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.companyName}</p>
                            }
                        </div>
                        {/* City */}
                        <div>
                            <label className="text-black text-sm mb-2">City</label>
                            <input 
                                type="text" 
                                className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-lg"
                                value={companyData.city}
                                onChange={(e) => {
                                    setCompanyData({
                                        ...companyData,
                                        city: e.target.value
                                    });
                                }}
                            />
                        </div>
                        {/* Street */}
                        <div className="col-span-2">
                            <label className="text-black text-sm mb-2">Street</label>
                            <input 
                                type="text" 
                                className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-lg" 
                                value={companyData.street}
                                onChange={(e) => {
                                    setCompanyData({
                                        ...companyData,
                                        street: e.target.value
                                    });
                                }}
                            />
                        </div>
                        {/* Office No */}
                        <div>
                            <label className="text-black text-sm mb-2">Office No</label>
                            <input 
                                type="text" 
                                className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-lg" 
                                value={companyData.officeNo}
                                onChange={(e) => {
                                    setCompanyData({
                                        ...companyData,
                                        officeNo: e.target.value
                                    });
                                }}
                            />
                        </div>
                        {/* Hotline No */}
                        <div>
                            <label className="text-black text-sm mb-2">Hotline No</label>
                            <input 
                                type="text" 
                                className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-lg" 
                                value={companyData.hotLineNo}
                                onChange={(e) => {
                                    setCompanyData({
                                        ...companyData,
                                        hotLineNo: e.target.value
                                    });
                                }}
                            />
                        </div>
                    </div>
                    {/* <div className="flex items-center justify-center">
                        <label htmlFor='p' className='flex flex-col items-center justify-center w-fit h-fit cursor-pointer text-gray-100'>
                            <div className="flex items-center justify-center w-40 h-40 bg-gray-500 rounded-lg border-4 border-white shadow-xl p-0.5 ">
                                <FaRegImages className='text-5xl' />
                            </div> 
                        </label>
                        <input type='file' multiple id='p' className='hidden' />
                    </div> */}
                </div>
                <div className="mt-9 mb-3 flex justify-end">
                    {/* <Button variant="gradient" color="black" onClick={() => setActiveStep(0)}>Back</Button> */}
                    <Button variant="gradient" color="deep-purple" onClick={createCompany}>Next</Button>
                </div>
            </div>
            {/* System User */}
            <div className={`w-full ${activeStep === 2 ? "block" : "hidden"} h-[400px]`}>
                <Typography variant="h4" color="deep-purple" className="border-l-4 border-main px-2 rounded mb-6">System User</Typography>
                <div className="mb-3 grid grid-cols-3">
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                        {/* username */}
                        <div>
                            <label className="text-black text-sm mb-2">Username</label>
                            <input 
                                type="text" 
                                className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-lg" 
                                value={userData.username}
                                onChange={(e) => {
                                    setUserData({...userData, username: e.target.value});
                                }}
                            />
                            {
                                validationText.username && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.username}</p>
                            }
                        </div>
                        {/* Full Name */}
                        <div>
                            <label className="text-black text-sm mb-2">Full Name</label>
                            <input 
                                type="text" 
                                className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-lg"
                                value={userData.fullName}
                                onChange={(e) => {
                                    setUserData({...userData, fullName: e.target.value});
                                }}
                            />
                            {
                                validationText.fullName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.fullName}</p>
                            }
                        </div>
                        {/* Password */}
                        <div className="">
                            <label className="text-black text-sm mb-2">Password</label>
                            <div className="relative block">
                                <input
                                    name='password'
                                    className='block bg-white w-full border border-blue-gray-200 rounded-md w-full h-[35px] px-2.5 py-1.5 text-black'
                                    value={userData.password}
                                    type={showPass ? 'text' : 'password'}
                                    onChange={(e) => { 
                                        setUserData({...userData, password: e.target.value})
                                    }} />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 leading-5">
                                    {showPass ? <GoEyeClosed onClick={() => setShowPass(false)} className='cursor-pointer' /> : <GoEye onClick={() => setShowPass(true)} className='cursor-pointer' />}
                                </span>
                            </div>
                            {
                                validationText.password && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.password}</p>
                            }
                        </div>
                        {/* Confirm Password */}
                        <div className="">
                            <label className="text-black text-sm mb-2">Confirm Password</label>
                            <div className="relative block">
                                <input
                                    name='password'
                                    className='block bg-white w-full border border-blue-gray-200 rounded-md w-full h-[35px] px-2.5 py-1.5 text-black'
                                    value={userData.confirmPassword}
                                    type={showPass ? 'text' : 'password'}
                                    onChange={(e) => { 
                                        setUserData({...userData, confirmPassword: e.target.value});
                                    }} />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 leading-5">
                                    {showPass ? <GoEyeClosed onClick={() => setShowPass(false)} className='cursor-pointer' /> : <GoEye onClick={() => setShowPass(true)} className='cursor-pointer' />}
                                </span>
                            </div>
                            {
                                validationText.confirmPassword && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.confirmPassword}</p>
                            }
                            {
                                validationText.misPassword && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.misPassword}</p>
                            }
                        </div>
                    </div>
                </div>
                <div className="mt-9 mb-3 flex justify-between">
                    <Button variant="gradient" color="black" onClick={() => setActiveStep(1)}>Back</Button>
                    <Button variant="gradient" color="deep-purple" onClick={createUser}>Finish</Button>
                </div>
            </div>
            {/* Stepper */}
            <div className="w-full px-20 pt-4 pb-8">
                <Stepper
                    activeStep={activeStep}
                    lineClassName="bg-main/25"
                    activeLineClassName="bg-main"
                >
                    <Step
                        className="h-4 w-4 !bg-blue-gray-50 text-main/50 cursor-pointer"
                        activeClassName="ring-0 !bg-main text-main"
                        completedClassName="!bg-main text-main"
                    >
                        <div className="absolute -bottom-[2.3rem] w-max text-center text-xs">
                            <Typography variant="h6" color="inherit">Welcome</Typography>
                        </div>
                    </Step>
                    <Step
                        className="h-4 w-4 !bg-blue-gray-50 text-main/50 cursor-pointer"
                        activeClassName="ring-0 !bg-main text-main"
                        completedClassName="!bg-main text-main"
                    >
                        <div className="absolute -bottom-[2.3rem] w-max text-center text-xs">
                            <Typography variant="h6" color="inherit">Company Info</Typography>
                        </div>
                    </Step>
                    <Step
                        className="h-4 w-4 !bg-blue-gray-50 text-main/50 cursor-pointer"
                        activeClassName="ring-0 !bg-main text-main"
                        completedClassName="!bg-main text-main"
                    >
                        <div className="absolute -bottom-[2.3rem] w-max text-center text-xs">
                            <Typography variant="h6" color="inherit">System User</Typography>
                        </div>
                    </Step>
                </Stepper>
            </div>
        </>
    )
}

export default Startup;