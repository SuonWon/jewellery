/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaEye, FaFloppyDisk, FaPencil, FaPlus, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { focusSelect, pause } from "../const";
import { useAddWalletTransactionMutation, useFetchWalletQuery, useFetchWalletTransactionQuery, useRemoveWalletTransactionMutation, useUpdateWalletTransactionMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
const validator = require('validator');

function Wallet() {

    const { data } = useFetchWalletTransactionQuery();

    const { data: walletData } = useFetchWalletQuery();

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [isEdit, setIsView] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const [isCashIn, setIsCashIn] = useState(true);

    const [isCashOut, setIsCashOut] = useState(false);

    const [removeTransaction, removeResult] = useRemoveWalletTransactionMutation();

    const [addTransaction] = useAddWalletTransactionMutation();

    const [updateTransaction] = useUpdateWalletTransactionMutation();

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: ''
    });

    const transactionData = {
        id: "",
        walletCode: "",
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("hh:mm:ss"),
        cashType: "",
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
        // let removeData = data.filter((el) => el.damageNo === id);
        // removeDamage({
        //     id: removeData[0].damageNo,
        //     deletedAt: moment().toISOString(),
        //     deletedBy: auth().username
        // }).then((res) => { console.log(res) });
        // setIsAlert(true);
        // setOpenDelete(!openDelete);
        // await pause(2000);
        // setIsAlert(false);
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

    const handleView = (id) => {
        let tempData = data.find(res => res.id === id);
        console.log(tempData);
        setFormData({
            ...tempData,
            time: moment(tempData.date).format("hh:mm:ss")
        });
        if (tempData.cashType === "DEBIT") {
            setIsCashIn(true);
            setIsCashOut(false);
        } else {
            setIsCashIn(false);
            setIsCashOut(true);
        }
        setIsView(true);
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

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const handleSubmit = () => {
        if (validateForm()) {
            try {
                console.log(formData);
                addTransaction({
                    id: uuidv4(),
                    walletCode: formData.walletCode,
                    date: moment(formData.date + "T" + formData.time).toISOString(),
                    cashType: isCashIn? "DEBIT" : "CREDIT",
                    amount: formData.amount,
                    remark: formData.remark,
                    status: formData.status,
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
                    amount: formData.amount,
                    remark: formData.remark,
                    status: formData.status,
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
                    cashType: formData.cashType,
                    amount: formData.amount,
                    remark: formData.remark,
                    status: formData.status,
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
            width: "200px",
            selector: row => row.date,
        },
        {
            name: 'Share',
            width: "200px",
            selector: row => row.shareName,
        },
        {
            name: 'Cash Type',
            width: "200px",
            selector: row => row.cashType,
        },
        {
            name: 'Amount',
            width: "150px",
            selector: row => row.amount,
        },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.remark,
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
            center: true,
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <Link to={`/purchase_edit/${row.Code}`}>
                        <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
                    </Link> */}
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.id)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.id)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((wallet) => {
        return {
            id: wallet.id,
            walletCode: wallet.walletCode,
            date: moment(wallet.date).format("YYYY-MM-DD hh:mm:ss"),
            shareName: wallet.wallet.share.shareName,
            cashType: wallet.cashType,
            amount: wallet.amount.toLocaleString('en-US'),
            remark: wallet.remark,
            createdAt: moment(wallet.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: wallet.createdBy,
            updatedAt: moment(wallet.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: wallet.updatedBy,
            status: wallet.status,
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
                        Wallet List
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
                <Dialog open={open} size="md">
                    <DialogBody>
                        <ModalTitle titleName={isCashIn? "Add Cash In" : "Add Cash Out"} handleClick={() => setOpen(!open)} />
                        <div className="flex items-center justify-start gap-2">
                            <Button 
                                variant={isCashIn? "gradient" : "outlined"}
                                color="deep-purple"
                                className="capitalize"
                                onClick={() => {
                                    setIsCashIn(true);
                                    setIsCashOut(false)
                                }}
                            >
                                Cash In
                            </Button>
                            <Button 
                                variant= {isCashOut? "gradient" : "outlined"}
                                color="deep-purple"
                                className="capitalize"
                                onClick={() => {
                                    setIsCashIn(false);
                                    setIsCashOut(true);
                                }}
                            >
                                Cash Out
                            </Button>
                        </div>
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
                            <div>
                                {/* Wallet Code */}
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
                                            return <option value={wallet.id} key={wallet.id}>{wallet.share.shareName}</option>
                                        })
                                    }
                                </select>
                                {
                                    validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                }
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
                            {/* Qty */}
                            <div>
                                <label className="text-black text-sm mb-2">Cash Type</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={isCashIn? "Cash In" : "Cash Out"}
                                />
                            </div>
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
            </div>

        </>
    );

}

export default Wallet;
