import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import ModalTitle from "../components/modal_title";
import DataTable from "react-data-table-component";
import { FaCheck, FaFloppyDisk, FaPencil, FaTrashCan, FaXmark } from "react-icons/fa6";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { useAuthUser } from "react-auth-kit";
import { focusSelect } from "../const";
import { useAddReceivableMutation, useFetchOwnerWalletQuery, useFetchReceivableQuery, useRemoveReceivableMutation, useUpdateReceivableMutation } from "../store";
import ListLoader from "../components/customLoader";
const validator = require('validator');

function Receivable(props) {

    const [receivablePermission] = useState(props.receivablePermission);

    console.log(receivablePermission);

    const {data, isLoading: dataLoad} = useFetchReceivableQuery(props.invoiceNo);

    const { data: walletData } = useFetchOwnerWalletQuery();

    const [addReceivable] = useAddReceivableMutation();

    const [updateReceivable] = useUpdateReceivableMutation();

    const [removeReceivable] = useRemoveReceivableMutation();

    const auth = useAuthUser();

    const [ validationText, setValidationText ] = useState({});

    const [ isEdit, setIsEdit ] = useState(false);

    const [ deleteId, setDeleteId ] = useState("");

    const payInfo = {
        id: uuidv4(),
        invoiceNo: "",
        walletName: "",
        walletCode: "",
        receivedDate: moment().format("YYYY-MM-DD"),
        amount: 0,
        balance: 0,
        type: "Cash",
        status: "O",
        remark: "",
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
    }

    const [payForm, setPayForm] = useState(payInfo);

    let receivedAmt = 0;

    if(data) {
        data?.map((el) => {
            receivedAmt += el.amount;
        });
    }

    function validatePayable() {
        
        const newErrors = {};

        if(payForm.amount === 0) {
            newErrors.amount = "Amount is required."
        }

        if(validator.isEmpty(payForm.receivedDate)) {
            newErrors.receivedDate = "Date is required."
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
            paidDate: payData.paidDate,
            invoiceNo: payData.invoiceNo,
            walletName: payData.wallet.walletName,
            walletCode: payData.walletCode,
            amount: payData.amount,
            balance: (props.balance - receivedAmt) + payData.amount,
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

    const deleteReceivable = (id) => {
        document.getElementById("deleteWarning").style.display = "block";
        setDeleteId(id);
    };

    const handleSubmit = () => {
        if (validatePayable()) {
            addReceivable({
                id: payForm.id,
                receivedDate: moment(payForm.receivedDate).toISOString(),
                invoiceNo: props.invoiceNo,
                walletCode: payForm.walletCode,
                walletName: payForm.walletName,
                amount: payForm.amount,
                balance: 0,
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

    const handleRemove = async (id) => {
        let removeData = data.find((el) => el.id === id);
        console.log(removeData);
        removeReceivable({
            id: removeData.id,
            walletName: removeData.wallet.walletName,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => { console.log(res) });
        document.getElementById("deleteWarning").style.display = "none";
    };

    const handleUpdate = () => {
        if (validatePayable()) {
            updateReceivable({
                id: payForm.id,
                receivedDate: moment(payForm.receivedDate).toISOString(),
                invoiceNo: payForm.invoiceNo,
                amount: payForm.amount,
                walletCode: payForm.walletCode,
                walletName: payForm.walletName,
                balance: 0,
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
            name: 'Received Date',
            selector: row => moment(row.receivedDate).format("YYYY-MM-DD"),
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
                        receivablePermission?.delete ? (
                            <Button 
                                variant="text" 
                                color="red" 
                                className="p-2" 
                                onClick={() => deleteReceivable(row.id)} 
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
            <Dialog 
                open={props.payOpen} size="xl"
            >
                <DialogBody>
                    <ModalTitle titleName="Receivable" handleClick={props.closePay} />
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
                                    <label className="text-black mb-2 text-sm">Received Date</label>
                                    <input
                                        type="date"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={moment(payForm.paidDate).format("YYYY-MM-DD")}
                                        onChange={(e) => setPayForm({
                                            ...payForm,
                                            receivedDate: e.target.value,
                                        })}
                                    />
                                    {
                                        validationText.receivedDate && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.receivedDate}</p>
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
                                                walletName: e.target.selectedOptions[0].text,
                                                walletCode: e.target.value,
                                            })
                                        }}
                                    >
                                        <option value="" disabled>Select...</option>
                                        {
                                            walletData?.map((wallet) => {
                                                return (
                                                    <option key={wallet.id} value={wallet.id}>{wallet.walletName}</option>
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
                                        value={isEdit? payForm.balance.toLocaleString("en-us") : (props.balance - receivedAmt).toLocaleString("en-us")}
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
                                            if (Number(e.target.value <= (props.balance - receivedAmt))) {
                                                setPayForm({
                                                    ...payForm,
                                                    amount: parseFloat(e.target.value),
                                                    balance: isEdit? payForm.balance : props.balance,
                                                    remainBalance: isEdit? payForm.balance - e.target.value : (props.balance -receivedAmt) - e.target.value
                                                });
                                            } else {
                                                setPayForm({
                                                    ...payForm,
                                                    amount: 0,
                                                    balance: isEdit? payForm.balance : props.balance,
                                                });
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
                            {/* Receivable table list */}
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
                                            progressPending={dataLoad}
			                                progressComponent={<ListLoader />}
                                        />
                                        <div className="grid grid-cols-6 gap-2 my-3">
                                            <label className="text-black mb-2 text-sm col-span-2 col-start-3 text-right">Total Paid Amount :</label>
                                            <label className="text-black mb-2 text-sm text-right">{receivedAmt.toLocaleString('en-us')}</label>
                                        </div>
                                    </CardBody>
                                </Card>
    
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end mt-6 gap-2">
                        {
                            isEdit? (
                                receivablePermission?.update ? (
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
                                ) : null
                            ) : (
                                // receivablePermission?.create ? (
                                    props.balance === receivedAmt ? "" : <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save
                                        </Typography>
                                    </Button>
                                // ) : null
                            )
                        }
                    </div> 
                </DialogBody>         
            </Dialog>
        </>
    );
}

export default Receivable;