/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaAlipay, FaCirclePlus, FaEye, FaFloppyDisk, FaMoneyBillTrendUp, FaPencil, FaPlus, FaTheRedYeti, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { apiUrl, focusSelect, pause } from "../const";
import { useAddPurchaseMutation, useFetchPurchaseQuery, useFetchShareQuery, useFetchStoneQuery, useFetchTrueSupplierQuery, useFetchUOMQuery, useRemovePurchaseMutation, useUpdatePurchaseMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
import DataTable from "react-data-table-component";
import axios from "axios";
import Payable from "./payable";
import ButtonLoader from "../components/buttonLoader";
const validator = require('validator');

function PurchaseList() {

    const { data, isLoading : dataLoad, } = useFetchPurchaseQuery();

    const { data: supplierData } = useFetchTrueSupplierQuery();

    const { data: shareData } = useFetchShareQuery();

    const { data: unitData } = useFetchUOMQuery();

    const { data: stoneData } = useFetchStoneQuery();

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [payOpen, setPayOpen] = useState(false);

     const [payData, setPayData] = useState({
        invoiceNo: "",
        balance: 0,
     });

    const [oldPer, setOldPer] = useState(0);

    const [isEdit, setIsEdit] = useState(false);

    const [isEditShare, setIsEditShare] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const [addPurchase, addResult] = useAddPurchaseMutation();

    const [updatePurchase] = useUpdatePurchaseMutation();

    const [alert, setAlert] = useState({
        isAlert: false,
        message: ''
    });

    const [removePurchase, removeResult] = useRemovePurchaseMutation();

    const purchaseData = {
        invoiceNo: "",
        purDate: moment().format("YYYY-MM-DD"),
        supplierCode: 0,
        stoneCode: 0,
        qty: 0,
        totalWeight: 0,
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
        purchaseShareDetails: [],
    };

    const shareInfo = {
        id: uuidv4(),
        lineNo: 0,
        shareCode: 0,
        shareName: "",
        sharePercentage: 0,
        amount: 0,
    };

    const [dShare, setDShare] = useState({
        id: uuidv4(),
        lineNo: 1,
        shareCode: 0,
        shareName: "",
        sharePercentage: 100,
        amount: 0,
    });

    const [formData, setFormData] = useState(purchaseData);

    const [shares, setShares] = useState(shareInfo);

    const [tBodyData, setTBodyData] = useState([dShare]);

    const [deleteId, setDeleteId] = useState('');

    const [validationText, setValidationText] = useState({});

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removePurchase({
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
        axios.get(`${apiUrl}/share/get-owner`).then((res) => {
            setTBodyData([
                {
                    ...dShare,
                    shareCode: res.data.shareCode,
                    shareName: res.data.shareName,
                    sharePercentage: 100,
                    amount: 0,
                }
            ]);
            setDShare({
                ...dShare,
                shareCode: res.data.shareCode,
                shareName: res.data.shareName,
                sharePercentage: 100,
                amount: 0,
            });
        });
        setFormData(purchaseData);
        setIsEdit(false);
        setOpen(!open);
    };

    const openPayable = (invoiceNo, balance) => {
        setPayData({
            ...payData,
            invoiceNo: invoiceNo,
            balance: Number(balance.replace(/,/g, "")),
        });
        setPayOpen(!payOpen);
    }

    const handleView = (id) => {
        let tempData = data.find(res => res.invoiceNo === id);
        setFormData({
            invoiceNo: tempData.invoiceNo,
            purDate: tempData.purDate,
            supplierCode: tempData.supplierCode,
            stoneCode: tempData.stoneCode,
            qty: tempData.qty,
            totalWeight: tempData.totalWeight,
            unitCode: tempData.unitCode,
            unitPrice: tempData.unitPrice,
            subTotal: tempData.subTotal,
            servicePer: tempData.servicePer,
            serviceCharge: tempData.serviceCharge,
            discAmt: tempData.discAmt,
            grandTotal: tempData.grandTotal,
            remark: tempData.remark,
            paidStatus: tempData.paidStatus,
            status: tempData.status,
            createdBy: tempData.createdBy,
            createdAt: tempData.createdAt,
            updatedBy: tempData.updatedBy,
            updatedAt: tempData.updatedAt,
            deletedBy: tempData.deletedBy,
            purchaseShareDetails: tempData.purchaseShareDetails.map(el => {
                return {
                    id: el.id,
                    lineNo: el.lineNo,
                    shareCode: el.shareCode,
                    sharePercentage: el.sharePercentage,
                    amount: el.amount,
                }
            }),
        });
        setTBodyData(tempData.purchaseShareDetails.map(el => {
            return {
                id: el.id,
                lineNo: el.lineNo,
                shareCode: el.shareCode,
                shareName: el.share.shareName,
                sharePercentage: el.sharePercentage,
                amount: el.amount,
            }
        }));
        tempData.purchaseShareDetails.map(el => {
            if (el.shareCode === dShare.shareCode) {
                setDShare({
                    ...dShare,
                    sharePercentage: el.sharePercentage,
                    amount: el.amount
                });
            }
        })
        setIsEdit(true);
        setOpen(!open);
    };

    //console.log(tBodyData);

    function validateForm() {
        const newErrors = {};

        if (formData.supplierCode === 0) {
            newErrors.supplier = "Supplier Name is required."
        }

        if (formData.purDate === "") {
            newErrors.purDate = "Purchase Date is required."
        }

        if (formData.stoneCode === 0) {
            newErrors.stoneCode = "Stone Detail is required."
        }

        if (validator.isEmpty(formData.unitCode)) {
            newErrors.unitCode = "Unit is required."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    function validateShare() {
        const newErrors = {};

        if(shares.shareCode === 0) {
            newErrors.share = "Share Name is required.";
        }

        if(shares.sharePercentage === 0) {
            newErrors.sharePer = "% require.";
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = async () => {
        if (validateForm()) {
            let purchaseInvoiceNo = "";
            await axios.get(`${apiUrl}/purchase/get-id`).then((res) => {
                purchaseInvoiceNo = res.data
            });
            console.log(purchaseInvoiceNo);
            try {
                addPurchase({
                    ...formData,
                    invoiceNo: purchaseInvoiceNo,
                    purDate: moment(formData.purDate).toISOString(),
                    purchaseShareDetails: tBodyData.map(el => {
                        return {
                            id: el.id,
                            lineNo: el.lineNo,
                            shareCode: el.shareCode,
                            sharePercentage: el.sharePercentage,
                            amount: el.amount,
                        }
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
                setFormData(purchaseData);
                setTBodyData([]);
                setDShare({
                    id: uuidv4(),
                    lineNo: 1,
                    shareCode: 0,
                    shareName: "",
                    sharePercentage: 100,
                    amount: 0,
                });
                setOpen(!open);

            }
            catch (err) {
                console.log(err.statusCode);
            }
            setFormData(purchaseData);
            setTBodyData([]);
            setOpen(!open);
        }
    }

    const handleSave = async () => {
        if (validateForm()) {
            let purchaseInvoiceNo = "";
            await axios.get(`${apiUrl}/purchase/get-id`).then((res) => {
                purchaseInvoiceNo = res.data
            });
            try {
                addPurchase({
                    ...formData,
                    invoiceNo: purchaseInvoiceNo,
                    purDate: moment(formData.purDate).toISOString(),
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
                setFormData(purchaseData);
                setTBodyData([]);
                axios.get(`${apiUrl}/share/get-owner`).then((res) => {
                    setTBodyData([
                        {
                            ...dShare,
                            shareCode: res.data.shareCode,
                            shareName: res.data.shareName,
                            sharePercentage: 100,
                            amount: 0,
                        }
                    ]);
                    setDShare({
                        ...dShare,
                        shareCode: res.data.shareCode,
                        shareName: res.data.shareName,
                        sharePercentage: 100,
                        amount: 0,
                    });
                });
            }
            catch (err) {
                console.log(err.statusCode);
            }
            setFormData(purchaseData);
            setTBodyData([]);
        }
    };

    const handleUpdate = () => {
        if (validateForm()) {
            try {
                updatePurchase({
                    invoiceNo: formData.invoiceNo,
                    purDate: formData.purDate,
                    supplierCode: formData.supplierCode,
                    stoneCode: formData.stoneCode,
                    qty: formData.qty,
                    totalWeight: formData.totalWeight,
                    unitCode: formData.unitCode,
                    unitPrice: formData.unitPrice,
                    subTotal: formData.subTotal,
                    servicePer: formData.servicePer,
                    serviceCharge: formData.serviceCharge,
                    discAmt: formData.discAmt,
                    grandTotal: formData.grandTotal,
                    remark: formData.remark,
                    status: formData.status,
                    paidStatus: formData.paidStatus,
                    createdBy: formData.createdBy,
                    createdAt: formData.createdAt,
                    updatedBy: auth().username,
                    updatedAt: formData.updatedAt,
                    deletedBy: "",
                    purchaseShareDetails: tBodyData.map(el => {
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
                setFormData(purchaseData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(purchaseData);
            setOpen(!open);
        }
    };

    const saveShare = () => {

        if(validateShare()) {
            let isExist = tBodyData.find(res => res.shareCode === shares.shareCode);
            if(!isExist){
                let newTbody = tBodyData.filter(el => el.shareCode !== dShare.shareCode);
                newTbody.push(
                    {
                        ...dShare,
                        sharePercentage: dShare.sharePercentage - shares.sharePercentage,
                        amount: ((dShare.sharePercentage - shares.sharePercentage) / 100) * formData.grandTotal,
                    }
                )
                newTbody.push({
                    ...shares,
                    lineNo: tBodyData.length + 1,
                });
                setTBodyData(newTbody);
                setDShare({
                    ...dShare,
                    sharePercentage: dShare.sharePercentage - shares.sharePercentage,
                    amount: ((dShare.sharePercentage - shares.sharePercentage) / 100) * formData.grandTotal,
                });
                setShares(shareInfo);
            } else {
                setAlert({
                    isAlert: true,
                    message: "Share already exist in the list."
                });
            }
            
        }
    };

    const editShare = (id) => {
        let share = tBodyData.find(rec => rec.id === id);
        setShares(share);
        setIsEditShare(true);
        setOldPer(share.sharePercentage);
    };

    const updateShare = () => {
        let newTbody = tBodyData.map(el => {
            if (el.id === shares.id) {
                return {
                    ...el,
                    sharePercentage: shares.sharePercentage,
                    amount: (shares.sharePercentage / 100) * formData.grandTotal,
                }
            } else if (el.shareCode === dShare.shareCode) {
                return {
                    ...el,
                    sharePercentage: (el.sharePercentage + oldPer) - shares.sharePercentage,
                    amount: (((el.sharePercentage + oldPer) - shares.sharePercentage) / 100) * formData.grandTotal,
                }
            } else {
                return el;
            }
        });
        setTBodyData(newTbody);
        setShares(shareInfo);
        setIsEditShare(false);
        setDShare({
            ...dShare,
            sharePercentage: 100 - shares.sharePercentage,
            amount: ((dShare.sharePercentage - shares.sharePercentage) / 100) * formData.grandTotal,
        });
    };

    const deleteShare = (id, sharePer, shareAmt) => {
        const leftData = tBodyData.filter(rec => rec.id !== id);
        let newData = [];
        leftData.map((rec, index) => {
            if (rec.shareCode === dShare.shareCode) {
                newData.push({
                    ...rec,
                    lineNo: index + 1,
                    sharePercentage: rec.sharePercentage + sharePer,
                    amount: rec.amount + shareAmt,
                });
            } else {
                newData.push({
                    ...rec,
                    lineNo: index + 1
                });
            }
        });
        setTBodyData(newData);
        // setFormData({
        //     ...formData,
        //     purchaseShareDetails: formData.purchaseShareDetails.filter(rec => rec.id !== id)
        // });
        setDShare({
            ...dShare,
            sharePercentage: dShare.sharePercentage + sharePer,
            amount: dShare.amount + shareAmt,
        })
    };

    const shareColumn = [
        {
            name: 'Share Name',
            selector: row => row.shareName,
        },
        {
            name: 'Share(%)',
            width: "90px",
            center: true,
            selector: row => row.sharePercentage,
        },
        {
            name: 'Amount',
            width: "150px",
            right: "true",
            selector: row => row.amount.toLocaleString(),
        },
        {
            name: 'Action',
            center: "true",
            width: "80px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button 
                        variant="text"
                        color="deep-purple" 
                        className="p-2" 
                        onClick={() => editShare(row.id)}
                        disabled={ row.shareCode === dShare.shareCode? true : isEditShare? true : false } 
                    >
                        <FaPencil />
                    </Button>
                    <Button 
                        variant="text" 
                        color="red" 
                        className="p-2" 
                        onClick={() => deleteShare(row.id, row.sharePercentage, row.amount)} 
                        disabled={ row.shareCode === dShare.shareCode? true : isEditShare? true : false} 
                    >
                        <FaTrashCan />
                    </Button>
                </div>
            )
        },
    ];

    const column = [
        {
            name: 'Invoice No',
            width: '200px',
            selector: row => row.Code,
            omit: true,
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
            width: "130px",
            selector: row => row.PurDate,
        },
        {
            name: 'Grand Total',
            width: "150px",
            selector: row => row.GrandTotal,
            right: "true",
        },
        {
            name: 'Supplier',
            width: "200px",
            selector: row => row.Supplier,

        },
        {
            name: "Stone",
            width: "200px",
            selector: row => row.Stone
        },
        {
            name: "Quantity",
            width: "100px",
            selector: row => row.Qty,
            center: "true"
        },
        {
            name: "Weight",
            width: "100px",
            selector: row => row.Weight,
            center: "true"
        },
        {
            name: "Unit Price",
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
            name: "Service Amt",
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

    const tbodyData = data?.map((purchaseData) => {
        return {
            Code: purchaseData.invoiceNo,
            PurDate: moment(purchaseData.purDate).format("YYYY-MM-DD"),
            Stone: purchaseData.stone.stoneDesc,
            Supplier: purchaseData.supplier.supplierName,
            Qty: purchaseData.qty.toLocaleString('en-US'),
            Weight: purchaseData.totalWeight,
            UnitPrice: purchaseData.unitPrice.toLocaleString('en-US'),
            SubTotal: purchaseData.subTotal.toLocaleString('en-US'),
            ServicePer: purchaseData.servicePer,
            ServiceCharge: purchaseData.serviceCharge.toLocaleString('en-US'),
            DiscAmt: purchaseData.discAmt.toLocaleString('en-US'),
            GrandTotal: purchaseData.grandTotal.toLocaleString('en-US'),
            Remark: purchaseData.remark,
            PaidStatus: purchaseData.paidStatus,
            CreatedAt: moment(purchaseData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: purchaseData.createdBy,
            UpdatedAt: moment(purchaseData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: purchaseData.updatedBy,
            Status: purchaseData.status,
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
                        Purchase List
                    </Typography>
                    <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                        <FaPlus /> Create New
                    </Button>
                </div>
                <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                    <CardBody className="rounded-sm overflow-auto p-0">
                        <TableList columns={column} data={tbodyData} pending={dataLoad} />
                    </CardBody>
                </Card>
                <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                <Dialog 
                    open={open} size="xl"
                
                >
                    <DialogBody>
                        <ModalTitle titleName="Purchase" handleClick={() => setOpen(!open)} />
                        <div className="grid grid-cols-5 gap-2 mb-3">
                            <div className="col-span-3">
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {/* Supplier Name */}
                                    <div className="col-start-1 col-end-2">
                                        <label className="text-black mb-2 text-sm">Supplier Name</label>
                                        <select
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={formData.supplierCode}
                                            onChange={(e) => {
                                                console.log(e.target.value)
                                                setFormData({
                                                    ...formData,
                                                    supplierCode: Number(e.target.value)
                                                });
                                            }}
                                        >
                                            <option value="0" disabled>Select Supplier</option>
                                            {
                                                supplierData?.map((supplier) => {
                                                    return <option value={supplier.supplierCode} key={supplier.supplierCode} >{supplier.supplierName}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.supplier && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.supplier}</p>
                                        }
                                    </div>
                                    {/* Purchase Date */}
                                    <div className="col-start-3 col-end-3">
                                        <label className="text-black mb-2 text-sm">Purchase Date</label>
                                        <input
                                            type="date"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={moment(formData.purDate).format("YYYY-MM-DD")}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                purDate: e.target.value
                                            })}
                                        />
                                        {
                                            validationText.purDate && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.purDate}</p>
                                        }
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {/* Stone Details */}
                                    <div className="">
                                        <label className="text-black mb-2 text-sm">Stone Description</label>
                                        <select
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={formData.stoneCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    stoneCode: Number(e.target.value),
                                                })
                                            }
                                        >
                                            <option value="0" disabled>Select stone</option>
                                            {
                                                stoneData?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                                    stoneData?.map((stone) => {
                                                        return <option value={stone.stoneCode} key={stone.stoneCode} >{stone.stoneDesc}</option>
                                                    })
                                            }
                                        </select>
                                        {
                                            validationText.stoneCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.stoneCode}</p>
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
                                                value={formData.totalWeight}
                                                onChange={(e) => {
                                                    let weight = parseFloat(e.target.value);
                                                    let totalP = formData.unitPrice * weight;
                                                    let totalA = (totalP + formData.serviceCharge) - formData.discAmt;
                                                    setFormData({
                                                        ...formData,
                                                        totalWeight: weight,
                                                        subTotal: totalP,
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
                                                    let totalP = formData.totalWeight * price;
                                                    let totalA = (totalP + formData.serviceCharge) - formData.discAmt;
                                                    setFormData({
                                                        ...formData,
                                                        unitPrice: price,
                                                        subTotal: totalP,
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
                                        <label className="text-black mb-2 text-sm">Remark</label>
                                        <textarea
                                            className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.remark == null ? "" : formData.remark}
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
                                        {/* Service Charges */}
                                        <div className="grid grid-cols-2">
                                            <div className="col-start-2">
                                                <label className="text-black text-sm mb-2">Charges (%)</label>
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
                                                <label className="text-black text-sm mb-2"> Charges (0.00)</label>
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
                                {/* Select Share */}
                                <div className="col-span-5 grid grid-cols-5 gap-2">
                                    <div className="col-span-3">
                                        <label className="text-black mb-2 text-sm">Share Name</label>
                                        <select
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={shares.shareCode} 
                                            onChange={(e) => setShares({
                                                ...shares,
                                                shareCode: Number(e.target.value),
                                                shareName: e.target.selectedOptions[0].text
                                            })}
                                        >
                                            <option value="0" disabled>Select Share</option>
                                            {
                                                shareData?.map((share) => {
                                                    return <option value={share.shareCode} key={share.shareCode} disabled={share.shareCode === dShare.shareCode? true : false}>{share.shareName}</option>
                                                })
                                            }
                                        </select>
                                            
                                        {
                                            validationText.customer && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customer}</p>
                                        }
                                    </div>
                                    {/* Percentage */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Share(%)</label>
                                        <input
                                            type="number"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={shares.sharePercentage}
                                            onChange={(e) => {
                                                let percentage = Number(e.target.value)
                                                setShares({
                                                    ...shares,
                                                    sharePercentage: percentage,
                                                    amount: (percentage / 100) * formData.grandTotal,
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        {
                                            isEditShare? <Button type="button" variant="gradient" color="deep-purple" className="py-2 px-4 capitalize flex items-center gap-1" onClick={updateShare}>
                                                <FaCirclePlus />
                                                <span>Update</span>
                                            </Button> : 
                                            <Button type="button" variant="gradient" color="deep-purple" className="py-2 px-4 capitalize flex items-center gap-1" onClick={saveShare}>
                                                <FaCirclePlus />
                                                <span>Add</span>
                                            </Button>
                                        }
                                    </div>
                                </div>
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
                                        {
                                            addResult.isLoading? <ButtonLoader /> : <FaFloppyDisk className="text-base" />
                                        }
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
                    payOpen? <Payable payOpen={payOpen} invoiceNo={payData.invoiceNo} balance={payData.balance}  closePay={() => setPayOpen(!payOpen)} /> : <div></div>
                }
            </div>
            

        </>
    );

}

export default PurchaseList;
