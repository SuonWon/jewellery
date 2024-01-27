/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, IconButton, Typography } from "@material-tailwind/react";
import { FaCircleMinus, FaCirclePlus, FaEquals, FaFilter, FaFloppyDisk, FaTrashCan, FaXmark, } from "react-icons/fa6";
import { BiReset } from "react-icons/bi"
import { useContext, useEffect, useState } from "react";
import { apiUrl, focusSelect, pause } from "../const";
import { useAddWalletTransactionMutation, useFetchTrueShareQuery, useFetchTrueWalletCategoryQuery, useFetchTrueWalletQuery, useFetchWalletNamesQuery, useFetchWalletTransactionCountQuery, useFetchWalletTransactionQuery, useRemoveWalletTransactionMutation, useUpdateWalletTransactionMutation } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContent } from "../context/authContext";

const token = 'Bearer ' + Cookies.get('_auth');

const validator = require('validator');

function Wallet() {

    const { permissions } = useContext(AuthContent);

    const [walletPermission, setWalletPermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setWalletPermission(permissions[21]);

        if(walletPermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, walletPermission, navigate])

    const [filterForm, setFilterForm] = useState({
        skip: 0,
        take: 10,
        status: true,
        walletName: "",
        shareCode: 0,
        category: 0
    })

    const { data: walletData, refetch: refetchShare } = useFetchTrueWalletQuery();

    const { data: walletNames } = useFetchWalletNamesQuery();

    const { data, refetch } = useFetchWalletTransactionQuery(filterForm);

    const { data:dataCount } = useFetchWalletTransactionCountQuery(filterForm);

    const { data: walletCategory} = useFetchTrueWalletCategoryQuery();

    const { data: shareData } = useFetchTrueShareQuery();

    useEffect(() => {
        refetch();
        refetchShare();
    }, []);

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [isEdit, setIsView] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(false);

    const [isCashIn, setIsCashIn] = useState(true);

    const [isCashOut, setIsCashOut] = useState(false);

    const [isFilter, setIsFilter] = useState(false);

    const [openDateModal, setOpenDateModal] = useState(false);

    const [filterData, setFilterData] = useState([]);

    const [removeTransaction] = useRemoveWalletTransactionMutation();

    const [addTransaction] = useAddWalletTransactionMutation();

    const [updateTransaction] = useUpdateWalletTransactionMutation();

    const [currentPage, setCurrentPage] = useState(1);

    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: ""
    });

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: '',
        isWarning: false,
        isError: false,
        title: ""
    });

    let totalCashIn = 0;
    let totalCashOut = 0;
    let total = 0;

    if(isFilter) {
        filterData.map((el) => {
            total += el.amount;
            if(el.cashType === "DEBIT") {
                totalCashIn += el.amount;
            } else if (el.cashType === "CREDIT") {
                totalCashOut += el.amount;
            }
        });
    } else {
        data?.map((el) => {
            total += el.amount;
            if(el.cashType === "DEBIT") {
                totalCashIn += el.amount;
            } else if (el.cashType === "CREDIT") {
                totalCashOut += el.amount;
            }
        });
    }

    const transactionData = {
        id: "",
        walletCode: "",
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("hh:mm:ss"),
        categoryCode: 0,
        paymentMode: "Cash",
        cashType: "",
        isSalesPruchase: false,
        amount: 0,
        remark: "",
        status: true,
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
    };

    const [formData, setFormData] = useState(transactionData);

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    const handleRemove = async (id) => {
        let removeData = {};
        if(isFilter) {
            removeData = filterData.find((el) => el.id === id);
        } else {
            removeData = data.find((el) => el.id === id);
        }
        console.log(removeData);
        await removeTransaction({
            id: removeData.id,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => { console.log(res) });
        if(isFilter) {
            axios.get(`${apiUrl}/transaction/get-all-transactions?status=true&walletCode=${removeData.walletCode}`, {
                headers: {
                    "Authorization": token
                }
            }).then((res) => {
                setFilterData(res.data);
                console.log(res.data);
            });
        }
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
        setFormData(transactionData);
        setIsView(false);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if (validator.isEmpty(formData.date)) {
            newErrors.date = "Date is required."
        }

        if (validator.isEmpty(formData.time)) {
            newErrors.time = "Time is required."
        }

        if (formData.walletCode === 0) {
            newErrors.stoneDetailCode = "Wallet Code is required."
        }

        if (formData.categoryCode === 0) {
            newErrors.categoryCode = "Category Code is required."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const handleSubmit = () => {
        if (validateForm()) {
            try {
                addTransaction({
                    id: uuidv4(),
                    walletCode: formData.walletCode,
                    date: moment(formData.date + "T" + formData.time).toISOString(),
                    cashType: isCashIn? "DEBIT" : "CREDIT",
                    categoryCode: formData.categoryCode,
                    paymentMode: formData.paymentMode,
                    amount: formData.amount,
                    remark: formData.remark,
                    status: formData.status,
                    isSalesPruchase: formData.isSalesPruchase,
                    createdBy: formData.createdBy,
                    updatedBy: formData.updatedBy,
                    deletedBy: formData.deletedBy,
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
                setFormData(transactionData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(transactionData);
            setOpen(!open);
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            try {
                addTransaction({
                    id: uuidv4(),
                    walletCode: formData.walletCode,
                    date: moment(formData.date + "T" + formData.time).toISOString(),
                    cashType: isCashIn? "DEBIT" : "CREDIT",
                    categoryCode: formData.categoryCode,
                    paymentMode: formData.paymentMode,
                    amount: formData.amount,
                    remark: formData.remark,
                    status: formData.status,
                    isSalesPruchase: formData.isSalesPruchase,
                    createdBy: formData.createdBy,
                    updatedBy: formData.updatedBy,
                    deletedBy: formData.deletedBy,
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
                setFormData(transactionData);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(transactionData);
        }
    };

    const handleUpdate = () => {
        if (validateForm()) {
            try {
                console.log(formData);
                updateTransaction({
                    id: formData.id,
                    walletCode: formData.walletCode,
                    date: formData.date,
                    cashType: isCashIn? "DEBIT" : "CREDIT",
                    categoryCode: formData.categoryCode,
                    paymentMode: formData.paymentMode,
                    amount: formData.amount,
                    remark: formData.remark,
                    status: formData.status,
                    isSalesPruchase: formData.isSalesPruchase,
                    createdBy: formData.createdBy,
                    createdAt: formData.createdDate,
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
                setFormData(transactionData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(transactionData);
            setOpen(!open);
        }
    };

    const confirmDateRange = () => {
        console.log(dateRange);
        if (dateRange.startDate !== "" && dateRange.endDate === "") {
            setFilterForm({
                ...filterForm,
                start_date: moment(dateRange.startDate).toISOString(),
                end_date:  moment().toISOString(),
            });
        }
        if (dateRange.startDate !== "" && dateRange.endDate !== "") {
            setFilterForm({
                ...filterForm,
                start_date: moment(dateRange.startDate).toISOString(),
                end_date: moment(dateRange.endDate).toISOString()
            })
        }
        setOpenDateModal(!openDateModal);
    }

    const column = [
        {
            name: 'Status',
            width: '200px',
            selector: row => row.status,
            omit: true
        },
        {
            name: 'Id',
            width: '200px',
            selector: row => row.id,
            omit: true
        },
        {
            name: 'Date',
            width: "130px",
            selector: row => moment(row.date).format('DD-MMM-YYYY hh:mm a').split(' ')[0],
        },
        {
            name: 'Wallet Name',
            width: "200px",
            selector: row => row.walletName,
        },
        {
            name: 'Share',
            width: "150px",
            selector: row => row.shareName,
        },
        {
            name: 'Category',
            width: "120px",
            selector: row => row.categoryName,
            center: true
        },
        {
            name: 'Cash Type',
            width: "150px",
            selector: row => row.cashType == "DEBIT" ? "Cash In" : "Cash Out",
            center: true,
        },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.remark,
        },
        {
            name: 'Amount',
            width: "150px",
            selector: row => row.amount,
            right: true,
        },
        {
            name: 'Payment Mode',
            width: "150px",
            selector: row => row.paymentMode,
            center: true,
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
            name: 'Action',
            center: "true",
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <Link to={`/purchase_edit/${row.Code}`}>
                        <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
                    </Link> */}
                    {/* <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.id)}><FaPencil /></Button> */}
                    {
                        walletPermission?.delete ? (
                            <Button variant="text" color="red" className="p-2" disabled={row.isSalesPruchase} onClick={() => handleDeleteBtn(row.id)}><FaTrashCan /></Button>
                        ) : null
                    }
                </div>
            )
        },
    ];

    const tbodyData = isFilter? filterData.map((el) => {
        return {
            id: el.id,
            walletCode: el.walletCode,
            walletName: el.wallet.walletName,
            date: moment(el.date).format("YYYY-MM-DD hh:mm:ss"),
            shareName: el.wallet.share.shareName,
            cashType: el.cashType,
            categoryCode: el.categoryCode,
            categoryName: el.category.categoryDesc,
            isSalesPruchase: el.isSalesPruchase,
            paymentMode: el.paymentMode,
            amount: el.amount.toLocaleString('en-US'),
            remark: el.remark,
            createdAt: moment(el.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: el.createdBy,
            updatedAt: moment(el.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: el.updatedBy,
            status: el.status,
        }
    }) : data?.map((wallet) => {
        return {
            id: wallet.id,
            walletCode: wallet.walletCode,
            walletName: wallet.wallet.walletName,
            date: moment(wallet.date).format("YYYY-MM-DD hh:mm:ss"),
            shareName: wallet.wallet.share.shareName,
            categoryName: wallet.category.categoryDesc,
            cashType: wallet.cashType,
            categoryCode: wallet.categoryCode,
            paymentMode: wallet.paymentMode,
            amount: wallet.amount.toLocaleString('en-US'),
            remark: wallet.remark,
            createdAt: moment(wallet.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: wallet.createdBy,
            updatedAt: moment(wallet.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: wallet.updatedBy,
            status: wallet.status,
            isSalesPruchase: wallet.isSalesPruchase,
        }
    });

    return (
        <>
        {
            walletPermission != null && walletPermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {/* {
                            isAlert && <SuccessAlert title="Purchase" message="Delete successful." handleAlert={() => setIsAlert(false)} />
                        } */}
                        {
                            alert.isAlert? <SuccessAlert title={alert.title} message={alert.message} isWarning={alert.isWarning} /> : ""
                        }
                    </div>
                    <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                        <Typography variant="h5">
                            Cash In/Out Record
                        </Typography>
                        {
                            walletPermission?.create ? (
                                <div className="flex gap-4">
                                    <Button 
                                        variant="gradient" 
                                        size="sm" 
                                        color="green" 
                                        className="flex items-center gap-2 capitalize" 
                                        onClick={() => {
                                            setIsCashIn(true)
                                            setIsCashOut(false)
                                            handleOpen()
                                        }}
                                    >
                                        <FaCirclePlus /> Cash In
                                    </Button>
                                    <Button 
                                        variant="gradient" 
                                        size="sm" 
                                        color="red" 
                                        className="flex items-center gap-2 capitalize" 
                                        onClick={() => {
                                            setIsCashIn(false)
                                            setIsCashOut(true)
                                            handleOpen()
                                        }}
                                    >
                                        <FaCircleMinus /> Cash Out
                                    </Button>
                                </div>
                            ) : null
                        }
                    </div>
                    <Card className="h-auto shadow-none max-w-screen-xxl rounded-sm p-2 border">
                        <CardBody className="grid grid-cols-3 gap-2 rounded-sm overflow-auto p-2">
                            <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="h6" className="flex items-center gap-2">
                                    <FaCirclePlus className="text-green-700" />
                                    Cash In
                                </Typography>
                                <Typography variant="h5" className="text-end">
                                    {totalCashIn.toLocaleString("en-us")}
                                </Typography>
                            </div>
                            <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="h6" className="flex items-center gap-2">
                                    <FaCircleMinus className="text-red-700" />
                                    Cash Out
                                </Typography>
                                <Typography variant="h5" className="text-end">
                                    {totalCashOut.toLocaleString("en-us")}
                                </Typography>
                            </div>
                            <div className="grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="h6" className="flex items-center gap-2">
                                    <FaEquals className="text-blue-700" />
                                    Net Balance
                                </Typography>
                                <Typography variant="h5" className="text-end">
                                    {(totalCashIn - totalCashOut).toLocaleString("en-us")}
                                </Typography>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                        <CardBody className="grid grid-rows gap-2 rounded-sm overflow-auto p-0">
                            <div className="grid grid-cols-5 gap-2 px-2">
                                {/* Wallet Code */}
                                <div>
                                    <label className="text-black text-sm mb-2">Wallet Name</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={filterForm.walletName}
                                        onChange={(e) => {
                                            setFilterForm({
                                                ...filterForm,
                                                walletName: e.target.value,
                                            });
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="">All</option>
                                        {
                                            walletNames?.map((el) => {
                                                return <option 
                                                    value={el.walletName} 
                                                    key={el.walletName}
                                                >
                                                    {el.walletName}
                                                </option>
                                            })
                                        }
                                    </select>
                                </div>
                                {/* Share Code */}
                                <div>
                                    <label className="text-black text-sm mb-2">Share Name</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={filterForm.shareCode}
                                        onChange={(e) => {
                                            setFilterForm({
                                                ...filterForm,
                                                shareCode: Number(e.target.value),
                                            });
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="0">All</option>
                                        {
                                            shareData?.map((share) => {
                                                return <option 
                                                    value={share.shareCode} 
                                                    key={share.shareCode}
                                                >
                                                    {share.shareName}
                                                </option>
                                            })
                                        }
                                    </select>
                                </div>
                                {/* Start Date */}
                                {/* <div className="">
                                    <label className="text-black mb-2 text-sm">Start Date</label>
                                    <input
                                        type="date"
                                        value={filterForm.startDate}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            if (filterForm.endDate !== "") {
                                                if(moment(e.target.value) > moment(filterForm.endDate)) {
                                                    console.log(e.target.value)
                                                    setAlert({
                                                        isAlert: true,
                                                        message: "Start Date cannot be greater than End Date.",
                                                        isWarning: true,
                                                        title: "Warning"
                                                    });
                                                    setTimeout(() => {
                                                        setAlert({
                                                            isAlert: false,
                                                            message: '',
                                                            isWarning: false,
                                                            title: ''
                                                        })
                                                    }, 2000);
                                                } else {
                                                    setFilterForm({
                                                        ...filterForm,
                                                        startDate: e.target.value,
                                                    });
                                                }
                                            } else {
                                                setFilterForm({
                                                    ...filterForm,
                                                    startDate: e.target.value,
                                                });
                                            }
                                        }}
                                    />
                                </div> */}
                                {/* End Date */}
                                {/* <div className="">
                                    <label className="text-black mb-2 text-sm">End Date</label>
                                    <input
                                        type="date"
                                        value={filterForm.endDate}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            if(filterForm.startDate === "" || moment(e.target.value) < moment(filterForm.startDate)) {
                                                setAlert({
                                                    isAlert: true,
                                                    message: "Start Date cannot be greater than End Date.",
                                                    isWarning: true,
                                                    title: "Warning"
                                                });
                                                setTimeout(() => {
                                                    setAlert({
                                                        isAlert: false,
                                                        message: '',
                                                        isWarning: false,
                                                        title: ''
                                                    })
                                                }, 2000);
                                                
                                                return; 
                                            }
                                            setFilterForm({
                                                ...filterForm,
                                                endDate: e.target.value,
                                            });
                                            // setFilterForm({
                                            //     ...filterForm,
                                            //     endDate: e.target.value,
                                            // });
                                        }}
                                    />
                                </div> */}
                                {/* Wallet Category */}
                                <div>
                                    <label className="text-black text-sm mb-2">Category</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={filterForm.category}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            setFilterForm({...filterForm, category: Number(e.target.value)});
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="0">All</option>
                                        {
                                            walletCategory?.map(category => {
                                                return (
                                                    <option key={category.categoryCode} value={category.categoryCode}>{category.categoryDesc}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button 
                                        className="flex items-center gap-2 bg-main capitalize py-2 px-3" 
                                        onClick={() => {
                                            setFilterForm({
                                                ...filterForm,
                                                startDate: "",
                                                endDate: "",
                                            });
                                            setOpenDateModal(!openDateModal);    
                                        }}
                                    >
                                        <FaFilter /> <span>Date Range</span>
                                    </Button>
                                    {/* <Button className="flex items-center gap-2 bg-main capitalize py-2 px-3" onClick={handleFilter}>
                                        <FaFilter /> <span>Filter</span>
                                    </Button> */}
                                    <Button variant="filled" className="flex items-center capitalize gap-2 py-2 px-3" 
                                        onClick={() => {
                                            setFilterForm({
                                                skip: 0,
                                                take: 10,
                                                status: true,
                                                walletName: "",
                                                shareCode: 0,
                                                category: 0
                                            });
                                        }}
                                    >
                                        <BiReset /> <span>Reset</span>
                                    </Button>
                                </div>
                                <div className="flex flex-col justify-end">
                                    {
                                        dateRange.startDate && <Typography className="flex justify-between" color="black" variant="p">
                                            From {moment(dateRange.startDate).format("DD-MMM-YYYY")} to {moment(dateRange.endDate).format("DD-MMM-YYYY")}
                                        </Typography>
                                    }
                                    {/* <Typography className="flex justify-between" color="black" variant="p">
                                        <span>From</span>
                                        <span>: {dateRange.startDate ? dateRange.startDate : ""}</span>
                                    </Typography>
                                    <Typography className="flex justify-between" color="black" variant="p">
                                        <span>End Date</span>
                                        <span>: {dateRange.endDate ? dateRange.endDate : ""}</span>
                                    </Typography> */}
                                </div>
                            </div>
                            <TableList columns={column} data={tbodyData} isSearch={true} />
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
                                                pageSize={filterForm.take}
                                                onPageChange={(page) => {
                                                    setCurrentPage(page);
                                                    setFilterForm({
                                                        ...filterForm,
                                                        skip: (page - 1) * filterForm.take
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
                    <Dialog open={openDateModal}>
                        <DialogBody>
                            <ModalTitle titleName="Date Range" handleClick={() => setOpenDateModal(!openDateModal)} />
                            {
                                alert.isAlert? <SuccessAlert title={alert.title} message={alert.message} isWarning={alert.isWarning} /> : ""
                            }
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                {/* Start Date */}
                                <div>
                                    <label className="text-black mb-2 text-sm">Start Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            if (dateRange.endDate !== "") {
                                                if(moment(e.target.value) > moment(dateRange.endDate)) {
                                                    console.log(e.target.value)
                                                    setAlert({
                                                        isAlert: true,
                                                        message: "Start Date cannot be greater than End Date.",
                                                        isWarning: true,
                                                        title: "Warning"
                                                    });
                                                    setTimeout(() => {
                                                        setAlert({
                                                            isAlert: false,
                                                            message: '',
                                                            isWarning: false,
                                                            title: ''
                                                        })
                                                    }, 2000);
                                                } else {
                                                    setDateRange({
                                                        ...dateRange,
                                                        startDate: e.target.value,
                                                        endDate: dateRange.endDate? dateRange.endDate : moment().format("MM-DD-YYYY")
                                                    });
                                                }
                                            } else {
                                                setDateRange({
                                                    ...dateRange,
                                                    startDate: e.target.value,
                                                    endDate: dateRange.endDate? dateRange.endDate : moment().format("MM-DD-YYYY")
                                                });
                                            }
                                        }}
                                    />
                                </div>
                                {/* End Date */}
                                <div>
                                    <label className="text-black mb-2 text-sm">End Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            if(dateRange.startDate === "" || moment(e.target.value) < moment(dateRange.startDate)) {
                                                setAlert({
                                                    isAlert: true,
                                                    message: "Start Date cannot be greater than End Date.",
                                                    isWarning: true,
                                                    title: "Warning"
                                                });
                                                setTimeout(() => {
                                                    setAlert({
                                                        isAlert: false,
                                                        message: '',
                                                        isWarning: false,
                                                        title: ''
                                                    })
                                                }, 2000);
                                                
                                                return; 
                                            }
                                            setDateRange({
                                                ...dateRange,
                                                endDate: e.target.value,
                                            });
                                            // setFilterForm({
                                            //     ...filterForm,
                                            //     endDate: e.target.value,
                                            // });
                                        }}
                                    />
                                </div>
                                <div className="col-start-2 flex justify-end mt-3">
                                    <Button className="flex items-center gap-2 bg-main capitalize py-2 px-3" onClick={confirmDateRange}>
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        </DialogBody>
                    </Dialog>
                    <Dialog open={open} size="md">
                        <DialogBody>
                            {/* <ModalTitle titleName={isCashIn? "Add Cash In" : "Add Cash Out"} handleClick={() => setOpen(!open)} /> */}
                            <div className={`mb-3 flex items-center justify-between p-4 ${isCashIn? "bg-green-500" : "bg-red-500"} text-white rounded-md`} >
                                <Typography variant="h5">
                                    {isCashIn? "Add Cash In" : "Add Cash Out"}
                                </Typography>
                                <IconButton variant="text" onClick={() => setOpen(!open)}>
                                    <FaXmark className="text-base text-white"/>
                                </IconButton>
                            </div>
                            {/* <div className="flex items-center justify-start gap-2">
                                <Button 
                                    variant="gradient"
                                    color="green"
                                    className="capitalize"
                                    onClick={() => {
                                        setIsCashIn(true);
                                        setIsCashOut(false)
                                    }}
                                >
                                    Cash In
                                </Button>
                                <Button 
                                    variant="gradient" 
                                    color="red"
                                    className="capitalize"
                                    onClick={() => {
                                        setIsCashIn(false);
                                        setIsCashOut(true);
                                    }}
                                >
                                    Cash Out
                                </Button>
                            </div> */}
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {/* Date */}
                                <div className="">
                                    <label className="text-black mb-2 text-sm">Date</label>
                                    <input
                                        type="date"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={moment(formData.date).format("YYYY-MM-DD")}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            date: e.target.value
                                        })}
                                    />
                                    {
                                        validationText.date && <p className="block text-[12px] text-red-500 font-sans">{validationText.date}</p>
                                    }
                                </div>
                                {/* Time */}
                                <div className="">
                                    <label className="text-black mb-2 text-sm">Time</label>
                                    <input
                                        type="time"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.time}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            time: e.target.value
                                        })}
                                    />
                                    {
                                        validationText.time && <p className="block text-[12px] text-red-500 font-sans">{validationText.time}</p>
                                    }
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {/* Wallet Code */}
                                <div className="col-span-2">
                                    <label className="text-black text-sm mb-2">Share</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={formData.walletCode}
                                        onChange={(e) => {
                                            setFormData({...formData, walletCode: e.target.value});
                                        }}
                                    >
                                        <option value="" disabled>Select...</option>
                                        {
                                            walletData?.map((wallet) => {
                                                return <option value={wallet.id} key={wallet.id}>{wallet.share.shareName}, {wallet.walletName}</option>
                                            })
                                        }
                                    </select>
                                    {
                                        validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                    }
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {/* Payment method */}
                                <div>
                                    <label className="text-black text-sm mb-2">Payment Method</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={formData.paymentMode}
                                        onChange={(e) => {
                                            setFormData({...formData, paymentMode: e.target.value});
                                        }}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Bank">Bank</option>
                                    </select>
                                </div>
                                {/* Amount */}
                                <div>
                                    <label className="text-black text-sm mb-2">Amount</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.amount}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData, 
                                                amount: parseFloat(e.target.value),
                                            });
                                        }}
                                        onFocus={(e) => focusSelect(e)}
                                    />
                                </div>
                                {/* Wallet Category */}
                                <div>
                                    <label className="text-black text-sm mb-2">Category</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={formData.categoryCode}
                                        onChange={(e) => {
                                            setFormData({...formData, categoryCode: Number(e.target.value)});
                                        }}
                                    >
                                        <option value="" disabled>Select...</option>
                                        {
                                            walletCategory?.map(category => {
                                                return (
                                                    <option key={category.categoryCode} value={category.categoryCode}>{category.categoryDesc}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                {/* <div>
                                    <label className="text-black text-sm mb-2">Cash Type</label>
                                    <input
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={isCashIn? "Cash In" : "Cash Out"}
                                    />
                                </div> */}
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
                                        walletPermission?.update ? (
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
                </div>
            ) : <div>Loading...</div>
        }
        </>
    );

}

export default Wallet;
