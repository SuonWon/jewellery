/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6";
import { useState } from "react";
import { useAddRoleMutation, useFetchRolesCountQuery, useFetchRolesQuery, useUpdateRoleMutation } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import { moduleName } from "../const";
const validator = require("validator");

function SystemRole() {

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: ''
    });

    const permission = moduleName.map((el) => {
        return {
            moduleName: el,
            moduleCheck: false,
            view: false,
            create: false,
            update: false,
            delete: false,
        }
    });

    const [permissionData, setPermissionData] = useState(permission);

    const {data} = useFetchRolesQuery(filterData);
    
    const { data: dataCount } = useFetchRolesCountQuery(filterData); 

    const [addRole, addResult] = useAddRoleMutation();

    const [editRole] = useUpdateRoleMutation();

    const [deleteId, setDeleteId] = useState('');

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [isSelectAll, setIsSelectAll] = useState(false);

    const [ validationText, setValidationText ] = useState({});

    const [ currentPage, setCurrentPage] = useState(1);

    const userInfo = {
        roleDesc: "",
        remark: "",
        createdBy: auth().username,
        updatedBy: "",
        permissions: [],
    }

    const [formData, setFormData] = useState(userInfo);

    const handleChange = async (e) => {
        
        let role = data.find((role) => role.roleCode == e.target.id);
        await editRole({
            roleDesc: role.roleDesc,
            remark: role.remark,
            permission: role.permission,
            createdAt: role.createdAt,
            createdBy: role.createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });

    };

    const openModal = () => {
        setIsEdit(false);
        setFormData(userInfo);
        setIsSelectAll(false);
        setPermissionData(permission);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};
        if(validator.isEmpty(formData.roleDesc.toString())) {
            newErrors.roleDesc = 'Role Name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addRole({
                ...formData,
                permissions: permissionData.map((el) => {
                    return {
                        moduleName: el.moduleName,
                        view: el.view,
                        create: el.create,
                        update: el.update,
                        delete: el.delete,
                    }
                })
            }).then((res) => {
                console.log(res);
            });
            setFormData(userInfo);
            setOpen(!open);
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            addRole({
                ...formData,
                permissions: permissionData.map((el) => {
                    return {
                        moduleName: el.moduleName,
                        view: el.view,
                        create: el.create,
                        update: el.update,
                        delete: el.delete,
                    }
                })
            }).then((res) => {
                console.log(res);
            });
            setFormData(userInfo)
        }
    };

    const handleEdit = async (code) => {
        let eData = data.find((role) => role.roleCode === code);
        console.log(eData);
        setIsEdit(true);
        setFormData(eData);
        setPermissionData(eData.permissions.map((el) => {
            return {
                permissionCode: el.permissionCode,
                roleCode: el.roleCode,
                moduleName: el.moduleName,
                moduleCheck: el.view && el.create && el.update && el.delete ? true : false,
                view: el.view,
                create: el.create,
                update: el.update,
                delete: el.delete,
            }
        }));
        setIsSelectAll(false);
        setOpen(!open);
    };

    const submitEdit = async () => {
        editRole({
            roleCode: formData.roleCode,
            roleDesc: formData.roleDesc,
            remark: formData.remark,
            createdAt: formData.createdAt,
            createdBy: formData.createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
            permissions: permissionData.map((el) => {
                return {
                    permissionCode: el.permissionCode,
                    roleCode: el.roleCode,
                    moduleName: el.moduleName,
                    view: el.view,
                    create: el.create,
                    update: el.update,
                    delete: el.delete,
                }
            }),
        }).then((res) => {
            console.log(res);
        });
        setOpen(!open);
    };

    // const handleRemove = async (id) => {
    //     removeUser(id).then((res) => {console.log(res)});
    //     setOpenDelete(!openDelete);
    // };

    const handleDeleteBtn = (id) => {
        console.log(id);
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const column = [
        {
            name: 'Role Name',
            width: "200px",
            selector: row => row.roleDesc,
            
        },
        {
            name: 'Created At',
            selector: row => row.createdAt,
        },
        {
            name: 'Updated At',
            selector: row => row.updatedAt,
        },
        {
            name: 'Remark',
            selector: row => row.remark,
        },
        {
            name: 'Action',
            center: "true",
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <div className="border-r border-gray-400 pr-2">
                        <div class="custom-checkbox">
                            <input class="input-checkbox" checked={row.status} id={row.code} type="checkbox" onChange={handleChange} />
                            <label for={row.code}></label>
                        </div>
                    </div> */}
                    <Button 
                        variant="text" color="deep-purple" 
                        className="p-2" 
                        onClick={() => handleEdit(row.roleCode)}
                    >
                        <FaPencil />
                    </Button>
                    {/* <Button 
                        variant="text" 
                        color="red" 
                        className="p-2" 
                        onClick={() => handleDeleteBtn(Number(row.roleCode))}
                        disabled={row.isOwner}
                    >
                        <FaTrashCan />
                    </Button> */}
                </div>
            )
        },
    ];

    const tbodyData = data?.map((role) => {
        return {
            roleCode: role.roleCode,
            roleDesc: role.roleDesc,
            remark: role.remark,
            createdAt: role.createdAt,
            createdBy: role.createdBy,
            updatedAt: role.updatedAt,
            updatedBy: role.updatedBy,
        }
    });

    return(
        <>
        <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
            <SectionTitle title="System Role" handleModal={openModal} />
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
                    
                    <TableList columns={column} data={tbodyData} />

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
            <Dialog open={Boolean(open)} handler={openModal} size="lg">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Role" : "Create Role"} handleClick={openModal} />
                    <form  className="flex flex-col py-1 px-3 gap-2">
                        <div className="grid grid-cols-3 mb-3 w-full">
                            {/* Username */}
                            <div>
                                <label className="text-black text-sm mb-2">Role Name</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.roleDesc}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            roleDesc: e.target.value
                                        });
                                    }}
                                />
                                {
                                    validationText.roleDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.roleDesc}</p>
                                }
                            </div>
                        </div>
                        {/* Remark */}
                        <div className="grid grid-cols-2">
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
                        </div>
                        <div className="flex justify-end ">
                            <div className="flex gap-2">
                                <label htmlFor="selectAll" className="flex items-center justify-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 text-black">
                                    <input 
                                        type="checkbox" 
                                        id="selectAll"
                                        name="selectAll"
                                        className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            setPermissionData(
                                                permissionData.map((permission) => {
                                                    return {
                                                        ...permission,
                                                        moduleCheck: e.target.checked,
                                                        view: e.target.checked,
                                                        create: e.target.checked,
                                                        update: e.target.checked,
                                                        delete: e.target.checked,
                                                    }
                                                })
                                            );
                                            setIsSelectAll(e.target.checked);
                                        }}
                                        checked={isSelectAll}
                                    />
                                    <span className="text-sm">Select All</span>
                                </label>
                                {/* <label htmlFor="unselectAll" className="flex items-center justify-center gap-2 py-1 px-2 rounded-md hover:bg-gray-100 text-black" onClick={() => {
                                    setSelectOption({
                                        isSelectAll: false,
                                        isUnselect: true,
                                    });
                                    unselectAll();
                                }}>
                                    <input 
                                        type="checkbox" 
                                        id="unselectAll"
                                        name="unselectAll"
                                        className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                        //checked={selectOption.isUnselect}
                                    />
                                    <span className="text-sm">Unselect All</span>
                                </label> */}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 h-[290px] overflow-auto">

                            {
                                permissionData?.map((el) => {
                                    return (
                                        <>
                                            <div className="col-span-4 flex items-center gap-2 mt-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                                    checked={el.moduleCheck}
                                                    onChange={(e) => {
                                                        setPermissionData(
                                                            permissionData.map((permission) => {
                                                                if (permission.moduleName === el.moduleName) {
                                                                    console.log(permission)
                                                                    return {
                                                                        ...permission,
                                                                        moduleCheck: e.target.checked,
                                                                        view: e.target.checked,
                                                                        create: e.target.checked,
                                                                        update: e.target.checked,
                                                                        delete: e.target.checked,
                                                                    }
                                                                } else {
                                                                    return permission
                                                                }
                                                            })
                                                        );
                                                    }}
                                                    id={el.moduleName}
                                                />
                                                <label className="text-black text-md font-bold" htmlFor={el.moduleName}>{el.moduleName}</label>
                                            </div>
                                            <div className="col-span-4 grid grid-cols-4 gap-2 py-3 px-5">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                                        checked={el.view}
                                                        onChange={(e) => {
                                                            setPermissionData(
                                                                permissionData.map((permission) => {
                                                                    if (permission.moduleName === el.moduleName) {
                                                                        console.log(permission)
                                                                        return {
                                                                            ...permission,
                                                                            moduleCheck: permission.create && permission.update && permission.delete && e.target.checked ? true: false,
                                                                            view: e.target.checked,
                                                                        }
                                                                    } else {
                                                                        return permission
                                                                    }
                                                                })
                                                            );
                                                        }}
                                                        id={`${el.moduleName}View`}
                                                    />
                                                    <label className="text-black text-sm" htmlFor={`${el.moduleName}View`}>View</label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                                        checked={el.create}
                                                        onChange={(e) => {
                                                            setPermissionData(
                                                                permissionData.map((permission) => {
                                                                    if (permission.moduleName === el.moduleName) {
                                                                        console.log(permission)
                                                                        return {
                                                                            ...permission,
                                                                            moduleCheck: permission.view && permission.update && permission.delete && e.target.checked ? true: false,
                                                                            create: e.target.checked,
                                                                        }
                                                                    } else {
                                                                        return permission
                                                                    }
                                                                })
                                                            );
                                                        }}
                                                        id={`${el.moduleName}Create`}
                                                    />
                                                    <label className="text-black text-sm" htmlFor={`${el.moduleName}Create`}>Create</label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                                        checked={el.update}
                                                        onChange={(e) => {
                                                            setPermissionData(
                                                                permissionData.map((permission) => {
                                                                    if (permission.moduleName === el.moduleName) {
                                                                        console.log(permission)
                                                                        return {
                                                                            ...permission,
                                                                            moduleCheck: permission.create && permission.view && permission.delete && e.target.checked ? true: false,
                                                                            update: e.target.checked,
                                                                        }
                                                                    } else {
                                                                        return permission
                                                                    }
                                                                })
                                                            );
                                                        }}
                                                        id={`${el.moduleName}Update`}
                                                    />
                                                    <label className="text-black text-sm" htmlFor={`${el.moduleName}Update`}>Update</label>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                                        checked={el.delete}
                                                        onChange={(e) => {
                                                            setPermissionData(
                                                                permissionData.map((permission) => {
                                                                    if (permission.moduleName === el.moduleName) {
                                                                        console.log(permission)
                                                                        return {
                                                                            ...permission,
                                                                            moduleCheck: permission.create && permission.update && permission.view && e.target.checked ? true: false,
                                                                            delete: e.target.checked,
                                                                        }
                                                                    } else {
                                                                        return permission
                                                                    }
                                                                })
                                                            );
                                                        }}
                                                        id={`${el.moduleName}Delete`}
                                                    />
                                                    <label className="text-black text-sm" htmlFor={`${el.moduleName}Delete`}>Delete</label>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }

                            

                        </div>
                        <div className="flex items-center justify-end mt-4 gap-2">
                            {
                                    isEdit ? <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                    <FaFloppyDisk className="text-base" /> 
                                    <Typography variant="small" className="capitalize">
                                        Update
                                    </Typography>
                                </Button> : 
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
            {/* <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} /> */}
        </div>
        
        </>
    );

}

export default SystemRole;
