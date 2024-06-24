import { Button, Card, CardBody, Dialog, DialogBody, DialogFooter, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react";
import { useCallback, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddClosingMutation, useFetchCashInOutDetailsQuery, useFetchOpeningQuery, useFetchPayableDetailsQuery, useFetchPurchaseDetailsQuery, useFetchReceivableDetailsQuery, useFetchSalesDetailsQuery } from "../store";
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

    const endDate = moment(params.get('endDate')).toISOString();

    const auth = useAuthUser();

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
            width: "250px",
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
            name: 'Reference No',
            width: "150px",
            selector: row => row.referenceNo,
            center: true
        },
        {
            name: 'Category',
            width: "120px",
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
            selector: row => row.walletName,
        },
        {
            name: 'Received Date',
            selector: row => moment(row.receivedDate).format('DD-MMM-YYYY hh:mm a').split(' ')[0],
        },
        {
            name: 'Invoice No',
            selector: row => row.invoiceNo,
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName
        },
        {
            name: 'Stone Desc',
            selector: row => row.stoneDesc
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

        console.log(array);

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

    const exportCashInOut = useMemo(() => <Export onExport={() => downloadCSV(cashInOutDetails, "Cash In/Out List")} />, [cashInOutDetails])

    const exportPayable = useMemo(() => <Export onExport={() => downloadCSV(payableDetails, "Payable List")} />, [payableDetails])

    const exportReceivable = useMemo(() => <Export onExport={() => downloadCSV(receivableDetails, "Receivable List")} />, [receivableDetails])

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
                <div className="flex flex-row grid grid-cols-2 gap-2 justify-between">
                    <TabsHeader
                        className="bg-transparent w-min-fit gap-4 px-0 py-2"
                        indicatorProps={{
                        className: "bg-main/80",
                        }}
                    >
                        <Tab
                            key="purchase"
                            value="purchase"
                            onClick={() => setActiveTab("purchase")}
                            className={activeTab === "purchase" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Purchase
                        </Tab>
                        <Tab
                            key="sales"
                            value="sales"
                            onClick={() => setActiveTab("sales")}
                            className={activeTab === "sales" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Sales
                        </Tab>
                        <Tab
                            key="cashInOut"
                            value="cashInOut"
                            onClick={() => setActiveTab("cashInOut")}
                            className={activeTab === "cashInOut" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Cash In/Out
                        </Tab>
                        <Tab
                            key="payable"
                            value="payable"
                            onClick={() => setActiveTab("payable")}
                            className={activeTab === "payable" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Payable
                        </Tab>
                        <Tab
                            key="receivable"
                            value="receivable"
                            onClick={() => setActiveTab("receivable")}
                            className={activeTab === "receivable" ? "text-white" : "bg-gray-500/50 rounded-md"}
                        >
                            Receivable
                        </Tab>
                    </TabsHeader>
                </div>
                <TabsBody>
                    <TabPanel className="px-0 py-2" key="purchase" value="purchase">
                        <DataTable 
                            columns={purchaseColumn} 
                            data={purchaseDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="650px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={exportPurchase}
                        />
                    </TabPanel>
                    <TabPanel className="px-0 py-2" key="sales" value="sales">
                        <DataTable 
                            columns={salesColumn} 
                            data={salesDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="650px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={exportSales}
                        />
                    </TabPanel>
                    <TabPanel className="px-0 py-2" key="cashInOut" value="cashInOut">
                        <DataTable 
                            columns={cashInOutColumn} 
                            data={cashInOutDetails?.filter((res) => res.categoryDesc !== "Payable" && res.categoryDesc !== "Receivable")} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="650px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={exportCashInOut}
                        />
                    </TabPanel>
                    <TabPanel className="px-0 py-2" key="payable" value="payable">
                        <DataTable 
                            columns={payableColumn} 
                            data={payableDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="650px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={exportPayable}
                        />
                    </TabPanel>
                    <TabPanel className="px-0 py-2" key="receivable" value="receivable">
                        <DataTable 
                            columns={receivableColumn} 
                            data={receivableDetails} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="650px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6b7280",
                                        color: "white"
                                    }
                                }
                            }}
                            actions={exportReceivable}
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
                        Are you sure?
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