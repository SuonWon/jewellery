import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import ModalTitle from "../components/modal_title";
import DataTable from "react-data-table-component";
import { FaCheck, FaFloppyDisk, FaPencil, FaTrashCan, FaXmark } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { useAuthUser } from "react-auth-kit";
import { focusSelect } from "../const";
import { useAddPayableMutation, useFetchPayableQuery, useFetchTrueWalletQuery, useFetchWalletQuery, useRemovePayableMutation, useUpdatePayableMutation } from "../store";
import { AuthContent } from "../context/authContext";
const validator = require('validator');

function Payable(props) {

    //const {permissions} = useContext(AuthContent);

    console.log(props.payablePermission);

    const [payablePermission, setPayablePermission] = useState(props.payablePermission);

    const {data} = useFetchPayableQuery(props.invoiceNo);

    const {data : walletData } = useFetchTrueWalletQuery();

    const [addPayable] = useAddPayableMutation();

    const [updatePayable] = useUpdatePayableMutation();

    const [removePayable] = useRemovePayableMutation();

    const auth = useAuthUser();

    const [ validationText, setValidationText ] = useState({});

    const [ isEdit, setIsEdit ] = useState(false);

    const [ deleteId, setDeleteId ] = useState("");

    const payInfo = {
        id: uuidv4(),
        invoiceNo: "",
        walletName: "",
        walletCode: "",
        paidDate: moment().format("YYYY-MM-DD"),
        amount: 0,
        balance: 0,
        remainBalance: 0,
        type: "Cash",
        status: "O",
        remark: "",
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
    }

    const [payForm, setPayForm] = useState(payInfo);

    let paidAmt = 0;

    if(data) {
        data?.map((el) => {
            paidAmt += el.amount;
        });
    }

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.id === id);
        console.log(removeData);
        removePayable({
            id: removeData[0].id,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => { console.log(res) });
        document.getElementById("deleteWarning").style.display = "none";
    };

    function validatePayable() {
        
        const newErrors = {};

        if(payForm.amount === 0) {
            newErrors.amount = "Amount is required."
        }

        if(validator.isEmpty(payForm.paidDate)) {
            newErrors.paidDate = "Date is required."
        }

        if(validator.isEmpty(payForm.type)) {
            newErrors.type = "Type is required."
        }

        if(validator.isEmpty(payForm.walletCode)) {
            newErrors.walletName = "Wallet Name is required."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const editPayable = (id) => {
        let payData = data.find(res => res.id === id);
        setPayForm({
            ...payForm,
            id: payData.id,
            walletName: payData.wallet.walletName,
            walletCode: payData.walletCode,
            paidDate: payData.paidDate,
            invoiceNo: payData.invoiceNo,
            amount: payData.amount,
            balance: (props.balance - paidAmt) + payData.amount,
            remainBalance: ((props.balance - paidAmt) + payData.amount) - payData.amount,
            type: payData.type,
            status: payData.status,
            remark: payData.remark,
            createdBy: payData.createdBy,
            createdAt: payData.createdAt,
            updatedBy: payData.updatedBy,
            updatedAt: payData.updatedAt,
        });
        setIsEdit(true);
    };

    const deletePayable = (id) => {
        document.getElementById("deleteWarning").style.display = "block";
        setDeleteId(id);
    };

    const handleSubmit = () => {
        if (validatePayable()) {
            addPayable({
                id: payForm.id,
                walletCode: payForm.walletCode,
                walletName: payForm.walletName,
                paidDate: moment(payForm.paidDate).toISOString(),
                invoiceNo: props.invoiceNo,
                amount: payForm.amount,
                balance: payForm.remainBalance,
                type: payForm.type,
                status: payForm.status,
                remark: payForm.remark,
                createdBy: payForm.createdBy,
                updatedBy: "",
                deletedBy: "",
            }).then((res) => {
                console.log(res.data);
            });
            setPayForm(payInfo);
        }
    };

    const handleUpdate = () => {
        if (validatePayable()) {
            updatePayable({
                id: payForm.id,
                walletCode: payForm.walletCode,
                walletName: payForm.walletName,
                paidDate: moment(payForm.paidDate).toISOString(),
                invoiceNo: payForm.invoiceNo,
                amount: payForm.amount,
                balance: payForm.remainBalance,
                type: payForm.type,
                status: payForm.status,
                remark: payForm.remark,
                createdBy: payForm.createdBy,
                createdAt: payForm.createdAt,
                updatedBy: auth().username,
                updatedAt: moment().toISOString(),
                deletedBy: "",
            }).then((res) => {
                console.log(res.data);
            });
            setIsEdit(false);
            setPayForm(payInfo);
        }
    };

    const payColumn = [
        {
            name: 'id',
            selector: row => row.id,
            omit: true,
        },
        {
            name: 'Wallet Name',
            selector: row => row.wallet.walletName,
        },
        {
            name: 'Paid Date',
            selector: row => moment(row.paidDate).format("YYYY-MM-DD"),
        },
        {
            name: 'Method',
            selector: row => row.type,
        },
        {
            name: 'Amount',
            right: "true",
            selector: row => row.amount.toLocaleString(),
        },
        // {
        //     name: 'Balance',
        //     right: "true",
        //     selector: row => row.balance.toLocaleString(),
        // },
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
                        onClick={() => editPayable(row.id)}
                        disabled={isEdit}
                    >
                        <FaPencil />
                    </Button>
                    {
                        payablePermission?.delete ? (
                            <Button 
                                variant="text" 
                                color="red" 
                                className="p-2" 
                                onClick={() => deletePayable(row.id)} 
                                disabled={isEdit}
                            >
                                <FaTrashCan />
                            </Button>
                        ) : null
                    }
                </div>
            )
        },
    ];

    return (
        <> 
        {
            payablePermission != null && payablePermission != undefined ? (
                <Dialog 
                    open={props.payOpen} size="xl"
                >
                    <DialogBody>
                        <ModalTitle titleName="Payable" handleClick={props.closePay}/>
                        <div className="grid grid-cols-6 gap-2 mb-3">
                            <div className="col-span-3">
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {/* Invoice */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Invoice No</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={isEdit?  payForm.invoiceNo : props.invoiceNo}
                                        />
                                    </div>
                                    {/* Pay Date */}
                                    <div className="col-start-3 col-end-3">
                                        <label className="text-black mb-2 text-sm">Paid Date</label>
                                        <input
                                            type="date"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={moment(payForm.paidDate).format("YYYY-MM-DD")}
                                            onChange={(e) => setPayForm({
                                                ...payForm,
                                                paidDate: e.target.value,
                                            })}
                                        />
                                        {
                                            validationText.paidDate && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.paidDate}</p>
                                        }
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {/* Wallet Code */}
                                    <div className="col-span-2">
                                        <label className="text-black mb-2 text-sm">Wallet Name</label>
                                        <select
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={payForm.walletCode}
                                            onChange={(e) => {
                                                setPayForm({
                                                    ...payForm,
                                                    walletName: e.target.selectedOptions[0].text.split(",")[1].trimStart(),
                                                    walletCode: e.target.value,
                                                })
                                            }}
                                        >
                                            <option value="" disabled>Select...</option>
                                            {
                                                walletData?.map((wallet) => {
                                                    return (
                                                        <option key={wallet.id} value={wallet.id}>{wallet.share.shareName}, {wallet.walletName}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.walletName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.walletName}</p>
                                        }
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {/* Payment Method */}
                                    <div className="">
                                        <label className="text-black mb-2 text-sm">Payment Method</label>
                                        <select
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={payForm.type}
                                            onChange={(e) =>
                                                setPayForm({
                                                    ...payForm,
                                                    type: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Bank">Bank</option>
                                        </select>
                                        {
                                            validationText.type && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.type}</p>
                                        }
                                    </div>
                                    {/* Balance */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Balance</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-right"
                                            value={isEdit? payForm.balance.toLocaleString("en-us") : (props.balance - paidAmt).toLocaleString("en-us")}
                                        />
                                    </div>
                                    {/* Amount */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Pay Amount</label>
                                        <input
                                            type="number"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={payForm.amount}
                                            onChange={(e) => {
                                                if (Number(e.target.value <= (props.balance - paidAmt))) {
                                                    setPayForm({
                                                        ...payForm,
                                                        amount: parseFloat(e.target.value),
                                                        balance: isEdit? payForm.balance : props.balance,
                                                        remainBalance: isEdit? payForm.balance - e.target.value : (props.balance -paidAmt) - e.target.value
                                                    });
                                                } else {
                                                    setPayForm({
                                                        ...payForm,
                                                        amount: 0,
                                                        balance: isEdit? payForm.balance : props.balance,
                                                    })
                                                }
                                                
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                    </div>
                                    {/* Balance */}
                                    {/* <div>
                                        <label className="text-black text-sm mb-2">Remaining Balance</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-right"
                                            value={payForm.remainBalance.toLocaleString('en-us')}
                                        />
                                    </div> */}
                                </div>
                                {/* Remark */}
                                <div className="grid col-span-3 h-fit">
                                    <label className="text-black mb-2 text-sm">Remark</label>
                                    <textarea
                                        className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                        value={payForm.remark == null ? "" : payForm.remark}
                                        rows="2"
                                        onChange={(e) => {
                                            setPayForm({
                                                ...payForm,
                                                remark: e.target.value
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-3 grid grid-cols-5 gap-2 h-fit">
                                <div role="alert" className="col-start-4 col-end-6" id="deleteWarning">
                                    <div className="bg-yellow-100 flex items-center justify-between text-yellow-900 font-bold rounded-md px-2 py-2">
                                        <span>Are you sure?</span>
                                        <div className="flex gap-2">
                                            <Button 
                                                color="red"
                                                variant="gradient"
                                                className="p-2"
                                                onClick={() => {
                                                    document.getElementById("deleteWarning").style.display = "none";
                                                }}
                                            >
                                                <FaXmark />
                                            </Button>
                                            <Button 
                                                color="deep-purple"
                                                variant="gradient"
                                                className="p-2"
                                                onClick={() => handleRemove(deleteId)}
                                            >
                                                <FaCheck />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {/* Payable table list */}
                                <div className="col-span-5">
                                    <Card className="w-full shadow-sm border border-blue-gray-200 rounded-md">
                                        <CardBody className="overflow-auto rounded-md p-0">
                                            <DataTable 
                                                columns={payColumn} 
                                                data={data} 
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
                                            <div className="grid grid-cols-6 gap-2 my-3">
                                                <label className="text-black mb-2 text-sm col-span-2 col-start-3 text-right">Total Paid Amount :</label>
                                                <label className="text-black mb-2 text-sm text-right">{paidAmt.toLocaleString('en-us')}</label>
                                            </div>
                                        </CardBody>
                                    </Card>
        
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-6 gap-2">
                            {
                                isEdit? (
                                    payablePermission?.update ? (
                                        <>
                                            <Button 
                                                onClick={() => {
                                                    setPayForm(payInfo);
                                                    setIsEdit(false);
                                                }} 
                                                color="gray" 
                                                size="sm" 
                                                variant="gradient" 
                                                className="flex items-center gap-2"
                                            >
                                                <FaFloppyDisk className="text-base" />
                                                <Typography variant="small" className="capitalize">
                                                    Cancel
                                                </Typography>
                                            </Button>
                                            <Button onClick={handleUpdate} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                                <FaFloppyDisk className="text-base" />
                                                <Typography variant="small" className="capitalize">
                                                    Update
                                                </Typography>
                                            </Button>
                                        </>
                                    ): null
                                ) : (
                                    payablePermission?.create ? (
                                        props.balance === paidAmt ? "" : <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                            <FaFloppyDisk className="text-base" />
                                            <Typography variant="small" className="capitalize">
                                                Save
                                            </Typography>
                                        </Button>
                                    ) : null
                                )
                            }
                        </div> 
                    </DialogBody>   
                </Dialog>
            ) : <div>Loading...</div>
        }
        </>
    );
}

export default Payable;