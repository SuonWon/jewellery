/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaEye, FaFloppyDisk, FaPencil, FaPlus, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { apiUrl, focusSelect, pause } from "../const";
import { useAddReturnMutation, useFetchActiveStoneDetailsQuery, useFetchIssueQuery, useFetchReturnCountQuery, useFetchReturnQuery, useFetchStoneDetailsQuery, useFetchTruePurchaseQuery, useFetchTrueSalesQuery, useFetchUOMQuery, useRemoveReturnMutation, useUpdateReturnMutation } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import axios from "axios";
import { useFetchTrueIssueQuery } from "../apis/issueApi";
const validator = require('validator');

function ReturnList({type = 'I'}) {

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        status: 'A',
        return_type: type,
        search_word: '',
        start_date: null,
        end_date: null
    });

    const { data } = useFetchReturnQuery(filterData);
    const { data:dataCount } = useFetchReturnCountQuery(filterData);

    const {data: stoneDetails} = useFetchActiveStoneDetailsQuery();

    const {data: unitData} = useFetchUOMQuery();

    const {data: issueData} = useFetchTrueIssueQuery();

    const {data: salesData} = useFetchTrueSalesQuery();

    const {data: purchaseData} = useFetchTruePurchaseQuery();

    axios.get(apiUrl + '/return/get-id').then((res) => {
        setReturnId(res.data);
    });

    const [removeReturn, removeResult] = useRemoveReturnMutation();

    const [addReturn] = useAddReturnMutation();

    const [updateReturn] = useUpdateReturnMutation();

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [returnId, setReturnId] = useState("");

    const [openDelete, setOpenDelete] = useState(false);

    const [purchaseStoneD, setPurchaseStoneD] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [isAlert, setIsAlert] = useState(true);

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: ''
    });

    const returnData = {
        returnNo: "",
        returnDate: moment().format("YYYY-MM-DD"),
        referenceNo: "",
        returnType: type,
        stoneDetailCode: 0,
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

    const [formData, setFormData] = useState(returnData);

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removeReturn({
            id: removeData[0].invoiceNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => { console.log(res) });
        setIsAlert(true);
        setOpenDelete(!openDelete);
        await pause(2000);
        setIsAlert(false);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const handleOpen = () => {
        setFormData(returnData);
        setIsEdit(false);
        setOpen(!open);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.returnNo === id);
        console.log(tempData);
        setFormData(tempData);
        setIsEdit(true);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if (formData.returnDate === "") {
            newErrors.returnData = "Return Date is required."
        }

        if (formData.referenceNo === "") {
            newErrors.referenceNo = "Reference No is required."
        }

        if (formData.stoneDetailCode === 0) {
            newErrors.stoneDetailCode = "Stone Detail is required."
        }
        
        if (validator.isEmpty(formData.unitCode)) {
            newErrors.unitCode = "Unit is required."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const handleSubmit = () => {
        if (validateForm()) {
            try {
                console.log(formData);
                addReturn({
                    ...formData,
                    returnNo: returnId,
                    returnDate: moment(formData.returnDate).toISOString(),
                }).then((res) => {
                    if(res.error != null) {
                        let message = '';
                        if(res.error.data.statusCode == 409) {
                            message = "Duplicate data found."
                        }
                        else {
                            message = res.error.data.message
                        }
                        setAlert({
                            isAlert: true,
                            message: message
                        })
                        setTimeout(() => {
                            setAlert({
                                isAlert: false,
                                message: ''
                            })
                        }, 2000);
                    }
                    
                });
                setFormData(returnData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(returnData);
            setOpen(!open);
        }
    }

    const handleSave = () => {
        if (validateForm()) {
            try {
                addReturn({
                    ...formData,
                    returnNo: returnId,
                    returnDate: moment(formData.returnDate).toISOString(),
                }).then((res) => {
                    if(res.error != null) {
                        let message = '';
                        if(res.error.data.statusCode == 409) {
                            message = "Duplicate data found."
                        }
                        else {
                            message = res.error.data.message
                        }
                        setAlert({
                            isAlert: true,
                            message: message
                        })
                        setTimeout(() => {
                            setAlert({
                                isAlert: false,
                                message: ''
                            })
                        }, 2000);
                    }
                    
                });
                setFormData(returnData);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(returnData);
        }
    }

    const handleUpdate = () => {
        if (validateForm()) {
            try {
                console.log(formData);
                updateReturn({
                    returnNo: formData.returnNo,
                    returnDate: formData.returnDate,
                    referenceNo: formData.referenceNo,
                    stoneDetailCode: formData.stoneDetailCode,
                    returnType: formData.returnType,
                    qty: formData.qty,
                    weight: formData.weight,
                    unitCode: formData.unitCode,
                    unitPrice: formData.unitPrice,
                    totalPrice: formData.totalPrice,
                    remark: formData.remark,
                    status: formData.status,
                    createdBy: formData.createdBy,
                    createdAt: formData.createdAt,
                    updatedBy: auth().username,
                    updatedAt: moment().toISOString(),
                    deletedBy: "",
                }).then((res) => {
                    if(res.error != null) {
                        let message = '';
                        if(res.error.data.statusCode == 409) {
                            message = "Duplicate data found."
                        }
                        else {
                            message = res.error.data.message
                        }
                        setAlert({
                            isAlert: true,
                            message: message
                        })
                        setTimeout(() => {
                            setAlert({
                                isAlert: false,
                                message: ''
                            })
                        }, 2000);
                    }
                    
                });
                setFormData(returnData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(returnData);
            setOpen(!open);
        }
    };

    const column = [
        {
            name: 'Status',
            width: '150px',
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
            name: 'Return No',
            width: '200px',
            selector: row => row.returnNo,
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => row.returnDate,
        },
        {
            name: 'Reference No',
            width: "200px",
            selector: row => row.referenceNo,
        },
        {
            name: 'Type',
            width: "120px",
            selector: row => row.returnType === 'I' ? "Issue" : row.returnType === 'S' ? "Sales" : "Purchase",
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
            selector: row => row.unitCode,
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
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.returnNo)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.returnNo)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((returnData) => {
        return {
            returnNo: returnData.returnNo,
            returnDate: moment(returnData.returnDate).format("YYYY-MM-DD"),
            referenceNo: returnData.referenceNo,
            stoneDetail: returnData.stoneDetailCode,
            qty: returnData.qty.toLocaleString('en-US'),
            weight: returnData.weight.toLocaleString('en-US'),
            unitCode: returnData.unitCode,
            returnType: returnData.returnType,
            unitPrice: returnData.unitPrice.toLocaleString('en-US'),
            totalPrice: returnData.totalPrice.toLocaleString('en-US'),
            Remark: returnData.remark,
            createdAt: moment(returnData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: returnData.createdBy,
            updatedAt: moment(returnData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: returnData.updatedBy,
            status: returnData.status,
        }
    });

    return (
        <>
            <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                <div className="w-78 absolute top-0 right-0 z-[9999]">
                    {
                        removeResult.isSuccess && isAlert && <SuccessAlert title="Purchase" message="Delete successful." handleAlert={() => setIsAlert(false)} />
                    }
                </div>
                <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h5">
                        {type === 'I' ? "Issue" : type === 'S' ? "Sales" : "Purchase"} Return List
                    </Typography>
                    <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                        <FaPlus /> Create New
                    </Button>
                </div>
                <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                    <CardBody className="rounded-sm overflow-auto p-0">
                        <div className="grid grid-cols-6 gap-2 py-2">
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
                <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                <Dialog open={open} size="lg">
                    <DialogBody>
                        <ModalTitle
                            titleName={
                                isEdit? `Edit ${formData.returnType === 'I' ? "Issue" : formData.returnType === 'S' ? "Sales" : "Purchase"} Return` : 
                                `Create ${formData.returnType === 'I' ? "Issue" : formData.returnType === 'S' ? "Sales" : "Purchase"} Return`
                            } 
                            handleClick={() => setOpen(!open)} 
                        />
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {
                                isEdit? 
                                <div>
                                    {/* Return No */}
                                    <label className="text-black text-sm mb-2">Return No</label>
                                    <input
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.returnNo}
                                        readOnly={isEdit}
                                    />
                                </div> : ""
                                
                            }
                            {/* Return Type */}
                            <div>
                            <label className="text-black text-sm mb-2">Return No</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.returnType === 'I' ? "Issue Return" : formData.returnType === 'S' ? "Sales Return" : "Purchase Return"}
                                    readOnly
                                />
                            </div>
                            {/* <div>
                                <label className="text-black mb-2 text-sm">Return Type</label>
                                <select 
                                    className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                    value={formData.returnType} 
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData, 
                                            returnType: e.target.value,
                                        })
                                    }}
                                    >
                                    <option value="I">Issue Return</option>
                                    <option value="S">Sales Return</option>
                                </select>
                            </div> */}
                            {/* Reference No */}
                            {/* <div className="col-span-2">
                                <label className="text-black text-sm mb-2">Reference No</label>
                                <select 
                                    className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                    value={formData.referenceNo}
                                    onChange={(e) => {
                                        let stoneDetailCode = issueData.find(el => el.issueNo === e.target.value).stoneDetailCode;
                                        setFormData({
                                            ...formData, 
                                            referenceNo: e.target.value,
                                            stoneDetailCode: stoneDetailCode,
                                        });
                                    }}
                                >
                                    <option value="" disabled>Select...</option>
                                    {
                                        issueData?.map((issue) => {
                                            return <option value={issue.issueNo} key={issue.issueNo}>({issue.stoneDetail.stoneDesc}, {issue.issueMember.map(el => {
                                                    return el.customer.customerName + ",";
                                                })})
                                            </option>
                                        })
                                    }
                                </select>
                                {
                                    validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                }
                            </div> */}
                            
                            {/* Return Date */}
                            <div className="col-start-4 col-end-4">
                                <label className="text-black mb-2 text-sm">Return Date</label>
                                <input
                                    type="date"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={moment(formData.returnDate).format("YYYY-MM-DD")}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        returnDate: e.target.value
                                    })}
                                />
                                {
                                    validationText.returnDate && <p className="block text-[12px] text-red-500 font-sans">{validationText.returnDate}</p>
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            <div className="col-span-2">
                                {/* Reference No */}
                                <label className="text-black text-sm mb-2">Reference No</label>
                                <select 
                                    className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                    value={formData.referenceNo}
                                    onChange={(e) => {
                                        if (type === 'P') {
                                            let stoneDetail = stoneDetails.filter(res => res.referenceNo === e.target.value);
                                            setFormData({
                                                ...formData,
                                                referenceNo: e.target.value,
                                            });
                                            setPurchaseStoneD(stoneDetail);
                                        } else {
                                            let stoneDetailCode = formData.returnType === "I" ? issueData.find(el => el.issueNo === e.target.value).stoneDetailCode : salesData.find(el => el.invoiceNo === e.target.value).stoneDetailCode;
                                            setFormData({
                                                ...formData, 
                                                referenceNo: e.target.value,
                                                stoneDetailCode: stoneDetailCode,
                                            });
                                        }
                                        
                                    }}
                                >
                                    <option value="" disabled>Select...</option>
                                    {
                                        type === 'I' ?
                                        issueData?.map((issue) => {
                                            return <option value={issue.issueNo} key={issue.issueNo}>({issue.stoneDetail.stoneDesc}, {issue.issueMember.map(el => {
                                                    return el.customer.customerName + ",";
                                                })})
                                            </option>
                                        }) : type === 'S' ? salesData?.map((sales) => {
                                            return <option value={sales.invoiceNo} key={sales.invoiceNo}>({sales.stoneDetail.stoneDesc}, {sales.customer.customerName})
                                            </option>
                                        }) : purchaseData?.map((purchase) => {
                                            return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.stone.stoneDesc}, {purchase.supplier.supplierName}
                                            </option>
                                        })
                                    }
                                </select>
                                {
                                    validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                }
                            </div> 
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
                                    <option value="0" disabled>Select stone detail</option>
                                    {
                                        purchaseStoneD.length === 0 ? 
                                        stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                        stoneDetails?.map((stoneDetail) => {
                                            return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc} ({stoneDetail.supplier.supplierName})</option>
                                        }) : purchaseStoneD?.map((stoneDetail) => {
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
                                                qty: parseFloat(e.target.value),
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
                                    />
                                </div>
                                {/* Total Price */}
                                <div>
                                    <label className="text-black text-sm mb-2">Total Price</label>
                                    <input
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-right"
                                        value={formData.totalPrice.toLocaleString()}
                                        readOnly
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
                                isEdit? 
                                <Button onClick={handleUpdate} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                    <FaFloppyDisk className="text-base" />
                                    <Typography variant="small" className="capitalize">
                                        Update
                                    </Typography>
                                </Button> :
                                <>
                                    <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save
                                        </Typography>
                                    </Button>
                                    <Button onClick={handleSave}  color="deep-purple" size="sm" variant="outlined" className="flex items-center gap-2">
                                        <FaCirclePlus className="text-base" />
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

        </>
    );

}

export default ReturnList;
