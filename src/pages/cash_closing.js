import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import SuccessAlert from "../components/success_alert";
import { FaCartShopping, FaCircleMinus, FaCirclePlus, FaEquals, FaFolderClosed, FaMoneyBill1 } from "react-icons/fa6";
import { GiDiamondTrophy } from "react-icons/gi";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { useFetchCashInOutDataQuery, useFetchCloseDateQuery, useFetchOpeningQuery, useFetchPurchaseDataQuery, useFetchSalesDataQuery } from "../store";
import { useState } from "react";

function CashClosing() {

    const startDateOfYear = moment().startOf('year').format('YYYY-MM-DD');

    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

    const { data : startDate } = useFetchCloseDateQuery();

    const { data: openingData } = useFetchOpeningQuery({
        start_date: startDate? startDate : startDateOfYear,
        end_date: endDate
    });

    const { data: purchaseData } = useFetchPurchaseDataQuery({
        start_date: startDate? startDate : startDateOfYear,
        end_date: endDate
    });

    const { data: salesData } = useFetchSalesDataQuery({
        start_date: startDate? startDate : startDateOfYear,
        end_date: endDate
    });

    const { data: cashInOutData } = useFetchCashInOutDataQuery({
        start_date: startDate? startDate : startDateOfYear,
        end_date: endDate
    });

    const balance = (((openingData?.opening + openingData?.stock + openingData?.sales + openingData?.cashIn) - openingData?.purchase) - openingData?.cashOut);

    const purchaseColumn = [
        {
            name: 'Stone',
            selector: row => row.stoneDesc,
            width: '250px'
        },
        {
            name: 'Count',
            selector: row => row.count.toLocaleString('en-us'),
        },
        {
            name: 'Amount',
            selector: row => row.grandTotal.toLocaleString('en-us'),
            right: true,
            width: "160px"
        },
        {
            name: 'Paid Amount',
            selector: row => row.paidAmount === null ? 0 : row.paidAmount.toLocaleString('en-us'),
            right: true,
            width: "160px"
        },
    ];

    const salesColumn = [
        {
            name: 'Stone',
            selector: row => row.stoneDesc,
            width: '250px'
        },
        {
            name: 'Count',
            selector: row => row.count.toLocaleString('en-us'),
        },
        {
            name: 'Amount',
            selector: row => row.grandTotal.toLocaleString('en-us'),
            right: true,
            width: "160px"
        },
        {
            name: 'Paid Amount',
            selector: row => row.receivedAmount === null ? 0 : row.receivedAmount.toLocaleString('en-us'),
            right: true,
            width: "160px"
        },
    ];

    const cashInColumn = [
        {
            name: 'Category',
            selector: row => row.categoryDesc,
        },
        {
            name: 'Count',
            selector: row => row.count,
        },
        {
            name: 'Cash In Amount',
            selector: row => row.amount,
            right: true
        },
    ];

    const cashOutColumn = [
        {
            name: 'Category',
            selector: row => row.categoryDesc,
        },
        {
            name: 'Count',
            selector: row => row.count,
        },
        {
            name: 'Cash In Amount',
            selector: row => row.amount,
            right: true
        },
    ];

    return (
        <div className="flex flex-col gap-2 relative max-w-[85%] min-w-[85%]">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {/* {
                    alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                } */}
            </div>
            {/* Cash Closing */}
            <div className="flex items-center justify-between py-3 bg-white gap-4 sticky top-0 z-10">
                <Typography variant="h5">
                    Cash Balance
                </Typography>
                <div className="flex items-end gap-3">
                    <div className="">
                        <label className="text-black mb-2 text-sm">Start Date</label>
                        <input
                            type="date"
                            value={moment(startDate).format('YYYY-MM-DD')}
                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                            onChange={(e) => {}}
                        />
                    </div>
                    <div className="">
                        <label className="text-black mb-2 text-sm">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                            onChange={(e) => {
                                setEndDate(moment(e.target.value).format('YYYY-MM-DD'))
                                console.log(e.target.value);
                            }}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Link to={`/closing?startDate=${startDate}&endDate=${endDate}`}>
                            <Button 
                                variant="gradient" 
                                size="sm" 
                                color="deep-purple" 
                                className="flex items-center gap-2 capitalize h-[40px]" 
                                onClick={() => {}}
                            >
                                <FaFolderClosed /> Closing
                            </Button>
                        </Link>
                    </div>
                </div>   
            </div>
            <Card className="h-auto shadow-none max-w-screen-xxl rounded-sm p-2 border">
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
                            {openingData?.purchase.toLocaleString("en-us")}
                        </Typography>
                    </div>
                    <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography variant="paragraph" className="flex items-center justify-end gap-2">
                            <FaMoneyBill1 className="text-cyan-500" />
                            Sales
                        </Typography>
                        <Typography variant="h6" className="text-end">
                            {openingData?.sales.toLocaleString("en-us")}
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
            {/* Purchase & Sales */}
            <div className="flex flex-row grid grid-cols-2 gap-4">
                <div className="flex flex-col pt-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h6">
                        Purchase
                    </Typography>
                    <Card className="h-auto shadow-none w-full rounded-sm p-2 border">
                        <CardBody className="rounded-sm overflow-auto p-2">
                            <DataTable 
                                columns={purchaseColumn} 
                                data={purchaseData} 
                                striped={true}
                                fixedHeader={true}
                                fixedHeaderScrollHeight="400px"
                                customStyles={{
                                    headCells: {
                                        style: {
                                            background: "#6e46b9",
                                            color: "white"
                                        }
                                    }
                                }}
                                // subHeader
                                // subHeaderComponent={props.isSearch? "" : searchBox}
                                // subHeaderAlign="right"
                                // subHeaderWrap
                                //progressPending={props.pending}
                                //progressComponent={<ListLoader />}
                            />
                            {/* <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="paragraph" className="flex items-center gap-2">
                                    <GiDiamondTrophy className="text-purple-500" />
                                    Stone
                                </Typography>
                                <Typography variant="h6" className="text-end">
                                    1,000
                                    {walletBalance?.cashIn.toLocaleString("en-us")}
                                </Typography>
                            </div>
                            <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="paragraph" className="flex items-center gap-2">
                                    <FaCopyright className="text-blue-700" />
                                    Count
                                </Typography>
                                <Typography variant="h6" className="text-end">
                                    5,000
                                    {walletBalance?.cashOut.toLocaleString("en-us")}
                                </Typography>
                            </div>
                            <div className="grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="paragraph" className="flex items-center gap-2">
                                    <FaEquals className="text-orange-500" />
                                    Amount
                                </Typography>
                                <Typography variant="h6" className="text-end">
                                    5,000,000
                                    {walletBalance?.cashIn.toLocaleString("en-us")}
                                </Typography>
                            </div> */}
                        </CardBody>
                    </Card>
                </div>
                <div className="flex flex-col pt-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h6">
                        Sales
                    </Typography>
                    <Card className="h-auto shadow-none rounded-sm p-2 border">
                        <CardBody className="w-full rounded-sm overflow-auto p-2">
                            <DataTable 
                                columns={salesColumn} 
                                data={salesData} 
                                striped={true}
                                fixedHeader={true}
                                fixedHeaderScrollHeight="400px"
                                customStyles={{
                                    headCells: {
                                        style: {
                                            background: "darkcyan",
                                            color: "white"
                                        }
                                    }
                                }}
                                // subHeader
                                // subHeaderComponent={props.isSearch? "" : searchBox}
                                // subHeaderAlign="right"
                                // subHeaderWrap
                                //progressPending={props.pending}
                                //progressComponent={<ListLoader />}
                            />
                            {/* <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="paragraph" className="flex items-center gap-2">
                                    <GiDiamondTrophy className="text-purple-500" />
                                    Stone
                                </Typography>
                                <Typography variant="h6" className="text-end">
                                    500
                                    {walletBalance?.cashIn.toLocaleString("en-us")}
                                </Typography>
                            </div>
                            <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="paragraph" className="flex items-center gap-2">
                                    <FaCopyright className="text-blue-700" />
                                    Count
                                </Typography>
                                <Typography variant="h6" className="text-end">
                                    3,000
                                    {walletBalance?.cashOut.toLocaleString("en-us")}
                                </Typography>
                            </div>
                            <div className="grid grid-rows gap-2 justify-center items-center">
                                <Typography variant="paragraph" className="flex items-center gap-2">
                                    <FaEquals className="text-orange-500" />
                                    Amount
                                </Typography>
                                <Typography variant="h6" className="text-end">
                                    1,500,000
                                    {walletBalance?.cashIn.toLocaleString("en-us")}
                                </Typography>
                            </div> */}
                        </CardBody>
                    </Card>
                </div>
            </div>
            {/* Cash In/Out */}
            <div className="flex items-center pt-3 bg-white gap-4 sticky top-0 z-10">
                <Typography variant="h6">
                    Cash In/Out
                </Typography>
            </div>
            <div className="flex flex-row grid grid-cols-2 gap-4">
                <Card className="h-auto shadow-none max-w-screen-xxl rounded-sm p-2 border mb-3">
                    <CardBody className="w-full rounded-sm overflow-auto p-2">
                        <DataTable 
                            columns={cashInColumn} 
                            data={cashInOutData?.filter(data => data.cashType === "DEBIT" && data.categoryDesc !== "Receivable" )} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="400px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "green",
                                        color: "white"
                                    }
                                }
                            }}
                            // subHeader
                            // subHeaderComponent={props.isSearch? "" : searchBox}
                            // subHeaderAlign="right"
                            // subHeaderWrap
                            //progressPending={props.pending}
                            //progressComponent={<ListLoader />}
                        />
                        {/* <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                            <Typography variant="paragraph" className="flex items-center gap-2">
                                <GiDiamondTrophy className="text-purple-500" />
                                Category
                            </Typography>
                            <Typography variant="h6" className="text-end">
                                500
                                {walletBalance?.cashIn.toLocaleString("en-us")}
                            </Typography>
                        </div>
                        <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                            <Typography variant="paragraph" className="flex items-center gap-2">
                                <FaCirclePlus className="text-green-700" />
                                Cash In
                            </Typography>
                            <Typography variant="h6" className="text-end">
                                3,000,000,000
                                {walletBalance?.cashOut.toLocaleString("en-us")}
                            </Typography>
                        </div>
                        <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                            <Typography variant="paragraph" className="flex items-center gap-2">
                                <FaCircleMinus className="text-red-700" />
                                Cash Out
                            </Typography>
                            <Typography variant="h6" className="text-end">
                                1,500,000
                                {walletBalance?.cashIn.toLocaleString("en-us")}
                            </Typography>
                        </div>
                        <div className="border-r-2 grid grid-rows gap-2 justify-center items-center">
                            <Typography variant="paragraph" className="flex items-center gap-2">
                                <FaCopyright className="text-blue-700" />
                                Count
                            </Typography>
                            <Typography variant="h6" className="text-end">
                                500
                                {walletBalance?.cashIn.toLocaleString("en-us")}
                            </Typography>
                        </div>
                        <div className="grid grid-rows gap-2 justify-center items-center">
                            <Typography variant="paragraph" className="flex items-center gap-2">
                                <FaEquals className="text-red-700" />
                                Amount
                            </Typography>
                            <Typography variant="h6" className="text-end">
                                999,500,000,000
                                {walletBalance?.cashIn.toLocaleString("en-us")}
                            </Typography>
                        </div> */}
                    </CardBody>
                </Card>
                <Card className="h-auto shadow-none max-w-screen-xxl rounded-sm p-2 border mb-3">
                    <CardBody className="w-full rounded-sm overflow-auto p-2">
                        <DataTable 
                            columns={cashOutColumn} 
                            data={cashInOutData?.filter(data => data.cashType === "CREDIT" && data.categoryDesc !== "Payable")} 
                            striped={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight="400px"
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#991b1b",
                                        color: "white"
                                    }
                                }
                            }}
                            // subHeader
                            // subHeaderComponent={props.isSearch? "" : searchBox}
                            // subHeaderAlign="right"
                            // subHeaderWrap
                            //progressPending={props.pending}
                            //progressComponent={<ListLoader />}
                        />
                    </CardBody>
                </Card>
            </div>
            
        </div>
    );
}

export default CashClosing;