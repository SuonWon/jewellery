/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaMoneyBillTrendUp, FaPencil, FaPlus, } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useAddSalesMutation, useFetchActiveStoneDetailsQuery, useFetchSalesCountQuery, useFetchSalesQuery, useFetchTrueCustomerQuery, useFetchUOMQuery, useRemoveSalesMutation, useFetchReturnQuery, useUpdateIssueMutation, useUpdateIssueStatusMutation, useUpdateSalesMutation } from "../store";
import Pagination from "../components/pagination";
import { apiUrl, focusSelect, pause } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import DataTable from "react-data-table-component";
import Receivable from "./receivable";
import { useFetchIssueQuery, useFetchTrueIssueQuery } from "../apis/issueApi";
import Cookies from "js-cookie";
import { AuthContent } from "../context/authContext";

const token = 'Bearer ' + Cookies.get('_auth');

const validator = require('validator');

function SalesList() {

    const {permissions} = useContext(AuthContent);
    
    const [salesPermission, setSalesPermission] = useState(null);

    const [receivablePermission, setReceivablePermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setSalesPermission(permissions[12]);
        setReceivablePermission(permissions[23]);

        if(salesPermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, salesPermission, navigate])
    
    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        status: 'A',
        search_word: '',
        start_date: null,
        end_date: null
    });

    // const { data, refetch } = useFetchTrueSalesQuery();
    const { data, isLoading: dataLoad, refetch } = useFetchSalesQuery(filterData);

    const { data: dataCount } = useFetchSalesCountQuery(filterData);

    const { data: issueData } = useFetchIssueQuery({
        skip: 0,
        take: 0,
        status: 'O',
        isComplete: 'A',
        search_word: '',
        start_date: null,
        end_date: null
    });

    const { data: customerData } = useFetchTrueCustomerQuery();

    const { data: stoneDetails } = useFetchActiveStoneDetailsQuery();

    const { data: unitData } = useFetchUOMQuery();

    const { data: returnData } = useFetchReturnQuery({
        skip: 0,
        take: 0,
        status: 'O',
        return_type: 'S',
        search_word: '',
        start_date: null,
        end_date: null
    });

    const [removeSales] = useRemoveSalesMutation();

    const [addSales] = useAddSalesMutation();

    const [updateSales] = useUpdateSalesMutation();

    const [updateStatus] = useUpdateIssueMutation();

    const [updateIssueStatus] = useUpdateIssueStatusMutation();

    const auth = useAuthUser();

    const [openDelete, setOpenDelete] = useState(false);

    // const [salesId, setSalesId] = useState("");

    const [tBodyData, setTBodyData] = useState([]);

    const [payOpen, setPayOpen] = useState(false);

    const [issueStatus, setIssueStatus] = useState(false);

     const [payData, setPayData] = useState({
        invoiceNo: "",
        balance: 0,
     });

    const [open, setOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const [tBodyReturnData, setTBodyReturnData] = useState([]);

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
    });

    const [selectedIssue, setSelectedIssue] = useState({});

    useEffect(() => {
        refetch();
    }, [data]);

    const salesData = {
        invoiceNo: "",
        salesDate: moment().format("YYYY-MM-DD"),
        issueNo: "",
        customerCode: 0,
        stoneDetailCode: "",
        qty: 0,
        weight: 0,
        unitCode: 'ct',
        unitPrice: 0,
        subTotal: 0,
        servicePer: 0,
        serviceCharge: 0,
        discAmt: 0,
        grandTotal: 0,
        remark: "",
        status: "O",
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
        salesShareDetails: [],
    };

    const [formData, setFormData] = useState(salesData);

    const [validationText, setValidationText] = useState({});

    const [deleteId, setDeleteId] = useState('');

    const openPayable = (invoiceNo, balance) => {
        setPayData({
            ...payData,
            invoiceNo: invoiceNo,
            balance: Number(balance.replace(/,/g, ""))
        });
        setPayOpen(!payOpen);
    }

    const handleRemove = async (id) => {
        let removeData = data.find((el) => el.invoiceNo === id);
        removeSales({
            id: removeData.invoiceNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then(async (res) => { 
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Sales invoice deleted successfully.",
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

    // const handleDeleteBtn = (id) => {
    //     setDeleteId(id);
    //     setOpenDelete(!openDelete);
    // };

    const handleOpen = () => {
        setFormData(salesData);
        setIsEdit(false);
        setIssueStatus(false);
        setOpen(!open);
        setTBodyData([]);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.invoiceNo === id);
        if (tempData.issueNo !== "") {
            let tempIssue = issueData.find(res => res.issueNo === tempData.issueNo);
            setSelectedIssue({
                issueNo: tempIssue.issueNo,
                issueDate: tempIssue.issueDate,
                stoneDetailCode: tempIssue.stoneDetailCode,
                qty: tempIssue.qty,
                weight: tempIssue.weight,
                unitCode: tempIssue.unitCode,
                unitPrice: tempIssue.unitPrice,
                totalPrice: tempIssue.totalPrice,
                status: tempIssue.status,
                isComplete: tempIssue.isComplete,
                remark: tempIssue.remark,
                createdAt: tempIssue.createdAt,
                createdBy: tempIssue.createdBy,
                updatedAt: tempIssue.updatedAt,
                updatedBy: tempIssue.updatedBy,
                deletedAt: tempIssue.deletedAt,
                deletedBy: tempIssue.deletedBy,
                issueMember: tempIssue.issueMember.map(el => {
                    return {
                        id: el.id,
                        lineNo: el.lineNo,
                        customerCode: el.customerCode,
                    }
                })
            })
            setIssueStatus(tempIssue.isComplete);
        }
        setFormData({
            invoiceNo: tempData.invoiceNo,
            salesDate: tempData.salesDate,
            customerCode: tempData.customerCode,
            stoneDetailCode: tempData.stoneDetailCode,
            issueNo: tempData.issueNo,
            qty: tempData.qty,
            weight: tempData.weight,
            unitCode: tempData.unitCode,
            unitPrice: tempData.unitPrice,
            subTotal: tempData.subTotal,
            servicePer: tempData.servicePer,
            serviceCharge: tempData.serviceCharge,
            discAmt: tempData.discAmt,
            grandTotal: tempData.grandTotal,
            remark: tempData.remark,
            status: tempData.status,
            createdBy: tempData.createdBy,
            createdAt: tempData.createdAt,
            updatedBy: tempData.updatedBy,
            updatedAt: tempData.updatedAt,
            deletedBy: tempData.deletedBy,
            salesShareDetails: tempData.salesShareDetails.map(el => {
                return {
                    id: el.id,
                    lineNo: el.lineNo,
                    shareCode: el.shareCode,
                    sharePercentage: el.sharePercentage,
                    amount: el.amount,
                }
            }),
        });
        setTBodyData(tempData.salesShareDetails.map(el => {
            return {
                id: el.id,
                lineNo: el.lineNo,
                shareCode: el.shareCode,
                shareName: el.share.shareName,
                sharePercentage: el.sharePercentage,
                amount: el.amount,
            }
        }));
        console.log(returnData)
        setTBodyReturnData(returnData.filter(el => el.referenceNo === id));
        setIsEdit(true);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if (formData.customerCode === 0) {
            newErrors.customer = "Customer Name is required."
        }

        if (formData.salesDate === "") {
            newErrors.salesDate = "Sales Date is required."
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

            var salesId = '';
            await axios.get(apiUrl + '/sales/get-id', {
                headers: {
                    "Authorization": token
                }
            }).then((res) => {
                salesId = res.data;
            });

            addSales({
                ...formData,
                invoiceNo: salesId,
                salesDate: moment(formData.salesDate).toISOString(),
                salesShareDetails: tBodyData.map(el => {
                    return {
                        id: uuidv4(),
                        lineNo: el.lineNo,
                        shareCode: el.shareCode,
                        sharePercentage: el.sharePercentage,
                        amount: el.amount,
                    };
                }),
            }).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Sales invoice created successfully.",
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
            if (issueStatus) {
                updateIssueStatus({
                    id: formData.issueNo,
                    updatedBy: auth().username,
                });
            }
            setIssueStatus(false);
            setFormData(salesData);
            setOpen(!open);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        }
    };

    const handleSave = async () => {
        if (validateForm()) {

            var salesId = '';

            await axios.get(apiUrl + '/sales/get-id', {
                headers: {
                    "Authorization": token
                }
            }).then((res) => {
                salesId = res.data;
            });

            addSales({
                ...formData,
                invoiceNo: salesId,
                salesDate: moment(formData.salesDate).toISOString(),
                salesShareDetails: tBodyData.map(el => {
                    return {
                        id: uuidv4(),
                        lineNo: el.lineNo,
                        shareCode: el.shareCode,
                        sharePercentage: el.sharePercentage,
                        amount: el.amount,
                    };
                }),
            }).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Sales invoice created successfully.",
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
            if (issueStatus) {
                updateIssueStatus({
                    id: formData.issueNo,
                    updatedBy: auth().username,
                });
            }
            setIssueStatus(false);
            setFormData(salesData);
            setTBodyData([]);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        }
    };

    const handleUpdate = async () => {
        if (validateForm()) {
            updateSales({
                invoiceNo: formData.invoiceNo,
                salesDate: formData.salesDate,
                issueNo: formData.issueNo,
                customerCode: formData.customerCode,
                stoneDetailCode: formData.stoneDetailCode,
                qty: formData.qty,
                weight: formData.weight,
                unitCode: formData.unitCode,
                unitPrice: formData.unitPrice,
                subTotal: formData.subTotal,
                servicePer: formData.servicePer,
                serviceCharge: formData.serviceCharge,
                discAmt: formData.discAmt,
                grandTotal: formData.grandTotal,
                remark: formData.remark,
                status: formData.status,
                createdBy: formData.createdBy,
                createdAt: formData.createdAt,
                updatedBy: auth().username,
                updatedAt: formData.updatedAt,
                deletedBy: "",
                salesShareDetails: tBodyData.map(el => {
                    return {
                        id: el.id,
                        lineNo: el.lineNo,
                        shareCode: el.shareCode,
                        sharePercentage: el.sharePercentage,
                        amount: el.amount,
                    }
                }),
            }).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Sales invoice updated successfully.",
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
            if (issueStatus !== selectedIssue.isComplete && formData.issueNo !== "") {
                updateStatus({
                    ...selectedIssue,
                    isComplete: issueStatus,
                    updatedBy: auth().username,
                }).then((res) => {
                    console.log(res);
                });
                setSelectedIssue({});
            }
            setFormData(salesData);
            setOpen(!open);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        }
    };

    const shareColumn = [
        {
            name: 'Share Name',
            selector: row => row.shareName,
        },
        {
            name: 'Share(%)',
            width: "90px",
            center: "true",
            selector: row => row.sharePercentage,
        },
        {
            name: 'Amount',
            width: "150px",
            right: "true",
            selector: row => row.amount.toLocaleString(),
        },
    ];

    const column = [
        {
            name: 'Invoice No',
            width: '200px',
            selector: row => row.Code,
            omit: "true"
        },
        {
            name: 'Status',
            width: '100px',
            selector: row => row.Status == 'O' ? 
                <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                    Open
                </div>
                : row.Status == 'V' ? 
                    <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                        Void
                    </div> : 
                    <div className="bg-orange-500 px-3 py-[5px] text-white rounded-xl">
                        Closed
                    </div>,
            center: 'true'
        },
        {
            name: 'Paid Status',
            width: '120px',
            selector: row => row.PaidStatus == 'PAID' ? 
            <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                Paid
            </div> : row.PaidStatus === 'UNPAID'?
            <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                Unpaid
            </div> : 
            <div className="bg-orange-500 px-3 py-[5px] text-white rounded-xl">
                Partial
            </div>,
            center: 'true'
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => row.SalesDate,
        },
        {
            name: 'Grand Total',
            width: "130px",
            selector: row => row.GrandTotal,
            right: "true",
        },
        {
            name: 'Customer',
            width: "200px",
            selector: row => row.Customer,
        },
        {
            name: 'Stone Detail',
            width: "250px",
            selector: row => row.StoneDetailCode,
        },
        {
            name: 'Issue No',
            width: '150px',
            selector: row => row.IssueNo,
        },
        {
            name: 'Qty',
            width: "100px",
            selector: row => row.Qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "100px",
            selector: row => row.Weight,
            center: "true"
        },
        {
            name: 'Unit Price',
            width: "150px",
            selector: row => row.UnitPrice,
            right: "true",
        },
        {
            name: 'Sub Total',
            width: "150px",
            selector: row => row.SubTotal,
            right: "true",
        },
        {
            name: "Service (%)",
            width: "150px",
            selector: row => row.ServicePer,
            center: "true"
        },
        {
            name: 'Service Amt',
            width: "150px",
            selector: row => row.ServiceCharge,
            right: "true",
        },
        {
            name: 'Discount Amt',
            width: "150px",
            selector: row => row.DiscAmt,
            right: "true",
        },
        {
            name: 'Remark',
            width: "300px",
            selector: row => row.Remark,
        },
        // {
        //     name: 'Created At',
        //     width: "200px",
        //     selector: row => row.CreatedAt,
        // },
        // {
        //     name: 'Updated At',
        //     width: "200px",
        //     selector: row => row.UpdatedAt,
        // },
        {
            name: 'Action',
            center: "true",
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {
                        receivablePermission?.view ? (
                            <Button variant="text" color="deep-purple" className="p-2" onClick={() => openPayable(row.Code, row.GrandTotal)}><FaMoneyBillTrendUp /></Button>
                        ) : null
                    }
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.Code)}><FaPencil /></Button>
                    {/* {
                        salesPermission?.delete ? ( */}
                            {/* <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button> */}
                        {/* ) : null
                    } */}
                </div>
            )
        },
    ];

    const returnColumn = [
        {
            name: "Return No",
            width: "110px",
            selector: row => row.returnNo,
        },
        {
            name: "Stone Detail",
            width: "180px",
            selector: row => row.stoneDetail.stoneDesc,
        },
        {
            name: "Qty",
            selector: row => row.qty,
            right: true,
        },
        {
            name: "Weight",
            selector: row => row.weight,
            right: true,
        },
        {
            name: "Amount",
            selector: row => row.totalPrice.toLocaleString('en-us'),
            right: true,
        },
    ];

    const tbodyData = data?.map((salesData) => {
        return {
            Code: salesData.invoiceNo,
            SalesDate: moment(salesData.salesDate).format("YYYY-MM-DD"),
            IssueNo: salesData.issueNo,
            Customer: salesData.customer.customerName,
            StoneDetailCode: salesData.stoneDetail.stoneDesc,
            Qty: salesData.qty,
            Weight: salesData.weight,
            UnitPrice: salesData.unitPrice.toLocaleString('en-US'),
            SubTotal: salesData.subTotal.toLocaleString('en-US'),
            ServicePer: salesData.servicePer,
            ServiceCharge: salesData.serviceCharge.toLocaleString('en-US'),
            DiscAmt: salesData.discAmt.toLocaleString('en-US'),
            GrandTotal: salesData.grandTotal.toLocaleString('en-US'),
            Remark: salesData.remark,
            CreatedAt: moment(salesData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: salesData.createdBy,
            UpdatedAt: moment(salesData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: salesData.updatedBy,
            Status: salesData.status,
            PaidStatus: salesData.paidStatus
        }
    });

    return (
        <>
        {
            salesPermission != null && salesPermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError} isWarning={alertMsg.isWarning}  /> : ""
                        }
                    </div>
                    <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                        <Typography variant="h5">
                            Sales List
                        </Typography>
                        {
                            salesPermission?.create ? (
                                <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                                    <FaPlus /> Create New
                                </Button>
                            ) : null
                        }
                    </div>
                    <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                        <CardBody className="rounded-sm overflow-auto p-0">
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 py-2">
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
                    <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                    <Dialog open={open} size="xl">
                        <DialogBody>
                            <ModalTitle titleName="Sales" handleClick={() => setOpen(!open)} />
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError} isWarning={alertMsg.isWarning}  /> : ""
                            }
                            <div className="grid grid-cols-5 gap-2 mb-3">
                                <div className="col-span-3">
                                    <div className="grid grid-cols-3 mb-3">
                                        {/* Sales Date */}
                                        <div className="">
                                            <label className="text-black mb-2 text-sm">Sales Date</label>
                                            <input
                                                type="date"
                                                className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                                value={moment(formData.salesDate).format("YYYY-MM-DD")}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    salesDate: e.target.value
                                                })}
                                            />
                                            {
                                                validationText.salesDate && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.salesDate}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {/* Issue No */}
                                        <div className="col-span-3">
                                            <label className="text-black text-sm mb-2">Issue No</label>
                                            <select
                                                className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                                value={formData.issueNo}
                                                onChange={(e) => {
                                                    if (e.target.value !== "") {
                                                        let stoneDetailCode = issueData.find(el => el.issueNo === e.target.value).stoneDetailCode;
                                                        let refNo = stoneDetails.find(el => el.stoneDetailCode === stoneDetailCode).referenceNo;
                                                        setFormData({ 
                                                            ...formData, 
                                                            issueNo: e.target.value,
                                                            stoneDetailCode: stoneDetailCode
                                                        });
                                                        axios.get(`${apiUrl}/stone-detail/get-purchase-share/${refNo}`, {
                                                            headers: {
                                                                "Authorization": token
                                                            }
                                                        }).then((res) => {
                                                            setTBodyData(
                                                                res.data.map(el => {
                                                                    return {
                                                                        id: el.id,
                                                                        invoiceNo: el.invoiceNo,
                                                                        lineNo: el.lineNo,
                                                                        shareCode: el.shareCode,
                                                                        shareName: el.shareName,
                                                                        sharePercentage: el.sharePercentage,
                                                                        amount: 0,
                                                                    }
                                                                })
                                                            );
                                                        });
                                                    } else {
                                                        setFormData({
                                                            ...formData,
                                                            issueNo: "",
                                                            stoneDetailCode: "",
                                                        });
                                                        setTBodyData([]);
                                                    }
                                                }}
                                                disabled={issueStatus}
                                            >
                                                <option value="" disabled hidden>Select...</option>
                                                {
                                                    isEdit? issueData?.map((issue) => {
                                                        return <option value={issue.issueNo} key={issue.issueNo}>({issue.stoneDetail.stoneDesc}, {issue.issueMember.map(el => {
                                                                return el.customer.customerName + ",";
                                                            })})
                                                        </option>
                                                    }) : issueData?.map((issue) => {
                                                        if (!issue.isComplete) {
                                                            return <option value={issue.issueNo} key={issue.issueNo}>({issue.stoneDetail.stoneDesc}, {issue.issueMember.map(el => {
                                                                    return el.customer.customerName + ",";
                                                                })})
                                                            </option>
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="">
                                            <label className="text-black text-sm mb-2">Issue Complete</label>
                                            <div className="w-full">
                                                <input 
                                                    type="checkbox" 
                                                    className="border border-blue-gray-200 w-[20px] h-[20px] py-1.5 rounded-md text-black"
                                                    checked={issueStatus}
                                                    onChange={ async () => {
                                                        if (formData.issueNo === "") {
                                                            setAlertMsg({
                                                                visible: true,
                                                                message: "Please select issue no.",
                                                                isWarning: true,
                                                                title: "Warning"
                                                            });
                                                            await pause();
                                                            setAlertMsg({
                                                                ...alertMsg,
                                                                visible: false
                                                            })
                                                        } else {
                                                            setIssueStatus(!issueStatus);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {/* Customer Name */}
                                        <div className="">
                                            <label className="text-black mb-2 text-sm">Customer Name</label>
                                            <select
                                                className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                                value={formData.customerCode}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    customerCode: Number(e.target.value)
                                                })}
                                            >
                                                <option value="0" disabled>Select Customer</option>
                                                {
                                                    customerData?.map((customer) => {
                                                        return <option value={customer.customerCode} key={customer.customerCode} >{customer.customerName}</option>
                                                    })
                                                }
                                            </select>
                                            {
                                                validationText.customer && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customer}</p>
                                            }
                                        </div>
                                        {/* Stone Details */}
                                        <div className="col-span-2">
                                            <label className="text-black mb-2 text-sm">Stone Details</label>
                                            <select
                                                className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                                value={formData.stoneDetailCode}
                                                onChange={(e) => {
                                                    console.log(e.target.value);
                                                    setFormData({
                                                        ...formData,
                                                        stoneDetailCode: e.target.value,
                                                    });
                                                    let refNo = stoneDetails.find(el => el.stoneDetailCode === e.target.value).referenceNo;
                                                    axios.get(`${apiUrl}/stone-detail/get-purchase-share/${refNo}`, {
                                                        headers: {
                                                            "Authorization": token
                                                        }
                                                    }).then((res) => {
                                                        setTBodyData(
                                                            res.data.map(el => {
                                                                return {
                                                                    id: el.id,
                                                                    invoiceNo: el.invoiceNo,
                                                                    lineNo: el.lineNo,
                                                                    shareCode: el.shareCode,
                                                                    shareName: el.shareName,
                                                                    sharePercentage: el.sharePercentage,
                                                                    amount: 0,
                                                                }
                                                            })
                                                        );
                                                    });
                                                }}
                                            >
                                                <option value="" disabled>Select stone detail</option>
                                                {
                                                    stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                                        stoneDetails?.map((stoneDetail) => {
                                                            if (stoneDetail.isActive) {
                                                                return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc} ({stoneDetail.supplier.supplierName})</option>
                                                            }
                                                        })
                                                }
                                            </select>
                                            {
                                                validationText.stoneDetailCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.stoneDetailCode}</p>
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
                                                        let weight = parseFloat(e.target.value === "" ? 0 : e.target.value);
                                                        let totalP = formData.unitPrice * weight;
                                                        let totalA = (totalP - formData.serviceCharge) - formData.discAmt;
                                                        setFormData({
                                                            ...formData,
                                                            weight: weight,
                                                            subTotal: totalP,
                                                            serviceCharge: formData.servicePer > 0 ? (formData.servicePer / 100) * totalP : formData.serviceCharge,
                                                            grandTotal: totalA,
                                                        });
                                                        let newTbody = tBodyData.map(el => {
                                                            return {
                                                                ...el,
                                                                amount: (el.sharePercentage / 100) * totalA,
                                                            }
                                                        });
                                                        setTBodyData(newTbody);
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
                                                    <option value="" disabled>Select Unit</option>
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
                                                        let price = parseFloat(e.target.value === "" ? 0 : e.target.value);
                                                        let totalP = formData.weight * price;
                                                        let totalA = (totalP - formData.serviceCharge) - formData.discAmt;
                                                        setFormData({
                                                            ...formData,
                                                            unitPrice: price,
                                                            subTotal: totalP,
                                                            serviceCharge: formData.servicePer > 0 ? (formData.servicePer / 100) * totalP : formData.serviceCharge,
                                                            grandTotal: totalA,
    
                                                        });
                                                        let newTbody = tBodyData.map(el => {
                                                            return {
                                                                ...el,
                                                                amount: (el.sharePercentage / 100) * totalA,
                                                            }
                                                        });
                                                        setTBodyData(newTbody);
                                                    }}
                                                    onFocus={(e) => focusSelect(e)}
                                                />
                                            </div>
                                            {/* Sub Total */}
                                            <div>
                                                <label className="text-black text-sm mb-2">Sub Total</label>
                                                <input
                                                    type="text"
                                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-right"
                                                    value={formData.subTotal.toLocaleString('en-US')}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-2">
                                        {/* Remark */}
                                        <div className="grid col-span-3 h-fit">
                                            <label className="text-black text-sm">Remark</label>
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
                                        <div className="grid col-span-3 grid-cols-2 gap-2">
                                            {/* Service Charge */}
                                            <div className="grid grid-cols-2">
                                                <div className="col-start-2">
                                                    <label className="text-black text-sm mb-2">Charge (%)</label>
                                                    <input
                                                        type="number"
                                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                                        value={formData.servicePer}
                                                        onChange={(e) => {
                                                            let percentage = parseFloat(e.target.value);
                                                            if (percentage < 100 && percentage > 0) {
                                                                let serviceCharge = (percentage / 100) * formData.subTotal
                                                                setFormData({
                                                                    ...formData,
                                                                    servicePer: percentage,
                                                                    serviceCharge: serviceCharge,
                                                                    grandTotal: (formData.subTotal - serviceCharge) - formData.discAmt
                                                                });
                                                                let newTbody = tBodyData.map(el => {
                                                                    return {
                                                                        ...el,
                                                                        amount: (el.sharePercentage / 100) * ((formData.subTotal - serviceCharge) - formData.discAmt),
                                                                    }
                                                                });
                                                                setTBodyData(newTbody);
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    servicePer: 0,
                                                                })
                                                            }
                                                        }}
                                                        onFocus={(e) => focusSelect(e)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-y-2">
                                                {/* Service Charge */}
                                                <div>
                                                    <label className="text-black text-sm mb-2">Service Charge</label>
                                                    <input
                                                        type="number"
                                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                                        value={formData.serviceCharge}
                                                        onChange={(e) => {
                                                            let charge = parseFloat(e.target.value);
                                                            let totalA = formData.subTotal - charge;
                                                            setFormData({
                                                                ...formData,
                                                                serviceCharge: charge,
                                                                servicePer: charge > 0 ? 0 : formData.servicePer,
                                                                grandTotal: totalA - formData.discAmt,
                                                            });
                                                            let newTbody = tBodyData.map(el => {
                                                                return {
                                                                    ...el,
                                                                    amount: (el.sharePercentage / 100) * (totalA - formData.discAmt),
                                                                }
                                                            });
                                                            setTBodyData(newTbody);
                                                        }}
                                                        onFocus={(e) => focusSelect(e)}
                                                    />
                                                </div>
                                                {/* Discount Amount */}
                                                <div>
                                                    <label className="text-black text-sm mb-2">Discount Amount</label>
                                                    <input
                                                        type="number"
                                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                                        value={formData.discAmt}
                                                        onChange={(e) => {
                                                            let discAmt = parseFloat(e.target.value);
                                                            setFormData({
                                                                ...formData,
                                                                discAmt: discAmt,
                                                                grandTotal: (formData.subTotal - formData.serviceCharge) - discAmt
                                                            });
                                                            let newTbody = tBodyData.map(el => {
                                                                return {
                                                                    ...el,
                                                                    amount: (el.sharePercentage / 100) * ((formData.subTotal - formData.serviceCharge) - discAmt),
                                                                }
                                                            });
                                                            setTBodyData(newTbody);
                                                        }}
                                                        onFocus={(e) => focusSelect(e)}
                                                    />
                                                </div>
                                                {/* Grand Total */}
                                                <div>
                                                    <label className="text-black text-sm mb-2">Grand Total</label>
                                                    <input
                                                        type="text"
                                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-right"
                                                        value={formData.grandTotal.toLocaleString('en-US')}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 grid grid-cols-5 gap-2 h-fit">
                                    {/* Customer table list */}
                                    <div className="col-span-5">
                                        <Card className="w-full shadow-sm border border-blue-gray-200 rounded-md">
                                            <CardBody className="overflow-auto rounded-md p-0">
                                                <DataTable 
                                                columns={shareColumn} 
                                                data={tBodyData}
                                                fixedHeader
                                                fixedHeaderScrollHeight="150px"
                                                customStyles={{
                                                    rows: {
                                                        style: {
                                                            minHeight: '40px',
                                                        },
                                                    },
                                                    headCells: {
                                                        style: {
                                                            fontWeight: "bold",
                                                            fontSize: "0.8rem",
                                                            minHeight: '40px',
                                                        }
                                                    }
                                                }} 
                                                />
                                            </CardBody>
                                        </Card>
                                    </div>
                                    {/* Return table list */}
                                    <div className="col-span-5">
                                        <Card className="w-full shadow-sm border border-blue-gray-200 rounded-md">
                                            <CardBody className="overflow-auto rounded-md p-0">
                                                <Typography variant="h6" className="px-2 ml-3 mt-2 border-l-2 border-purple-700 text-black rounded-md">
                                                    Returns
                                                </Typography>
                                                <DataTable 
                                                columns={returnColumn} 
                                                data={tBodyReturnData} 
                                                fixedHeader
                                                fixedHeaderScrollHeight="150px"
                                                customStyles={{
                                                    rows: {
                                                        style: {
                                                            minHeight: '40px',
                                                        },
                                                    },
                                                    headCells: {
                                                        style: {
                                                            fontWeight: "bold",
                                                            fontSize: "0.8rem",
                                                            minHeight: '40px',
                                                        }
                                                    }
                                                }} 
                                            />
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            </div>
    
                            <div className="flex items-center justify-end mt-6 gap-2">
                                {
                                    isEdit? (
                                        salesPermission?.update ? (
                                            <Button onClick={handleUpdate} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                                <FaFloppyDisk className="text-base" />
                                                <Typography variant="small" className="capitalize">
                                                    Update
                                                </Typography>
                                            </Button>
                                        ) : null
                                    ) :
                                    <>
                                        <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                            <FaFloppyDisk className="text-base" />
                                            <Typography variant="small" className="capitalize">
                                                Save
                                            </Typography>
                                        </Button>
                                        <Button onClick={handleSave} color="deep-purple" size="sm" variant="outlined" className="flex items-center gap-2">
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
                    {
                        payOpen? <Receivable payOpen={payOpen} invoiceNo={payData.invoiceNo} receivablePermission={receivablePermission} balance={payData.balance} 
                        closePay={() => {
                            refetch();
                            setPayOpen(!payOpen);
                        }} /> : <div></div>
                    }
                </div>
            ) : <div>Loading...</div>
        }

        </>
    );

}

export default SalesList;
