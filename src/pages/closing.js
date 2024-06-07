import { Button, Card, CardBody, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react";
import { useCallback, useState } from "react";
import DataTable from "react-data-table-component";
import { useLocation } from "react-router-dom";
import { useAddClosingMutation, useFetchCashInOutDetailsQuery, useFetchOpeningQuery, useFetchPurchaseDetailsQuery, useFetchSalesDetailsQuery } from "../store";
import moment from "moment";
import { useAuthUser } from "react-auth-kit";
import SuccessAlert from "../components/success_alert";
import { FaCartShopping, FaCircleMinus, FaCirclePlus, FaEquals, FaMoneyBill1 } from "react-icons/fa6";
import { GiDiamondTrophy } from "react-icons/gi";

function Closing() {

    const location = useLocation();

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

    const purchaseAmt = purchaseDetails?.reduce((res, {grandTotal}) => res + grandTotal, 0);

    const salesAmt = salesDetails?.reduce((res, {grandTotal}) => res + grandTotal, 0);

    // const purchaseAmt = 0
    // const salesAmt = 0

    // console.log(purchaseDetails)
    // console.log(salesDetails)


    console.log(`Purchase: ${purchaseAmt}, Sales: ${salesAmt}`)

    const balance = (((openingData?.opening + openingData?.stock + salesAmt + openingData?.cashIn) - purchaseAmt) - openingData?.cashOut);

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
    });

    const [addClosing] = useAddClosingMutation();

    // console.log(`Start: ${startDate}, End: ${endDate}, Balance: ${balance}`);

    const [activeTab, setActiveTab] = useState("purchase");

    // const [selectedData, setSelectedData] = useState([]);

    // const [purchaseSelectAll, setPurchaseSelectAll] = useState(false);

    // const [isPurchaseSelected, setIsPurchaseSelected] = useState(false);

    // const [purchaseData, setPurchaseData] = useState([
    //     {
    //         id: 1,
    //         stone: "Stone 1",
    //         count: 50,
    //         amount: 2000000,
    //         paidAmount: 1500000,
    //         isSelect: false,
    //     },
    //     {
    //         id: 2,
    //         stone: "Stone 2",
    //         count: 100,
    //         amount: 3000000,
    //         paidAmount: 2000000,
    //         isSelect: false,
    //     },
    //     {
    //         id: 3,
    //         stone: "Stone 3",
    //         count: 150,
    //         amount: 2500000,
    //         paidAmount: 2000000,
    //         isSelect: false,
    //     },
    //     {
    //         id: 4,
    //         stone: "Stone 4",
    //         count: 150,
    //         amount: 2500000,
    //         paidAmount: 2000000,
    //         isSelect: false,
    //     },
    //     {
    //         id: 5,
    //         stone: "Stone 5",
    //         count: 150,
    //         amount: 2500000,
    //         paidAmount: 2000000,
    //         isSelect: false,
    //     },
    // ]);

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

    const handleSubmit = () => {
        addClosing({
            balanceAmt: Number(balance),
            transactionStartDate: startDate,
            transactionEndDate: moment(endDate).toISOString(),
            updatedBy : auth().username
        }).then((res) => {
            if(res) {
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

    // const handlePurchaseSelectAll = (isSelect) => {
    //     setPurchaseSelectAll(isSelect)
    //     if (isSelect) {
    //         setPurchaseData(purchaseData.map((data) => {
    //             return {...data, isSelect: true}
    //         }));
    //     } else {
    //         setPurchaseData(purchaseData.map((data) => {
    //             return {...data, isSelect: false}
    //         }));
    //     }
    // }

    // const handlePurchaseSelect = (isSelect) => {
    //     setIsPurchaseSelected(!isPurchaseSelected)
    // }

    return (
        <div className="text-start w-full p-4">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                }
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
                    </TabsHeader>
                    <div className="flex justify-end">
                        <Button 
                            variant="gradient" 
                            size="sm" 
                            color="deep-purple" 
                            className="flex items-center gap-2 capitalize h-[40px]" 
                            onClick={handleSubmit}
                        >
                            Confirm & Close Transaction
                        </Button>
                    </div>
                </div>
                <TabsBody>
                    <TabPanel className="px-0 py-2" key="purchase" value="purchase">
                        {/* <div>
                            <table className="mt-4 w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr className="border-y border-blue-gray-100 bg-blue-gray-50/50">
                                        <th className="p-2 text-center w-[50px]">
                                            <input 
                                                type="checkbox" 
                                                id="selectAll" 
                                                checked={purchaseSelectAll} 
                                                onChange={(e) => {
                                                    handlePurchaseSelectAll(e.target.checked)
                                                }}
                                            />
                                        </th>
                                        <th className="p-2">
                                            Stone Name
                                        </th>
                                        <th className="p-2">
                                            Count
                                        </th>
                                        <th className="p-2 text-end">
                                            Amount
                                        </th>
                                        <th className="p-2 text-end">
                                            Paid Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        purchaseData?.map((data) => {
                                            return (
                                                <tr className="border-y border-blue-gray-100" key={data.id}>
                                                    <td className="text-center w-[50px] p-2">
                                                        <input type="checkbox" 
                                                            checked={data.isSelect} 
                                                            onChange={(e) => {
                                                                handlePurchaseSelect()
                                                            }} 
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        {data.stone}
                                                    </td>
                                                    <td className="p-2">
                                                        {data.count}
                                                    </td>
                                                    <td className="p-2 text-end">
                                                        {data.amount.toLocaleString('en-us')}
                                                    </td>
                                                    <td className="p-2 text-end">
                                                        {data.paidAmount.toLocaleString('en-us')}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div> */}
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
                            // subHeader
                            // subHeaderComponent={props.isSearch? "" : searchBox}
                            // subHeaderAlign="right"
                            // subHeaderWrap
                            // progressPending={props.pending}
                            // progressComponent={<ListLoader />}
                        />
                    </TabPanel>
                    <TabPanel key="sales" value="sales">
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
                            // subHeader
                            // subHeaderComponent={props.isSearch? "" : searchBox}
                            // subHeaderAlign="right"
                            // subHeaderWrap
                            // progressPending={props.pending}
                            // progressComponent={<ListLoader />}
                        />
                    </TabPanel>
                    <TabPanel key="cashInOut" value="cashInOut">
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
                            // subHeader
                            // subHeaderComponent={props.isSearch? "" : searchBox}
                            // subHeaderAlign="right"
                            // subHeaderWrap
                            // progressPending={props.pending}
                            // progressComponent={<ListLoader />}
                        />
                    </TabPanel>
                </TabsBody>
            </Tabs>
        </div>
    );
};

export default Closing;