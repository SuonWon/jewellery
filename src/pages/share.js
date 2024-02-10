/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input,Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useAddShareMutation, useFetchShareCountQuery, useFetchShareQuery, useRemoveShareMutation, useUpdateShareMutation } from "../store";
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

function Share() {

    const {permissions} = useContext(AuthContent);

    const [sharePermission, setSharePermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setSharePermission(permissions[10]);

        if(sharePermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, sharePermission, navigate])

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: ''
    });

    const {data, isLoading: dataLoad} = useFetchShareQuery(filterData);
    
    const {data:dataCount} = useFetchShareCountQuery(filterData); 

    const [addShare, addResult] = useAddShareMutation();

    const [editShare, updateResult] = useUpdateShareMutation();

    const [removeShare, removeResult] = useRemoveShareMutation();

    const [deleteId, setDeleteId] = useState('');

    const auth = useAuthUser();

    const [ validationText, setValidationText ] = useState({});

    const [ currentPage, setCurrentPage] = useState(1);

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
        isNew: false,
    });

    const shareInfo = {
        shareName: "",
        nrcNo: "",
        contactNo: "",
        street: "",
        township: "",
        city: "",
        region: "",
        remark: "",
        isActive: true,
        createdBy: auth().username,
        updatedBy: "",
    }

    const [formData, setFormData] = useState(shareInfo);

    const handleChange = async (e) => {
        
        let share = data.filter((share) => share.shareCode == e.target.id);
        await editShare({
            shareCode: share[0].shareCode,
            shareName: share[0].shareName,
            nrcNo: share[0].nrcNo,
            contactNo: share[0].contactNo,
            street: share[0].street,
            township: share[0].township,
            city: share[0].city,
            region: share[0].region,
            remark: share[0].remark,
            isActive: e.target.checked ? true: false,
            createdAt: share[0].createdAt,
            createdBy: share[0].createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Share updated successfully",
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
        setFormData(shareInfo);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};
        if(validator.isEmpty(formData.shareName.toString())) {
            newErrors.shareName = 'Share name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addShare(formData).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Share created successfully.",
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
                setFormData(shareInfo);
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
            addShare(formData).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Share created successfully.",
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
                setFormData(shareInfo);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const handleEdit = async (id) => {
        let eData = data.filter((share) => share.shareCode === id);
        setIsEdit(true);
        setFormData(eData[0]);
        setOpen(!open);
    };

    const submitEdit = async () => {
        editShare({
            ...formData,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then(async(res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Share updated successfully.",
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
        removeShare(id).then(async(res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Share deleted successfully.",
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
            name: 'Name',
            width: "200px",
            selector: row => row.name,
            
        },
        {
            name: 'NRC No',
            width: "200px",
            selector: row => row.nrcNo,
            
        },
        {
            name: 'Contact No',
            width: "150px",
            selector: row => row.contactNo,
            
        },
        {
            name: 'Street',
            width: "200px",
            selector: row => row.street,
            
        },
        {
            name: 'Township',
            width: "200px",
            selector: row => row.township,
            
        },
        {
            name: 'City',
            width: "200px",
            selector: row => row.city,
            
        },
        {
            name: 'Region',
            width: "200px",
            selector: row => row.region,
            
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
                        sharePermission?.update ? (
                            <div className="border-r border-gray-400 pr-2">
                                <div class="custom-checkbox">
                                    <input class="input-checkbox" checked={row.status} id={row.code} type="checkbox" onChange={handleChange} />
                                    <label for={row.code}></label>
                                </div>
                            </div>
                        ) : null
                    }
                    <Button 
                        variant="text" color="deep-purple" 
                        className="p-2" 
                        onClick={() => handleEdit(row.code)}
                    >
                        <FaPencil />
                    </Button>
                    {
                        sharePermission?.delete ? (
                            <Button 
                                variant="text" 
                                color="red" 
                                className="p-2" 
                                onClick={() => handleDeleteBtn(Number(row.code))}
                                disabled={row.isOwner}
                            >
                                <FaTrashCan />
                            </Button>
                        ) : null
                    }
                </div>
            )
        },
    ];

    const tbodyData = data?.map((share) => {
        return {
            code: share.shareCode,
            name: share.shareName,
            nrcNo: share.nrcNo,
            contactNo: share.contactNo,
            street: share.street,
            township: share.township,
            city: share.city,
            region: share.region,
            createdAt: moment(share.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: share.createdBy,
            updatedAt: moment(share.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: share.updatedBy,
            remark: share.remark,
            status: share.isActive,
            isOwner: share.isOwner,
        }
    });

    return(
        <>
        {
            sharePermission != null && sharePermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                        }
                    </div>
                    <SectionTitle title="Share" handleModal={openModal} permission={sharePermission?.create}/>
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
                            <ModalTitle titleName={isEdit ? "Edit Share" : "Create Share"} handleClick={openModal} />
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                            }
                            <form  className="flex flex-col items-end p-3 gap-2">
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    {/* Share Name */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Share Name</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.shareName}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    shareName: e.target.value
                                                });
                                            }}
                                        />
                                        {
                                            validationText.shareName && <p className="block text-[12px] text-red-500 font-sans">{validationText.shareName}</p>
                                        }
                                    </div>
                                    {/* NRC No */}
                                    <div>
                                        <label className="text-black text-sm mb-2">NRC No</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.nrcNo}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData,
                                                    nrcNo: e.target.value
                                                });
                                            }}
                                        />
                                    </div>
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
                                                    contactNo: e.target.value
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 w-full">
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
                                                    street: e.target.value
                                                });
                                            }}
                                        />
                                    </div>
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
                                                    township: e.target.value
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
                                                    city: e.target.value
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
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
                                                    region: e.target.value
                                                });
                                            }}
                                        />
                                    </div>
                                    {/* Remark */}
                                    <div className="col-span-2 h-fit">
                                        <label className="text-black mb-2 text-sm">Remark</label>
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
                                <div className="flex items-center justify-end mt-6 gap-2">
                                    {
                                        isEdit ? (
                                            sharePermission?.update ? (
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
                                                        isNew: false
                                                    })
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
                                                        isNew: true,
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

export default Share;
