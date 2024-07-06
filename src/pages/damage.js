/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaPlus, FaTrashCan, } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { apiUrl, focusSelect, pause } from "../const";
import { useAddDamageMutation, useFetchActiveStoneDetailsQuery, useFetchDamageQuery, useFetchTruePurchaseQuery, useFetchUOMQuery, useRemoveDamageMutation, useUpdateDamageMutation, } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContent } from "../context/authContext";
import { useFetchDamageCountQuery } from "../apis/damageApi";
import ButtonLoader from "../components/buttonLoader";



const validator = require('validator');

function Damage() {

    const {permissions} = useContext(AuthContent);

    const token = 'Bearer ' + Cookies.get('_auth');

    const [damagePermission, setDamagePermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setDamagePermission(permissions[18]);

        if(damagePermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, damagePermission, navigate])

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        status: 'A',
        search_word: '',
        start_date: null,
        end_date: null
    });

    const { data, isLoading: dataLoad, refetch } = useFetchDamageQuery(filterData);

    const { data: dataCount } = useFetchDamageCountQuery(filterData);

    const {data: stoneDetails} = useFetchActiveStoneDetailsQuery();

    const {data: unitData} = useFetchUOMQuery();

    const {data: purchaseData} = useFetchTruePurchaseQuery();

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [isEdit, setIsView] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [selectedStoneDetails, setSelectedStoneDetails] = useState([]);

    // const [damageId, setDamageId] = useState("");

    const [removeDamage, removeResult] = useRemoveDamageMutation();

    const [addDamage, addResult] = useAddDamageMutation();

    const [updateDamage, updateResult] = useUpdateDamageMutation();

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        refetch();
    }, [data]);

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
        isNew: false,
    });

    const damageData = {
        damageNo: "",
        damageDate: moment().format("YYYY-MM-DD"),
        referenceNo: "",
        stoneDetailCode: "",
        qty: 0,
        weight: 0,
        unitCode: 'ct',
        unitPrice: 0,
        totalPrice: 0,
        remark: "",
        status: "O",
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
    };

    const [formData, setFormData] = useState(damageData);

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.damageNo === id);
        removeDamage({
            id: removeData[0].damageNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then(async(res) => { 
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Damage data deleted successfully",
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

    const handleOpen = () => {
        setFormData(damageData);
        setIsView(false);
        setOpen(!open);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.damageNo === id);
        let selectedStoneD = stoneDetails.filter(el => el.referenceNo === tempData.referenceNo);
        setSelectedStoneDetails(selectedStoneD);
        setFormData(tempData);
        setIsView(true);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if (formData.damageDate === "") {
            newErrors.damageDate = "Damage Date is required."
        }

        if (validator.isEmpty(formData.stoneDetailCode)) {
            newErrors.stoneDetailCode = "Stone Detail is required."
        }
        
        if (validator.isEmpty(formData.unitCode)) {
            newErrors.unitCode = "Unit is required."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const handleSubmit = async () => {
        if (validateForm()) {
            var damageId = '';
    
            await axios.get(apiUrl + '/damage/get-id', {
                headers: {
                    "Authorization": token
                }
            }).then((res) => {
                damageId = res.data;
            });
    
            addDamage({
                ...formData,
                damageNo: damageId,
                damageDate: moment(formData.damageDate).toISOString(),
            }).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Damage data created successfully",
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
                setFormData(damageData);
                setOpen(!open);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const handleSave = async () => {
        if (validateForm()) {
            var damageId = '';
    
            await axios.get(apiUrl + '/damage/get-id', {
                headers: {
                    "Authorization": token
                }
            }).then((res) => {
                damageId = res.data;
            });
    
            addDamage({
                ...formData,
                damageNo: damageId,
                damageDate: moment(formData.damageDate).toISOString(),
            }).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Damage data created successfully",
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
                setFormData(damageData);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const handleUpdate = async () => {
        if (validateForm()) {
            console.log(formData);
            updateDamage({
                damageNo: formData.damageNo,
                damageDate: formData.damageDate,
                referenceNo: formData.referenceNo,
                stoneDetailCode: formData.stoneDetailCode,
                qty: formData.qty,
                weight: formData.weight,
                unitCode: formData.unitCode,
                unitPrice: formData.unitPrice,
                totalPrice: formData.totalPrice,
                remark: formData.remark,
                status: formData.status,
                createdBy: formData.createdBy,
                createdAt: formData.createdDate,
                updatedBy: auth().username,
                updatedAt: moment().toISOString(),
                deletedBy: "",
            }).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Damage data updated successfully",
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
                setFormData(damageData);
                setOpen(!open);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const column = [
        {
            name: 'Status',
            width: '200px',
            selector: row => row.status === 'O' ? 
                <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                    Open
                </div>
                : row.status === 'V' ? 
                    <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                        Void
                    </div> 
                : row.status === 'F' ? 
                    <div className="bg-blue-500 px-3 py-[5px] text-white rounded-xl">
                        Complete
                    </div> :
                    <div className="bg-orange-500 px-3 py-[5px] text-white rounded-xl">
                        Closed
                    </div>,
            center: 'true'
        },
        {
            name: 'Damage No',
            width: '200px',
            selector: row => row.damageNo,
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => row.damageDate,
        },
        {
            name: 'Reference No',
            width: "200px",
            selector: row => row.referenceNo,
        },
        {
            name: 'Stone Detail',
            width: "200px",
            selector: row => row.stoneDetail,
        },
        {
            name: 'Qty',
            width: "150px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "150px",
            selector: row => row.weight,
            center: "true"
        },
        {
            name: 'Unit',
            width: "150px",
            selector: row => row.unit,
            center: "true"
        },
        {
            name: 'Unit Price',
            width: "150px",
            selector: row => row.unitPrice,
            right: "true"
        },
        {
            name: 'Total Price',
            width: "150px",
            selector: row => row.totalPrice,
            right: "true"
        },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.remark,
        },
        // {
        //     name: 'Created At',
        //     width: "200px",
        //     selector: row => row.createdAt,
        // },
        // {
        //     name: 'Updated At',
        //     width: "200px",
        //     selector: row => row.updatedAt,
        // },
        {
            name: 'Action',
            center: "true",
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <Link to={`/purchase_edit/${row.Code}`}>
                        <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
                    </Link> */}
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.damageNo)}><FaPencil /></Button>
                    {
                        damagePermission?.delete ? (
                            <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.damageNo)}><FaTrashCan /></Button>
                        ) : null
                    }
                </div>
            )
        },
    ];

    const tbodyData = data?.map((damageData) => {
        return {
            damageNo: damageData.damageNo,
            damageDate: moment(damageData.damageDate).format("YYYY-MM-DD"),
            referenceNo: damageData.referenceNo,
            stoneDetail: damageData.stoneDetailCode,
            qty: damageData.qty.toLocaleString('en-US'),
            weight: damageData.weight.toLocaleString('en-US'),
            unit: damageData.unitCode,
            unitPrice: damageData.unitPrice.toLocaleString('en-US'),
            totalPrice: damageData.unitPrice.toLocaleString('en-US'),
            remark: damageData.remark,
            createdAt: moment(damageData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: damageData.createdBy,
            updatedAt: moment(damageData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: damageData.updatedBy,
            status: damageData.status,
        }
    });

    return (
        <>
        {
            damagePermission != null && damagePermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                        }
                    </div>
                    <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                        <Typography variant="h5">
                            Damage List
                        </Typography>
                        {
                            damagePermission?.create ? (
                                <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                                    <FaPlus /> Create New
                                </Button>
                            ) : null
                        }
                    </div>
                    <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                        <CardBody className="rounded-sm overflow-auto p-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2 py-2">
                                <div>
                                    <label className="text-black text-sm mb-2">Status</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={filterData.status}
                                        onChange={(e) => {
                                            setFilterData({
                                                ...filterData,
                                                skip: 0,
                                                take: 10,
                                                status: e.target.value
                                            })
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="A">All</option>
                                        <option value="O">Open</option>
                                        <option value="C">Close</option>
                                        <option value="V">Void</option>
                                    </select>
                                </div>
                                <div className="">
                                    <label className="text-black mb-2 text-sm">Start Date</label>
                                    <input
                                        type="date"
                                        value={filterData.start_date == null ? '' : filterData.start_date}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            // if (filterData.start_date !== "") {
                                            //     if(moment(e.target.value) > moment(filterData.start_date)) {
                                            //         console.log(e.target.value)
                                            //         // setAlert({
                                            //         //     isAlert: true,
                                            //         //     message: "Start Date cannot be greater than End Date.",
                                            //         //     isWarning: true,
                                            //         //     title: "Warning"
                                            //         // });
                                            //         // setTimeout(() => {
                                            //         //     setAlert({
                                            //         //         isAlert: false,
                                            //         //         message: '',
                                            //         //         isWarning: false,
                                            //         //         title: ''
                                            //         //     })
                                            //         // }, 2000);
                                            //     } else {
                                            //         setFilterData({
                                            //             ...filterData,
                                            //             skip: 0,
                                            //             take: 10,
                                            //             start_date: e.target.value,
                                            //         });
                                            //     }
                                            // } else {
                                                setFilterData({
                                                    ...filterData,
                                                    skip: 0,
                                                    take: 10,
                                                    start_date: e.target.value,
                                                });
                                                setCurrentPage(1);
                                            // }
                                        }}
                                    />
                                </div>
                                <div className="">
                                    <label className="text-black mb-2 text-sm">End Date</label>
                                    <input
                                        type="date"
                                        value={filterData.end_date == null ? '' : filterData.end_date}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            // if(filterData.end_date === "" || moment(e.target.value) < moment(filterData.end_date)) {
                                            //     // setAlert({
                                            //     //     isAlert: true,
                                            //     //     message: "Start Date cannot be greater than End Date.",
                                            //     //     isWarning: true,
                                            //     //     title: "Warning"
                                            //     // });
                                            //     // setTimeout(() => {
                                            //     //     setAlert({
                                            //     //         isAlert: false,
                                            //     //         message: '',
                                            //     //         isWarning: false,
                                            //     //         title: ''
                                            //     //     })
                                            //     // }, 2000);
                                                
                                            //     return; 
                                            // }
                                            setFilterData({
                                                ...filterData,
                                                skip: 0,
                                                take: 10,
                                                end_date: e.target.value,
                                            });
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-black mb-2 text-sm">Search</label>
                                    <input
                                        placeholder="Search" 
                                        type="text" 
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={filterData.search} onChange={(e) => {
                                            setFilterData({
                                                ...filterData,
                                                skip: 0,
                                                take: 10,
                                                search_word: e.target.value
                                            });
                                            setCurrentPage(1);
                                        }}
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
                    <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} isLoading={removeResult.isLoading} closeModal={() => setOpenDelete(!openDelete)} />
                    <Dialog open={open} size="lg">
                        <DialogBody>
                            <ModalTitle titleName={isEdit ? "Edit Damage" : "Create Damage"} handleClick={() => setOpen(!open)} />
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                            }
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {
                                    isEdit? 
                                    <div>
                                        {/* Damage No */}
                                        <label className="text-black text-sm mb-2">Damage No</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.damageNo}
                                            readOnly={isEdit}
                                        />
                                    </div> : 
                                    <div className="col-span-2">
                                        {/* Reference No */}
                                        <label className="text-black text-sm mb-2">Reference No</label>
                                        <select 
                                            className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                            value={formData.referenceNo}
                                            onChange={(e) => {
                                                let stoneDetail = stoneDetails.filter(el => el.referenceNo === e.target.value);
                                                setSelectedStoneDetails(stoneDetail);
                                                setFormData({
                                                    ...formData, 
                                                    referenceNo: e.target.value,
                                                });
                                            }}
                                        >
                                            <option value="" disabled>Select...</option>
                                            {
                                                purchaseData?.map((purchase) => {
                                                    return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo} ({purchase.supplier.supplierName}, {purchase.stone.stoneDesc})</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                        }
                                    </div>
                                }
                                
                                {/* Damage Date */}
                                <div className="col-start-4 col-end-4">
                                    <label className="text-black mb-2 text-sm">Damage Date</label>
                                    <input
                                        type="date"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={moment(formData.damageDate).format("YYYY-MM-DD")}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            damageDate: e.target.value
                                        })}
                                    />
                                    {
                                        validationText.damageDate && <p className="block text-[12px] text-red-500 font-sans">{validationText.damageDate}</p>
                                    }
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {
                                    isEdit? 
                                    <div className="col-span-2">
                                        {/* Reference No */}
                                        <label className="text-black text-sm mb-2">Reference No</label>
                                        <select 
                                            className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                            value={formData.referenceNo}
                                            onChange={(e) => {
                                                let stoneDetail = stoneDetails.filter(el => el.referenceNo === e.target.value);
                                                setSelectedStoneDetails(stoneDetail);
                                                setFormData({
                                                    ...formData, 
                                                    referenceNo: e.target.value
                                                });
                                            }}
                                        >
                                            <option value="" disabled>Select...</option>
                                            {
                                                purchaseData?.map((purchase) => {
                                                    return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo} ({purchase.supplier.supplierName}, {purchase.stone.stoneDesc})</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                        }
                                    </div> : ""
                                }
                                {/* Stone Details */}
                                <div className="col-span-2">
                                    <label className="text-black mb-2 text-sm">Stone Details</label>
                                    <select 
                                        className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                        value={formData.stoneDetailCode} 
                                        onChange={(e) => 
                                            setFormData({
                                                ...formData, 
                                                stoneDetailCode: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="" disabled>Select stone detail</option>
                                        {
                                            selectedStoneDetails?.length === 0? 
                                            stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                            stoneDetails?.map((stoneDetail) => {
                                                return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc} ({stoneDetail.supplier.supplierName})</option>
                                            }) : stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                            selectedStoneDetails?.map((stoneDetail) => {
                                                return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc} ({stoneDetail.supplier.supplierName})</option>
                                            })
                                        }
                                    </select>
                                    {
                                        validationText.stoneDetailCode && <p className="block text-[12px] text-red-500 font-sans">{validationText.stoneDetailCode}</p>
                                    } 
                                </div>
                                
                            </div>
                            <div className="grid grid-cols-6 gap-2 mb-3">
                                <div className="col-span-3 gap-2 grid grid-cols-3">
                                    {/* Qty */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Qty</label>
                                        <input
                                            type="number"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.qty}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    qty: Math.floor(Number(e.target.value)),
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                    </div>
                                    {/* Weight */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Weight</label>
                                        <input
                                            type="number"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.weight}
                                            onChange={(e) => {
                                                let weight = parseFloat(e.target.value);
                                                setFormData({
                                                    ...formData, 
                                                    weight: weight,
                                                    totalPrice: formData.unitPrice * weight,
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                    </div>
                                    {/* Unit */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Unit</label>
                                        <select 
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                            value={formData.unitCode}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    unitCode: e.target.value,
                                                });
                                            }}
                                        >
                                            <option value=""  disabled>Select Unit</option>
                                            {
                                                unitData?.map((unit) => {
                                                    return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitCode}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.unitCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.unitCode}</p>
                                        }
                                    </div>
                                </div>
                                <div className="col-span-3 gap-2 grid grid-cols-2">
                                    {/* Unit Price */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Unit Price</label>
                                        <input
                                            type="number"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.unitPrice}
                                            onChange={(e) => {
                                                let price = parseFloat(e.target.value);
                                                setFormData({
                                                    ...formData, 
                                                    unitPrice: price,
                                                    totalPrice: formData.weight * price,
    
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                            readOnly
                                        />
                                    </div>
                                    {/* Total Price */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Total Price</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-right"
                                            value={formData.totalPrice.toLocaleString('en')}
                                            onChange={(e) => {
                                                let totalP = Number(e.target.value === "" ? 0 : e.target.value.replace(/[^0-9]/g, ""));
                                                let price = totalP / formData.weight;
                                                setFormData({
                                                    ...formData,
                                                    unitPrice: Number(price.toFixed(2)),
                                                    totalPrice: totalP
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                                {/* Remark */}
                                <div className="grid col-span-3 h-fit">
                                    <label className="text-black mb-2 text-sm">Remark</label>
                                    <textarea
                                        className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.remark}
                                        rows="2"
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
                                    isEdit? (
                                        damagePermission?.update ? (
                                            <Button onClick={handleUpdate} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2" disabled={updateResult.isLoading}>
                                                {
                                                    updateResult.isLoading? <ButtonLoader /> : <FaFloppyDisk className="text-base" /> 
                                                }
                                                <Typography variant="small" className="capitalize">
                                                    Update
                                                </Typography>
                                            </Button> 
                                        ) : null
                                    ): 
                                    <>
                                        <Button 
                                            onClick={() => {
                                                handleSubmit();
                                                setAlertMsg({
                                                    ...alertMsg,
                                                    isNew: false
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
                                                handleSave();
                                                setAlertMsg({
                                                    ...alertMsg,
                                                    isNew: true
                                                });
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
                        </DialogBody>
                    </Dialog>
                </div>
            ) : <div>Loading...</div>
        }
        </>
    );

}

export default Damage;
