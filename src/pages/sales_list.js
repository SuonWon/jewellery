/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaMoneyBillTrendUp, FaPencil, FaPlus, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { useAddSalesMutation, useFetchSalesQuery, useFetchStoneDetailsQuery, useFetchTrueCustomerQuery, useFetchTrueSalesQuery, useFetchUOMQuery, useRemoveSalesMutation, useUpdateIssueMutation, useUpdateIssueStatusMutation, useUpdateSalesMutation } from "../store";
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
import { useFetchTrueIssueQuery } from "../apis/issueApi";
const validator = require('validator');

function SalesList() {

    const { data } = useFetchTrueSalesQuery();

    const { data: issueData } = useFetchTrueIssueQuery();

    const { data: customerData } = useFetchTrueCustomerQuery();

    const { data: stoneDetails } = useFetchStoneDetailsQuery();

    const { data: unitData } = useFetchUOMQuery();

    axios.get(apiUrl + '/sales/get-id').then((res) => {
        setSalesId(res.data);
    });

    const [removeSales, removeResult] = useRemoveSalesMutation();

    const [addSales] = useAddSalesMutation();

    const [updateSales] = useUpdateSalesMutation();

    const [updateStatus] = useUpdateIssueMutation();

    const [updateIssueStatus] = useUpdateIssueStatusMutation();

    const auth = useAuthUser();

    const [openDelete, setOpenDelete] = useState(false);

    const [salesId, setSalesId] = useState("");

    const [tBodyData, setTBodyData] = useState([]);

    const [payOpen, setPayOpen] = useState(false);

    const [issueStatus, setIssueStatus] = useState(false);

     const [payData, setPayData] = useState({
        invoiceNo: "",
        balance: 0,
     });

    const navigate = useNavigate();

    const [isAlert, setIsAlert] = useState(true);

    const [open, setOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [alert, setAlert] = useState({
        isAlert: false,
        message: '',
        isWarning: false,
        isError: false,
        title: ""
    });

    const [selectedIssue, setSelectedIssue] = useState({});

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
            balance: Number(balance.replace(/,/g, "")),
        });
        setPayOpen(!payOpen);
    }

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removeSales({
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
        setFormData(salesData);
        setIsEdit(false);
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
            setIssueStatus(tempIssue.status === 'F'? true : false);
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

    const handleSubmit = () => {
        if (validateForm()) {
            try {
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
                    if (res.error != null) {
                        let message = '';
                        if (res.error.data.statusCode == 409) {
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
                if (issueStatus) {
                    updateIssueStatus({
                        id: formData.issueNo,
                        updatedBy: auth().username,
                    });
                }
                setIssueStatus(false);
                setFormData(salesData);
                setOpen(!open);

            }
            catch (err) {
                console.log(err.statusCode);

            }
            setIssueStatus(false);
            setFormData(salesData);
            setOpen(!open);
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            console.log(formData);
            try {
                console.log(tBodyData);
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
                    if (res.error != null) {
                        let message = '';
                        if (res.error.data.statusCode == 409) {
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
                if (issueStatus) {
                    updateIssueStatus({
                        id: formData.issueNo,
                        updatedBy: auth().username,
                    });
                }
                setIssueStatus(false);
                setFormData(salesData);
                setTBodyData([]);

            }
            catch (err) {
                console.log(err.statusCode);

            }
            setIssueStatus(false);
            setFormData(salesData);
            setTBodyData([]);
        }
    };

    const handleUpdate = () => {
        if (validateForm()) {
            try {
                let tempStatus = issueStatus? 'F' : 'O';
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
                if (tempStatus !== selectedIssue.status && formData.issueNo !== "") {
                    updateStatus({
                        ...selectedIssue,
                        status: tempStatus,
                        updatedBy: auth().username,
                    });
                    setSelectedIssue({});
                }
                setFormData(salesData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);   
            }
            setFormData(salesData);
            setOpen(!open);
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
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => openPayable(row.Code, row.GrandTotal)}><FaMoneyBillTrendUp /></Button>
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.Code)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                </div>
            )
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
            <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                <div className="w-78 absolute top-0 right-0 z-[9999]">
                    {/* {
                        removeResult.isSuccess && isAlert && <SuccessAlert title="Sales" message="Delete successful." handleAlert={() => setIsAlert(false)} />
                    } */}
                </div>
                <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h5">
                        Sales List
                    </Typography>
                    <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                        <FaPlus /> Create New
                    </Button>
                </div>
                <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                    <CardBody className="rounded-sm overflow-auto p-0">
                        <TableList columns={column} data={tbodyData} />
                    </CardBody>
                </Card>
                <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                <Dialog open={open} size="xl">
                    <DialogBody>
                        <ModalTitle titleName="Sales" handleClick={() => setOpen(!open)} />
                        {
                            alert.isAlert? <SuccessAlert title={alert.title} message={alert.message} isWarning={alert.isWarning} /> : ""
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
                                                    axios.get(`${apiUrl}/stone-detail/get-purchase-share/${refNo}`).then((res) => {
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
                                        >
                                            <option value="" >Select...</option>
                                            {
                                                issueData?.map((issue) => {
                                                    return <option value={issue.issueNo} key={issue.issueNo}>({issue.stoneDetail.stoneDesc}, {issue.issueMember.map(el => {
                                                            return el.customer.customerName + ",";
                                                        })})
                                                    </option>
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
                                                onChange={() => {
                                                    if (formData.issueNo === "") {
                                                        setAlert({
                                                            isAlert: true,
                                                            message: "Please select issue no.",
                                                            isWarning: true,
                                                            title: "Warning"
                                                        })
                                                        setTimeout(() => {
                                                            setAlert({
                                                                isAlert: false,
                                                                message: '',
                                                                isWarning: false,
                                                                title: '',
                                                            })
                                                        }, 2000);
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
                                                axios.get(`${apiUrl}/stone-detail/get-purchase-share/${refNo}`).then((res) => {
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
                                                        return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc} ({stoneDetail.supplier.supplierName})</option>
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
                                                    let totalP = formData.unitPrice * weight;
                                                    let totalA = (totalP + formData.serviceCharge) - formData.discAmt;
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
                                                    let price = parseFloat(e.target.value);
                                                    let totalP = formData.weight * price;
                                                    let totalA = (totalP + formData.serviceCharge) - formData.discAmt;
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
                                                                grandTotal: (formData.subTotal + serviceCharge) - formData.discAmt
                                                            });
                                                            let newTbody = tBodyData.map(el => {
                                                                return {
                                                                    ...el,
                                                                    amount: (el.sharePercentage / 100) * ((formData.subTotal + serviceCharge) - formData.discAmt),
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
                                                        let totalA = charge + formData.subTotal;
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
                                                            grandTotal: (formData.subTotal + formData.serviceCharge) - discAmt
                                                        });
                                                        let newTbody = tBodyData.map(el => {
                                                            return {
                                                                ...el,
                                                                amount: (el.sharePercentage / 100) * ((formData.subTotal + formData.serviceCharge) - discAmt),
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
                                    <Button onClick={handleSave} color="green" size="sm" variant="gradient" className="flex items-center gap-2">
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
                    payOpen? <Receivable payOpen={payOpen} invoiceNo={payData.invoiceNo} balance={payData.balance}  closePay={() => setPayOpen(!payOpen)} /> : <div></div>
                }
            </div>

        </>
    );

}

export default SalesList;
