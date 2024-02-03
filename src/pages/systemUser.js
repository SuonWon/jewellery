/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useAddUserMutation, useFetchRolesQuery, useFetchUsersCountQuery, useFetchUsersQuery, useRemoveUserMutation, useUpdateUserMutation } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { AuthContent } from "../context/authContext";
import { pause } from "../const";
import SuccessAlert from "../components/success_alert";

var bcrypt = require('bcryptjs');
const validator = require("validator");

function SystemUser() {

    const { permissions } = useContext(AuthContent);

    const [userPermission, setUserPermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setUserPermission(permissions[19]);

        if(userPermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, navigate, userPermission])

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: ''
    });

    const {data, isLoading: dataLoad} = useFetchUsersQuery(filterData);

    const {data: roleData} = useFetchRolesQuery({
        skip: 0,
        take: 0,
        search: ''
    });

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
    });

    const { data: dataCount } = useFetchUsersCountQuery(filterData); 

    const [addUser] = useAddUserMutation();

    const [editUser] = useUpdateUserMutation();

    const [removeUser] = useRemoveUserMutation();

    const [showPass, setShowPass] = useState(false);

    const [deleteId, setDeleteId] = useState('');

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [ validationText, setValidationText ] = useState({});

    const [ currentPage, setCurrentPage] = useState(1);

    const userInfo = {
        username: "",
        fullName: "",
        password: "",
        roleCode: 0,
        isActive: true,
        remark: "",
        createdBy: auth().username,
        updatedBy: "",
    }

    const [formData, setFormData] = useState(userInfo);

    var salt = bcrypt.genSaltSync(10);

    const handleChange = async (e) => {
        let user = data.find((user) => user.username == e.target.id);
        await editUser({
            username: user.username,
            fullName: user.fullName,
            password: user.password,
            roleCode: user.roleCode,
            isActive: e.target.checked,
            remark: user.remark,
            createdAt: user.createdAt,
            createdBy: user.createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "System user updated successfully.",
                });
            } else {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Error",
                    message: res.error.data.message,
                    isError: true,
                });
            }
        });
        await pause();
        setAlertMsg({
            ...alertMsg,
            visible: false,
        });
    };

    const openModal = () => {
        setIsEdit(false);
        setFormData(userInfo);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};
        if(validator.isEmpty(formData.username.toString())) {
            newErrors.username = 'User name is required.'
        }
        if(validator.isEmpty(formData.fullName.toString())) {
            newErrors.fullName = 'Full name is required.'
        }
        if(validator.isEmpty(formData.password.toString())) {
            newErrors.password = 'Password is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        var hash = bcrypt.hashSync(formData.password, salt);
        if(validateForm()) {
            addUser({
                ...formData,
                password: hash
            }).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "System user created successfully.",
                    });
                } else {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Error",
                        message: res.error.data.message,
                        isError: true,
                    });
                }
            });
            setFormData(userInfo);
            setOpen(!open);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        }
    };

    const onSaveSubmit = async () => {
        var hash = bcrypt.hashSync(formData.password, salt);
        if (validateForm()) {
            addUser({
                ...formData,
                password: hash
            }).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "System user created successfully.",
                    });
                } else {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Error",
                        message: res.error.data.message,
                        isError: true,
                    });
                }
            });
            setFormData(userInfo);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        }
    };

    const handleEdit = async (username) => {
        let eData = data.find((user) => user.username === username);
        setIsEdit(true);
        setFormData(eData);
        setOpen(!open);
    };

    const submitEdit = async () => {
        editUser({
            username: formData.username,
            fullName: formData.fullName,
            password: formData.password,
            roleCode: formData.roleCode,
            isActive: formData.isActive,
            remark: formData.remark,
            createdAt: formData.createdAt,
            createdBy: formData.createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "System role updated successfully.",
                });
            } else {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Error",
                    message: res.error.data.message,
                    isError: true,
                });
            }
        });
        setOpen(!open);
        await pause();
        setAlertMsg({
            ...alertMsg,
            visible: false,
        });
    };

    const handleRemove = async (id) => {
        removeUser(id).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "System role deleted successfully.",
                });
            } else {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Error",
                    message: "This data cannot be deleted.",
                    isError: true,
                });
            }
        });
        setOpenDelete(!openDelete);
        await pause();
        setAlertMsg({
            ...alertMsg,
            visible: false,
        });
    };

    const handleDeleteBtn = (id) => {
        console.log(id);
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const column = [
        {
            name: 'Status',
            width: "150px",
            center: "true",
            cell: row => (
                <div className={`w-[90px] flex items-center justify-center text-white h-7 rounded-full ${row.status ? 'bg-green-500' : 'bg-red-500' } `}>
                    {
                        row.status ? 'Active' : 'Inactive'
                    }
                </div>
            ),
        },
        {
            name: 'Username',
            width: "200px",
            selector: row => row.username,
            
        },
        {
            name: 'Full Name',
            width: "200px",
            selector: row => row.fullName,
            
        },
        {
            name: 'Role',
            width: "150px",
            selector: row => row.roleCode,
            
        },
        {
            name: 'Created At',
            width: "200px",
            selector: row => row.createdAt,
        },
        {
            name: 'Updated At',
            width: "200px",
            selector: row => row.updatedAt,
        },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.remark,
        },
        {
            name: 'Action',
            center: "true",
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {
                        userPermission?.update ? (
                            <div className="border-r border-gray-400 pr-2">
                                <div class="custom-checkbox">
                                    <input class="input-checkbox" checked={row.status} id={row.username} type="checkbox" onChange={handleChange} />
                                    <label for={row.username}></label>
                                </div>
                            </div>
                        ) : null
                    }
                    <Button 
                        variant="text" color="deep-purple" 
                        className="p-2" 
                        onClick={() => handleEdit(row.username)}
                    >
                        <FaPencil />
                    </Button>
                    {
                        userPermission?.delete ? (
                            <Button 
                                variant="text" 
                                color="red" 
                                className="p-2" 
                                onClick={() => handleDeleteBtn(row.username)}
                            >
                                <FaTrashCan />
                            </Button>
                        ) : null
                    }
                </div>
            )
        },
    ];

    const tbodyData = data?.map((user) => {
        return {
            username: user.username,
            fullName: user.fullName,
            password: user.password,
            roleCode: user.roleCode,
            status: user.isActive,
            remark: user.remark,
            createdAt: moment(user.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: user.createdBy,
            updatedAt: moment(user.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: user.updatedBy,
        }
    });

    return(
        <>
        {
            userPermission != null && userPermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                        }
                    </div>
                    <SectionTitle title="System User" handleModal={openModal} permission={userPermission?.create}/>
                    <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t mb-5">
                        <CardBody className="rounded-sm overflow-auto p-0">
                            <div className="flex justify-end py-2">
                                <div className="w-72">
                                    <Input label="Search" value={filterData.search} onChange={(e) => {
                                            setFilterData({
                                                skip: 0,
                                                take: 10,
                                                search: e.target.value
                                            });
                                            setCurrentPage(1);
                                        }}
                                        icon={<FaMagnifyingGlass />}
                                    />
                                </div>
                            </div>
                            
                            <TableList columns={column} data={tbodyData} pending={dataLoad} />
        
                            <div className="grid grid-cols-2">
                                <div className="flex mt-7 mb-5">
                                    <p className="mr-2 mt-[6px]">Show</p>
                                    <div className="w-[80px]">
                                        <select
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={filterData.take} 
                                            onChange={(e) => {
                                                setFilterData({
                                                    ...filterData,
                                                    skip: 0,
                                                    take: e.target.value
                                                });
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                    
                                    <p className="ml-2 mt-[6px]">entries</p>
                                </div>
                                
                                <div className="flex justify-end">
                                    {
                                        dataCount != undefined ? (
                                            <Pagination
                                                className="pagination-bar"
                                                siblingCount={1}
                                                currentPage={currentPage}
                                                totalCount={dataCount}
                                                pageSize={filterData.take}
                                                onPageChange={(page) => {
                                                    setCurrentPage(page);
                                                    setFilterData({
                                                        ...filterData,
                                                        skip: (page - 1) * filterData.take
                                                    })
                                                }}
                                            />
                                        ) : (<></>)
                                    }
                                </div>
                                
                            </div>
                            
                        </CardBody>
                    </Card>
                    <Dialog open={Boolean(open)} handler={openModal} size="sm">
                        <DialogBody>
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                            }
                            <ModalTitle titleName={isEdit ? "Edit User" : "Create User"} handleClick={openModal} />
                            <form  className="flex flex-col items-end p-3 gap-2">
                                <div className="grid grid-cols-2 gap-2 mb-3 w-full">
                                    {/* Username */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Username</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.username}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    username: e.target.value
                                                });
                                            }}
                                            readOnly={isEdit}
                                        />
                                        {
                                            validationText.username && <p className="block text-[12px] text-red-500 font-sans">{validationText.username}</p>
                                        }
                                    </div>
                                    {/* Full Name */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.fullName}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    fullName: e.target.value
                                                });
                                            }}
                                        />
                                        {
                                            validationText.fullName && <p className="block text-[12px] text-red-500 font-sans">{validationText.fullName}</p>
                                        }
                                    </div>
                                    {/* Password */}
                                    {
                                        isEdit ? "" : <div>
                                            <label className="text-black text-sm mb-2">Password</label>
                                            <div className="relative block">
                                                <input 
                                                    name='password' 
                                                    className='block bg-white w-full border border-blue-gray-200 rounded-md w-full h-[35px] px-2.5 py-1.5 text-black' 
                                                    type={showPass ? 'text': 'password'} 
                                                    onChange={(e) => {
                                                        setFormData({
                                                            ...formData,
                                                            password: e.target.value
                                                        });
                                                    }}/>
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 leading-5">
                                                    {showPass ? <GoEyeClosed onClick={() => setShowPass(false)} className='cursor-pointer' /> : <GoEye onClick={() => setShowPass(true)} className='cursor-pointer' /> }
                                                </span>
                                            </div>
                                            {
                                                validationText.password && <p className="block text-[12px] text-red-500 font-sans">{validationText.password}</p>
                                            }
                                        </div>
                                    }
                                    {/* Role Name */}
                                    <div className="">
                                        <label className="text-black mb-2 text-sm">Role</label>
                                        <select
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={formData.roleCode}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    roleCode: Number(e.target.value)
                                                });
                                            }}
                                        >
                                            <option value="0" disabled>Select Role</option>
                                            {
                                                roleData?.map((role) => {
                                                    return <option value={role.roleCode} key={role.roleCode} >{role.roleDesc}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.supplier && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.supplier}</p>
                                        }
                                    </div>
                                </div>
                                {/* Remark */}
                                <div className="grid gap-2 w-full">
                                    <label className="text-black text-sm">Remark</label>
                                    <textarea
                                        className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.remark == null ? "" : formData.remark}
                                        rows="1"
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                remark: e.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-end mt-6 gap-2">
                                    {
                                        isEdit ? (
                                            userPermission?.update ? (
                                                <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                                    <FaFloppyDisk className="text-base" /> 
                                                    <Typography variant="small" className="capitalize">
                                                        Update
                                                    </Typography>
                                                </Button>
                                            ): null
                                        ) : 
                                        <>
                                            <Button onClick={onSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                                <FaFloppyDisk className="text-base" /> 
                                                <Typography variant="small" className="capitalize">
                                                    Save
                                                </Typography>
                                            </Button>
                                            <Button onClick={onSaveSubmit} color="deep-purple" size="sm" variant="outlined" className="flex items-center gap-2">
                                                <FaCirclePlus className="text-base" /> 
                                                <Typography variant="small" className="capitalize">
                                                    Save & New
                                                </Typography>
                                            </Button>
                                        </>
                                    }
                                </div>
                            </form>
                             
                        </DialogBody>                      
                    </Dialog>
                    <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                </div>
            ) : <div>Loading...</div>
        }
        
        </>
    );

}

export default SystemUser;
