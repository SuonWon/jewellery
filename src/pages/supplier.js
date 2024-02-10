/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useFetchSupplierQuery, useAddSupplierMutation, useUpdateSupplierMutation, useRemoveSupplierMutation, useFetchSupplierCountQuery } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { AuthContent } from "../context/authContext";
import { pause } from "../const";
import SuccessAlert from "../components/success_alert";
import ButtonLoader from "../components/buttonLoader";
const validator = require("validator");

function Supplier() {

    const { permissions } = useContext(AuthContent);

    const [supPermission, setSupPermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setSupPermission(permissions[7]);

        if(supPermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, supPermission, navigate])

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: ''
    });

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
        isNew: false,
    });

    const {data, isLoading: dataLoad} = useFetchSupplierQuery(filterData);

    const {data:dataCount} = useFetchSupplierCountQuery(filterData);

    const [addSupplier, addResult] = useAddSupplierMutation();

    const [editSupplier, updateResult] = useUpdateSupplierMutation();

    const [removeSupplier, removeResult] = useRemoveSupplierMutation();

    const [deleteId, setDeleteId] = useState('');

    const auth = useAuthUser();

    const [ validationText, setValidationText ] = useState({});

    const [ currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        supplierName: "",
        contactName: "",
        contactNo: "",
        officeNo: "",
        street: "",
        township: "",
        city: "",
        region: "",
        remark: "",
        isActive: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
        updatedAt: moment().toISOString(),
        updatedBy: "",
    });

    const resetData = () => {
        setFormData({
            supplierName: "",
            contactName: "",
            contactNo: "",
            officeNo: "",
            street: "",
            township: "",
            city: "",
            region: "",
            remark: "",
            isActive: true,
            createdAt: moment().toISOString(),
            createdBy: auth().username,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        });
    }

    const handleChange = async (e) => {
        
        let supplier = data.filter((supplier) => supplier.supplierCode == e.target.id);
        await editSupplier({
            supplierCode: supplier[0].supplierCode,
            supplierName: supplier[0].supplierName,
            contactName: supplier[0].contactName,
            contactNo: supplier[0].contactNo,
            officeNo: supplier[0].officeNo,
            street: supplier[0].street,
            township: supplier[0].township,
            city: supplier[0].city,
            region: supplier[0].region,
            remark: supplier[0].remark,
            isActive: e.target.checked ? true: false,
            createdAt: supplier[0].createdAt,
            createdBy: supplier[0].createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        }).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Supplier updated successfully.",
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
        resetData();
        setValidationText([]);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};
        if(validator.isEmpty(formData.supplierName.toString())) {
            newErrors.supplierName = 'Supplier name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addSupplier(formData).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Supplier created successfully.",
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
                resetData();
                setOpen(!open);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const onSaveSubmit = async () => {
        if (validateForm()) {
            addSupplier(formData).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Supplier created successfully.",
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
                resetData();
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const handleEdit = async (id) => {
        let eData = data.filter((supplier) => supplier.supplierCode === id);
        setIsEdit(true);
        setFormData(eData[0]);
        setValidationText([]);
        setOpen(!open);
    };

    const submitEdit = async () => {
        editSupplier({
            ...formData,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then(async(res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Supplier updated successfully.",
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
            setOpen(!open);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        });
    };

    const handleRemove = async (id) => {
        removeSupplier(id).then(async(res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Supplier deleted successfully.",
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
            setOpenDelete(!openDelete);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        });
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const column = [
        {
            name: 'Status',
            width: "150px",
            center: "true",
            cell: row => (
                <div className={`w-[90px] flex items-center justify-center text-white h-7 rounded-full ${row.Status ? 'bg-green-500' : 'bg-red-500' } `}>
                    {
                        row.Status ? 'Active' : 'Inactive'
                    }
                </div>
            ),
        },
        {
            name: 'Name',
            width: "200px",
            selector: row => row.Name,
            
        },
        {
            name: 'Contact Name',
            width: "200px",
            selector: row => row.ContactName,
            
        },
        {
            name: 'Contact No',
            width: "150px",
            selector: row => row.ContactNo,
            
        },
        {
            name: 'Office No',
            width: "150px",
            selector: row => row.OfficeNo,
            
        },
        {
            name: 'Street',
            width: "200px",
            selector: row => row.Street,
            
        },
        {
            name: 'Township',
            width: "200px",
            selector: row => row.Township,
            
        },
        {
            name: 'City',
            width: "200px",
            selector: row => row.City,
            
        },
        {
            name: 'Region',
            width: "200px",
            selector: row => row.Region,
            
        },
        {
            name: 'Created At',
            width: "200px",
            selector: row => row.CreatedAt,
        },
        {
            name: 'Updated At',
            width: "200px",
            selector: row => row.UpdatedAt,
        },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.Remark,
        },
        {
            name: 'Action',
            center: "true",
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {
                        supPermission?.update ? (
                            <div className="border-r border-gray-400 pr-2">
                                <div class="custom-checkbox">
                                    <input class="input-checkbox" checked={row.Status} id={row.Code} type="checkbox" onChange={handleChange} />
                                    <label for={row.Code}></label>
                                </div>
                                {/* <p className="text-black">{row.Status ? "T" : "F"}</p>
                                <input type="checkbox" checked={row.Status} id={row.Code} onChange={handleChange} /> */}
                                {/* <Switch color="deep-purple" defaultChecked={row.Status} id={row.Code} onChange={handleChange} /> */}
                            </div>
                        ) : null
                    }
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)}><FaPencil /></Button>
                    {
                        supPermission?.delete ? (
                            <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                        ) : null
                    }
                </div>
            )
        },
    ];

    const tbodyData = data?.map((supplier) => {
        return {
            Code: supplier.supplierCode,
            Name: supplier.supplierName,
            ContactName: supplier.contactName,
            ContactNo: supplier.contactNo,
            OfficeNo: supplier.officeNo,
            Street: supplier.street,
            Township: supplier.township,
            City: supplier.city,
            Region: supplier.region,
            CreatedAt: moment(supplier.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: supplier.createdBy,
            UpdatedAt: moment(supplier.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: supplier.updatedBy,
            Remark: supplier.remark,
            Status: supplier.isActive,
        }
    });

    return(
        <>
        {
            supPermission != null && supPermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                        }
                    </div>
                    <SectionTitle title="Suppliers" handleModal={openModal} permission={supPermission?.create}/>
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
                    <Dialog open={Boolean(open)} handler={openModal} size="lg">
                        <DialogBody>
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                            }
                            <ModalTitle titleName={isEdit ? "Edit Supplier" : "Create Supplier"} handleClick={openModal} />
                            <form  className="flex flex-col p-3 gap-2">
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    {/* Name */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Name</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.supplierName}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    supplierName: e.target.value,
                                                });
                                            }}
                                        />
                                        {
                                            validationText.supplierName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.supplierName}</p>
                                        }
                                    </div>
                                    {/* Contact Name */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Contact Name</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.contactName}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    contactName: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 w-full">
                                    {/* Contact No */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Contact No</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.contactNo}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    contactNo: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    {/* Office No */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Office No</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.officeNo}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    officeNo: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    {/* Street */}
                                    <div className="col-span-2">
                                        <label className="text-black text-sm mb-2">Street</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.street}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    street: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    {/* Township */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Township</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.township}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    township: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    {/* City */}
                                    <div>
                                        <label className="text-black text-sm mb-2">City</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.city}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    city: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    {/* Region */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Region</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.region}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    region: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* Remark */}
                                <div>
                                    <label className="text-black text-sm mb-2">Remark</label>
                                    <textarea
                                        type="text"
                                        className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.remark}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData, 
                                                remark: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-end mt-6 gap-2">
                                    {
                                        isEdit ? (
                                            supPermission?.update ? (
                                                <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2" disabled={updateResult.isLoading}>
                                                    {
                                                        updateResult.isLoading? <ButtonLoader /> : <FaFloppyDisk className="text-base" /> 
                                                    }
                                                    <Typography variant="small" className="capitalize">
                                                        Update
                                                    </Typography>
                                                </Button>
                                            ) : null
                                        ) : 
                                        <>
                                            <Button 
                                                onClick={() => {
                                                    onSubmit();
                                                    setAlertMsg({
                                                        ...alertMsg,
                                                        isNew: false,
                                                    });
                                                }} 
                                                color="deep-purple" size="sm" variant="gradient" 
                                                className="flex items-center gap-2"
                                                disabled={addResult.isLoading}
                                            >
                                                {
                                                    addResult.isLoading && !alertMsg.isNew ? <ButtonLoader /> : <FaFloppyDisk className="text-base" /> 
                                                } 
                                                <Typography variant="small" className="capitalize">
                                                    Save
                                                </Typography>
                                            </Button>
                                            <Button 
                                                onClick={() => {
                                                    onSaveSubmit();
                                                    setAlertMsg({
                                                        ...alertMsg,
                                                        isNew: true
                                                    })
                                                }} 
                                                color="deep-purple" size="sm" variant="outlined" 
                                                className="flex items-center gap-2"
                                                disabled={addResult.isLoading}
                                            >
                                                {
                                                    addResult.isLoading && alertMsg.isNew ? <ButtonLoader isNew={true} /> : <FaCirclePlus className="text-base" />
                                                }
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
                    <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} isLoading={removeResult.isLoading} closeModal={() => setOpenDelete(!openDelete)} />
                </div>
            ) : null
        }
        
        </>
    );

}

export default Supplier;
