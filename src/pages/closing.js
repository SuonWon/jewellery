import { Button, Card, CardBody, Dialog, DialogBody, DialogFooter, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react";
import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddClosingMutation, useFetchAdjustmentDetailsQuery, useFetchCashInOutDetailsQuery, useFetchDamageDetailsQuery, useFetchIssueDetailsQuery, useFetchOpeningQuery, useFetchPayableDetailsQuery, useFetchPurchaseDetailsQuery, useFetchReceivableDetailsQuery, useFetchReturnDetailsQuery, useFetchSalesDetailsQuery } from "../store";
import moment from "moment";
import { useAuthUser } from "react-auth-kit";
import SuccessAlert from "../components/success_alert";
import { FaCartShopping, FaCircleMinus, FaCirclePlus, FaEquals, FaMoneyBill1 } from "react-icons/fa6";
import { GiDiamondTrophy } from "react-icons/gi";

function Closing() {

    const location = useLocation();

    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);

    const startDate = params.get('startDate');

    const endDate = params.get('endDate');

    const auth = useAuthUser();

    const [purchaseReturn, setPurchaseReturn] = useState([]);

    const [salesReturn, setSalesReturn] = useState([]);

    const [issueReturn, setIssueReturn] = useState([]);

    const { data: openingData } = useFetchOpeningQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: purchaseDetails } = useFetchPurchaseDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: salesDetails } = useFetchSalesDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: cashInOutDetails } = useFetchCashInOutDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: payableDetails } = useFetchPayableDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: receivableDetails } = useFetchReceivableDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: adjustmentDetails } = useFetchAdjustmentDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: damageDetails } = useFetchDamageDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: returnDetails } = useFetchReturnDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: issueDetails } = useFetchIssueDetailsQuery({
        start_date: startDate,
        end_date: endDate
    });

    useEffect(() => {
        if (returnDetails) {
            setPurchaseReturn(returnDetails.filter((item) => item.returnType === "P"));
            setSalesReturn(returnDetails.filter((item) => item.returnType === "S"));
            setIssueReturn(returnDetails.filter((item) => item.returnType === "I"));
        }
    },[returnDetails]);

    const purchaseAmt = payableDetails?.reduce((res, {amount}) => res + amount, 0);

    const salesAmt = receivableDetails?.reduce((res, {amount}) => res + amount, 0);

    const balance = (((openingData?.opening + openingData?.stock + salesAmt + openingData?.cashIn) - purchaseAmt) - openingData?.cashOut);

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
    });

    const [addClosing] = useAddClosingMutation();

    const [activeTab, setActiveTab] = useState("purchase");

    const [open, setOpen] = useState(false);

    const purchaseColumn = [
        {
            name: 'Status',
            width: '120px',
            selector: row => row.status === 'O' ? 
            <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                Open
            </div>
            : row.status === 'V' ? 
                <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                    Void
                </div> :
                <div className="bg-orange-500 px-3 py-[5px] text-white rounded-xl">
                    Closed
                </div>,
            center: 'true'
        },
        {
            name: 'Invoice No',
            width: '130px',
            selector: row => row.isComplete? <div className="bg-blue-500 px-3 py-[5px] text-white rounded-xl">
                {row.invoiceNo}
            </div> : <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                {row.invoiceNo}
            </div>,
            center: true,
        },
        {
            name: 'Paid Status',
            width: '120px',
            selector: row => row.paidStatus === 'PAID' ? 
            <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                Paid
            </div> : row.paidStatus === 'UNPAID'?
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
            selector: row => moment(row.purDate).format('YYYY-MM-DD'),
        },
        {
            name: 'Grand Total',
            width: "150px",
            selector: row => row.grandTotal.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: "Stone",
            width: "140px",
            selector: row => row.stoneDesc
        },
        {
            name: "Stone Type",
            width: "100px",
            selector: row => row.typeDesc
        },
        {
            name: "Quantity",
            width: "80px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: "Weight",
            width: "80px",
            selector: row => row.totalWeight,
            center: "true"
        },
        {
            name: "Unit Price",
            width: "150px",
            selector: row => Math.round(row.unitPrice).toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Sub Total',
            width: "150px",
            selector: row => row.subTotal.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Supplier',
            width: "200px",
            selector: row => row.supplierName,

        },
        {
            name: "Service (%)",
            width: "150px",
            selector: row => row.servicePer,
            center: "true"
        },
        {
            name: "Service Amt",
            width: "150px",
            selector: row => row.serviceCharge.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Discount Amt',
            width: "150px",
            selector: row => row.discAmt.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Remark',
            width: "300px",
            selector: row => row.remark,
        },
    ];

    const salesColumn = [
        {
            name: 'Invoice No',
            width: '200px',
            selector: row => row.invoiceNo,
        },
        {
            name: 'Status',
            width: '100px',
            selector: row => row.status === 'O' ? 
                <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                    Open
                </div>
                : row.status === 'V' ? 
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
            selector: row => row.paidStatus === 'PAID' ? 
            <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                Paid
            </div> : row.paidStatus === 'UNPAID'?
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
            selector: row => moment(row.salesDate).format("YYYY-MM-DD"),
        },
        {
            name: 'Grand Total',
            width: "150px",
            selector: row => row.grandTotal.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Customer',
            width: "200px",
            selector: row => row.customerName,
        },
        {
            name: 'Stone Detail',
            width: "300px",
            selector: row => row.stoneDesc,
        },
        {
            name: 'Issue No',
            width: '150px',
            selector: row => row.issueNo,
        },
        {
            name: 'Qty',
            width: "100px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "100px",
            selector: row => row.weight,
            center: "true"
        },
        {
            name: 'Unit Price',
            width: "150px",
            selector: row => Math.round(row.unitPrice).toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Sub Total',
            width: "150px",
            selector: row => row.subTotal.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: "Service (%)",
            width: "150px",
            selector: row => row.servicePer,
            center: "true"
        },
        {
            name: 'Service Amt',
            width: "150px",
            selector: row => row.serviceCharge.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Discount Amt',
            width: "150px",
            selector: row => row.discAmt.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Remark',
            width: "300px",
            selector: row => row.remark,
        },
    ];

    const cashInOutColumn = [
        {
            name: 'Status',
            width: '150px',
            selector: row => row.status,
            omit: true
        },
        {
            name: 'Id',
            width: '150px',
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
            name: 'Reference No',
            width: "120px",
            selector: row => row.referenceNo,
            center: true
        },
        {
            name: 'Category',
            width: "180px",
            selector: row => row.categoryDesc,
            center: true
        },
        {
            name: 'Cash Type',
            width: "150px",
            selector: row => row.cashType === "DEBIT" ? <div className="w-[90px] flex items-center justify-center text-white h-7 rounded-full bg-green-500">
                Cash In
            </div> : <div className="w-[90px] flex items-center justify-center text-white h-7 rounded-full bg-red-500">
                Cash Out
            </div>,
            center: true,
        },
        {
            name: 'Remark',
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
    ];

    const payableColumn = [
        {
            name: 'Wallet Name',
            selector: row => row.walletName,
        },
        {
            name: 'Paid Date',
            selector: row => moment(row.paidDate).format('DD-MMM-YYYY hh:mm a').split(' ')[0],
        },
        {
            name: 'Invoice No',
            selector: row => row.invoiceNo,
        },
        {
            name: 'Supplier Name',
            selector: row => row.supplierName,
        },
        {
            name: 'Stone',
            selector: row => row.stoneDesc
        },
        {
            name: 'Type',
            selector: row => row.typeDesc
        },
        {
            name: 'Method',
            selector: row => row.type,
        },
        {
            name: 'Amount',
            selector: row => row.amount.toLocaleString('en-us'),
            right: true
        },
    ];

    const receivableColumn = [
        {
            name: 'Wallet Name',
            width: '14%',
            selector: row => row.walletName,
        },
        {
            name: 'Received Date',
            width: '10%',
            selector: row => moment(row.receivedDate).format('DD-MMM-YYYY hh:mm a').split(' ')[0],
        },
        {
            name: 'Invoice No',
            width: '10%',
            selector: row => row.invoiceNo,
        },
        {
            name: 'Customer Name',
            width: '15%',
            selector: row => row.customerName
        },
        {
            name: 'Stone Desc',
            width: "28%",
            selector: row => row.stoneDesc
        },
        {
            name: 'Method',
            width: "8%",
            selector: row => row.type,
        },
        {
            name: 'Amount',
            width: '15%',
            selector: row => row.amount.toLocaleString('en-us'),
            right: true
        },
    ];

    const adjustmentColumn = [
        {
            name: 'Status',
            width: '120px',
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
            name: 'Adjustment No',
            width: '150px',
            selector: row => row.adjustmentNo,
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => moment(row.timezone).format('YYYY-MM-YY'),
        },
        {
            name: "Adjustment Type",
            width: "120px",
            selector: row => row.adjustmentType === "+" ? "Gain" : "Loss"
        },
        {
            name: 'Reference No',
            width: "150px",
            selector: row => row.referenceNo,
        },
        {
            name: 'Stone Detail',
            width: "300px",
            selector: row => row.stoneDesc,
        },
        {
            name: 'Qty',
            width: "120px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "120px",
            selector: row => row.weight,
            center: "true"
        },
        {
            name: 'Unit',
            width: "120px",
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
            width: "300px",
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
    ];

    const damageColumn = [
        {
            name: 'Status',
            width: '120px',
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
            width: '150px',
            selector: row => row.damageNo,
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => moment(row.timezone).format('YYYY-MM-YY'),
        },
        {
            name: 'Reference No',
            width: "150px",
            selector: row => row.referenceNo,
        },
        {
            name: 'Stone Detail',
            width: "300px",
            selector: row => row.stoneDesc,
        },
        {
            name: 'Qty',
            width: "120px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "120px",
            selector: row => row.weight,
            center: "true"
        },
        {
            name: 'Unit',
            width: "120px",
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
            width: "300px",
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
    ];

    const issueColumn = [
        {
            name: 'Status',
            width: '120px',
            selector: row => row.status === 'O' ? 
                <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                    Open
                </div>
                : row.status === 'V' ? 
                    <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                        Void
                    </div> 
                : <div className="bg-orange-500 px-3 py-[5px] text-white rounded-xl">
                        Closed
                    </div>,
            center: 'true'
        },
        {
            name: 'Issue No',
            width: '130px',
            selector: row => row.isComplete? <div className="bg-blue-500 px-3 py-[5px] text-white rounded-xl">
                {row.issueNo}
            </div> : <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                {row.issueNo}
            </div>,
            center: true,
        },
        {
            name: 'Date',
            width: "130px",
            selector: row => moment(row.timezone).format('YYYY-MM-DD'),
        },
        {
            name: 'Stone Detail',
            width: "250px",
            selector: row => row.stoneDesc,
        },
        {
            name: 'Quantity',
            width: "100px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "100px",
            selector: row => row.weight,
            center: "true"

        },
        {
            name: 'Unit',
            width: "100px",
            selector: row => row.unitCode,
            center: "true"
        },
        {
            name: 'Unit Price',
            width: "130px",
            selector: row => row.unitPrice.toLocaleString('en-us'),
            right: "true",
        },
        {
            name: 'Total Price',
            width: "130px",
            selector: row => row.totalPrice.toLocaleString('en-us'),
            right: "true",
        },
        // {
        //     name: 'Agents',
        //     width: "300px",
        //     selector: row => row.issueMember?.map(el => {
        //         return `${el.customer.customerName}, `
        //     })
        // },
        {
            name: 'Remark',
            selector: row => row.remark,
        },
    ];

    const returnColumn = [
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
            selector: row => row.returnNo,
        },
        {
            name: 'Date',
            selector: row => moment(row.timezone).format('YYYY-MM-DD'),
        },
        {
            name: 'Reference No',
            selector: row => row.referenceNo,
        },
        {
            name: 'Type',
            width: "100px",
            selector: row => row.returnType === 'I' ? "Issue" : row.returnType === 'S' ? "Sales" : "Purchase",
        },
        {
            name: 'Stone Detail',
            width: "300px",
            selector: row => row.stoneDesc,
        },
        {
            name: 'Qty',
            width: "100px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "100px",
            selector: row => row.weight,
            center: "true"
        },
        {
            name: 'Unit',
            width: "100px",
            selector: row => row.unitCode,
            center: "true"
        },
        {
            name: 'Unit Price',
            width: "180px",
            selector: row => row.unitPrice.toLocaleString('en-us'),
            right: "true"
        },
        {
            name: 'Total Price',
            width: "180px",
            selector: row => row.totalPrice.toLocaleString('en-us'),
            right: "true"
        },
        {
            name: 'Remark',
            width: "300px",
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
    ];

    const handleOpen = () => {
        setOpen(!open);
    }

    const handleSubmit = () => {
        navigate(`/closing_preview?startDate=${startDate}&endDate=${endDate}`);
        addClosing({
            balanceAmt: Number(balance),
            transactionStartDate: startDate,
            transactionEndDate: moment(endDate).toISOString(),
            updatedBy : auth().username
        }).then((res) => {
            if(res) {
                setOpen(false);
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Create close transaction successfully.",
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
        })
    }

    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(array[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    function downloadCSV(array, fName) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = fName;

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    const Export = ({ onExport }) => <Button onClick={e => {
        onExport(e.target.value)
    }}>Export</Button>;

    const exportPurchase = useMemo(() => <Export onExport={() => downloadCSV(purchaseDetails, "Purchase List")} />, [purchaseDetails]);

    const exportSales = useMemo(() => <Export onExport={() => downloadCSV(salesDetails, "Sales List")} />, [salesDetails]);

    const exportCashInOut = useMemo(() => <Export onExport={() => downloadCSV(cashInOutDetails, "Cash In/Out List")} />, [cashInOutDetails]);

    const exportPayable = useMemo(() => <Export onExport={() => downloadCSV(payableDetails, "Payable List")} />, [payableDetails]);

    const exportReceivable = useMemo(() => <Export onExport={() => downloadCSV(receivableDetails, "Receivable List")} />, [receivableDetails]);

    const exportDamage = useMemo(() => <Export onExport={() => downloadCSV(damageDetails, "Receivable List")} />, [damageDetails]);

    const exportAdjustment = useMemo(() => <Export onExport={() => downloadCSV(adjustmentDetails, "Receivable List")} />, [adjustmentDetails]);

    const exportIssue = useMemo(() => <Export onExport={() => downloadCSV(issueDetails, "Receivable List")} />, [issueDetails]);

    const exportPurchaseReturn = useMemo(() => <Export onExport={() => downloadCSV(purchaseReturn, "Receivable List")} />, [purchaseReturn]);

    const exportSalesReturn = useMemo(() => <Export onExport={() => downloadCSV(salesReturn, "Receivable List")} />, [salesReturn]);

    const exportIssueReturn = useMemo(() => <Export onExport={() => downloadCSV(issueReturn, "Receivable List")} />, [issueReturn]);

    return (
        <div className="text-start w-full p-4">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                }
            </div>
            <div className="flex items-center justify-between py-3 bg-white gap-4 sticky top-0 z-10">
                <Typography variant="h5">
                    Cash Closing
                </Typography>
                <div className="flex gap-4">
                    <Button 
                        variant="gradient" 
                        size="sm" 
                        color="deep-purple" 
                        className="flex items-center gap-2 capitalize h-[40px]" 
                        onClick={handleOpen}
                    >
                        Confirm & Close Transaction
                    </Button>
                    <Button 
                        variant="gradient" 
                        size="sm" 
                        color="light-blue" 
                        className="flex items-center gap-2 capitalize h-[40px]" 
                        onClick={() => {
                            navigate(`/stock_closing_preview?startDate=${startDate}&endDate=${endDate}`);
                        }}
                    >
                        Stock Closing Preview
                    </Button>
                </div> 
            </div>
            <Card className="h-auto shadow-none max-w-screen-xxl rounded-sm p-2 mb-2 border">
                <CardBody className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 rounded-sm overflow-auto p-2">
                    <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <FaMoneyBill1 className="text-purple-500" />
                            Opening
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            {openingData?.opening.toLocaleString("en-us")}
                        </Typography>
                    </div>
                    <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <GiDiamondTrophy className="text-blue-700" />
                            Stock Opening
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            {openingData?.stock.toLocaleString("en-us")}
                        </Typography>
                    </div>
                    <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <FaCartShopping className="text-orange-500" />
                            Purchase
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            {purchaseAmt?.toLocaleString("en-us")}
                        </Typography>
                    </div>
                    <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <FaMoneyBill1 className="text-cyan-500" />
                            Sales
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            {salesAmt?.toLocaleString("en-us")}
                        </Typography>
                    </div>
                    <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <FaCirclePlus className="text-green-700" />
                            Cash In
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            {openingData?.cashIn.toLocaleString("en-us")}
                        </Typography>
                    </div>
                    <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <FaCircleMinus className="text-red-700" />
                            Cash Out
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            {openingData?.cashOut.toLocaleString("en-us")}
                        </Typography>
                    </div>
                    <div className=" grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <FaEquals className="text-blue-700" />
                            Balance
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            { balance.toLocaleString('en-us') }
                        </Typography>
                    </div>
                </CardBody>
            </Card>
            <Tabs value={activeTab}>
                <div className="flex flex-row grid grid-cols-1 gap-2 justify-between">
                    <TabsHeader
                        className="bg-transparent w-min-fit gap-2 px-0 py-2"
                        indicatorProps={{
                        className: "bg-main/80",
                        }}
                    >
                        {/* Purchase */}
                        <Tab
                            key="purchase"
                            value="purchase"
                            onClick={() => setActiveTab("purchase")}
                            className={activeTab === "purchase" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Purchase
                        </Tab>
                        {/* Sales */}
                        <Tab
                            key="sales"
                            value="sales"
                            onClick={() => setActiveTab("sales")}
                            className={activeTab === "sales" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Sales
                        </Tab>
                        {/* Cash In/Out */}
                        <Tab
                            key="cashInOut"
                            value="cashInOut"
                            onClick={() => setActiveTab("cashInOut")}
                            className={activeTab === "cashInOut" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Cash In/Out
                        </Tab>
                        {/* Payable */}
                        <Tab
                            key="payable"
                            value="payable"
                            onClick={() => setActiveTab("payable")}
                            className={activeTab === "payable" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Payable
                        </Tab>
                        {/* Receivable */}
                        <Tab
                            key="receivable"
                            value="receivable"
                            onClick={() => setActiveTab("receivable")}
                            className={activeTab === "receivable" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Receivable
                        </Tab>
                        {/* Adjustment */}
                        <Tab
                            key="adjustment"
                            value="adjustment"
                            onClick={() => setActiveTab("adjustment")}
                            className={activeTab === "adjustment" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Adjustment
                        </Tab>
                        {/* Damage */}
                        <Tab
                            key="damage"
                            value="damage"
                            onClick={() => setActiveTab("damage")}
                            className={activeTab === "damage" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Damage
                        </Tab>
                        {/* Issue */}
                        <Tab
                            key="issue"
                            value="issue"
                            onClick={() => setActiveTab("issue")}
                            className={activeTab === "issue" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Issue
                        </Tab>
                        {/* Purchase Return */}
                        <Tab
                            key="purchaseReturn"
                            value="purchaseReturn"
                            onClick={() => setActiveTab("purchaseReturn")}
                            className={activeTab === "purchaseReturn" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Purchase Return
                        </Tab>
                        {/* Sales Return */}
                        <Tab
                            key="salesReturn"
                            value="salesReturn"
                            onClick={() => setActiveTab("salesReturn")}
                            className={activeTab === "salesReturn" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Sales Return
                        </Tab>
                        {/* Issue Return */}
                        <Tab
                            key="issueReturn"
                            value="issueReturn"
                            onClick={() => setActiveTab("issueReturn")}
                            className={activeTab === "issueReturn" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Issue Return
                        </Tab>
                    </TabsHeader>
                </div>
                <TabsBody>
                    {/* Purchase */}
                    <TabPanel className="px-0 py-2" key="purchase" value="purchase">
                        <DataTable 
                            columns={purchaseColumn} 
                            data={purchaseDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={purchaseDetails?.length > 0 ? exportPurchase : null}
                        />
                    </TabPanel>
                    {/* Sales */}
                    <TabPanel className="px-0 py-2" key="sales" value="sales">
                        <DataTable 
                            columns={salesColumn} 
                            data={salesDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={salesDetails?.length > 0 ? exportSales : null}
                        />
                    </TabPanel>
                    {/* Cash In/Out */}
                    <TabPanel className="px-0 py-2" key="cashInOut" value="cashInOut">
                        <DataTable 
                            columns={cashInOutColumn} 
                            data={cashInOutDetails?.filter((res) => res.categoryDesc !== "Payable" && res.categoryDesc !== "Receivable")} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={cashInOutDetails?.length > 0 ? exportCashInOut : null}
                        />
                    </TabPanel>
                    {/* Payable */}
                    <TabPanel className="px-0 py-2" key="payable" value="payable">
                        <DataTable 
                            columns={payableColumn} 
                            data={payableDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={payableDetails?.length > 0 ? exportPayable : null}
                        />
                    </TabPanel>
                    {/* Receivable */}
                    <TabPanel className="px-0 py-2" key="receivable" value="receivable">
                        <DataTable 
                            columns={receivableColumn} 
                            data={receivableDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={receivableDetails?.length > 0 ? exportReceivable : null}
                        />
                    </TabPanel>
                    {/* Adjustment */}
                    <TabPanel className="px-0 py-2" key="adjustment" value="adjustment">
                        <DataTable 
                            columns={adjustmentColumn} 
                            data={adjustmentDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={adjustmentDetails?.length > 0 ? exportAdjustment : null}
                        />
                    </TabPanel>
                    {/* Damage */}
                    <TabPanel className="px-0 py-2" key="damage" value="damage">
                        <DataTable 
                            columns={damageColumn} 
                            data={damageDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={damageDetails?.length > 0 ? exportDamage : null}
                        />
                    </TabPanel>
                    {/* Issue */}
                    <TabPanel className="px-0 py-2" key="issue" value="issue">
                        <DataTable 
                            columns={issueColumn} 
                            data={issueDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={issueDetails?.length > 0 ? exportIssue : null}
                        />
                    </TabPanel>
                    {/* Purchase Return */}
                    <TabPanel className="px-0 py-2" key="purchaseReturn" value="purchaseReturn">
                        <DataTable 
                            columns={returnColumn} 
                            data={purchaseReturn} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={purchaseReturn?.length > 0 ? exportPurchaseReturn : null}
                        />
                    </TabPanel>
                    {/* Sales Return */}
                    <TabPanel className="px-0 py-2" key="salesReturn" value="salesReturn">
                        <DataTable 
                            columns={returnColumn} 
                            data={salesReturn} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={salesReturn?.length > 0 ? exportSalesReturn : null}
                        />
                    </TabPanel>
                    {/* Issue Return */}
                    <TabPanel className="px-0 py-2" key="issueReturn" value="issueReturn">
                        <DataTable 
                            columns={returnColumn} 
                            data={issueReturn} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="450px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={issueReturn?.length > 0 ? exportIssueReturn : null}
                        />
                    </TabPanel>
                </TabsBody>
            </Tabs>
            <Dialog
                open={open}
                size="xs"
                handler={handleOpen}
            >
                <DialogBody>
                    <Typography className="text-center" variant="h5">
                        Are you sure want to close all transactions?
                    </Typography>
                </DialogBody>
                <DialogFooter className="pt-0 flex justify-center">
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-2"
                    >
                        <span>No</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleSubmit}
                    >
                        <span>Yes</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default Closing;