import { Button, Card, CardBody, Typography } from "@material-tailwind/react"
import moment from "moment";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchCashInOutDataQuery, useFetchLastPayableQuery, useFetchLastReceivableQuery, useFetchOpeningQuery, useFetchPurchaseDataQuery, useFetchSalesDataQuery } from "../store";
import DataTable from "react-data-table-component";

function ClosingPreview() {

    const location = useLocation();

    const params = new URLSearchParams(location.search);

    const startDate = params.get('startDate');

    const endDate = params.get('endDate');

    const printDate = moment().format('DD MMM YYYY');

    const { data: openingData } = useFetchOpeningQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: purchaseData } = useFetchPurchaseDataQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: payableData } = useFetchLastPayableQuery({
        start_date: startDate,
        end_date: endDate + "T23:59:59.999Z"
    });

    const { data: salesData } = useFetchSalesDataQuery({
        start_date: startDate,
        end_date: endDate
    });

    const { data: receivableData } = useFetchLastReceivableQuery({
        start_date: startDate,
        end_date: endDate + "T23:59:59.999Z"
    });

    const { data: cashInOutData } = useFetchCashInOutDataQuery({
        start_date: startDate,
        end_date: endDate
    });

    const balance = (((openingData?.opening + openingData?.stock + openingData?.sales + openingData?.cashIn) - openingData?.purchase) - openingData?.cashOut);

    const purchaseAmt = purchaseData?.reduce((res, {grandTotal}) => res + grandTotal, 0);

    const salesAmt = salesData?.reduce((res, {grandTotal}) => res + grandTotal, 0);

    const totalPayable = payableData?.reduce((res, {totalAmount}) => res + totalAmount, 0);

    const totalReceivable = receivableData?.reduce((res, {totalAmount}) => res + totalAmount, 0);

    const handlePrint = () => {
        const printBtn = document.getElementById('printBtn');
        printBtn.style.display='none'
        window.print();
        printBtn.style.display=''

        window.location.href = "/cash_closing";
    }

    return (
        <div className="w-[796px] h-screen p-2 relative text-[11px]">
            <div id="printBtn" className="absolute top-1 right-3">
                <Button 
                    variant="gradient" 
                    color="blue" 
                    className="capitalize" 
                    onClick={handlePrint}
                >
                    Print
                </Button>
            </div>
            <div>
                <Typography variant="h6" className="text-center">
                    Closing Statement
                </Typography>
            </div>
            <div className="grid grid-cols-2 py-4">
                <p className="text-[11px]">
                    From <span className="font-bold">{moment(startDate).format('DD, MMM YYYY')}</span> to <span className="font-bold">{moment(endDate).format('DD, MMM YYYY')}</span>
                </p>
                <p className="text-end">
                    Print Date: <span className="font-bold text-md">{printDate}</span>
                </p>
            </div>
            <Card className="h-auto shadow-none border rounded-sm p-2 mt-2">
                <CardBody className="grid grid-cols-6 gap-2 rounded-sm overflow-auto p-0">
                    <div className="grid grid-rows gap-2 items-center">
                        <p className="flex items-center justify-end gap-2">
                            Opening
                        </p>
                        <p className="text-end font-bold">
                            {(openingData?.opening + openingData?.stock).toLocaleString("en-us")}
                        </p>
                    </div>
                    {/* <div className="border-r-2 grid grid-rows gap-2 px-4 items-center">
                        <Typography  className="flex items-center justify-end gap-2">
                            Stock Opening
                        </Typography>
                        <Typography  className="text-end">
                            {openingData?.stock.toLocaleString("en-us")}
                        </Typography>
                    </div> */}
                    <div className="grid grid-rows gap-2 items-center">
                        <p className="flex items-center justify-end gap-2">
                            Purchase
                        </p>
                        <p className="text-end font-bold">
                            {openingData?.purchase.toLocaleString("en-us")}
                        </p>
                    </div>
                    <div className="grid grid-rows gap-2 items-center">
                        <p className="flex items-center justify-end gap-2">
                            Sales
                        </p>
                        <p className="text-end font-bold">
                            {openingData?.sales.toLocaleString("en-us")}
                        </p>
                    </div>
                    <div className="grid grid-rows gap-2 items-center">
                        <p className="flex items-center justify-end gap-2">
                            Cash In
                        </p>
                        <p className="text-end font-bold">
                            {openingData?.cashIn.toLocaleString("en-us")}
                        </p>
                    </div>
                    <div className="grid grid-rows gap-2 items-center">
                        <p className="flex items-center justify-end gap-2">
                            Cash Out
                        </p>
                        <p className="text-end font-bold">
                            {openingData?.cashOut.toLocaleString("en-us")}
                        </p>
                    </div>
                    <div className="grid grid-rows gap-2 items-center">
                        <p className="flex items-center justify-end gap-2">
                            Balance
                        </p>
                        <p className="text-end font-bold">
                            { balance.toLocaleString('en-us') }
                        </p>
                    </div>
                </CardBody>
            </Card>
            <div className="grid gap-2 mt-2">
                {/* Purchase */}
                <Card className="h-fit shadow-none w-full rounded-sm border">
                    <CardBody className="rounded-sm overflow-auto p-2">
                        <Typography className="text-[13px] font-bold">
                            Purchase :
                        </Typography>
                        <table className="w-full mt-2">
                            <thead className="">
                                <tr className="text-[11px] bg-gray-300">
                                    <th className="text-start py-1 ps-1 w-[300px]">
                                        Stone
                                    </th>
                                    <th className="text-center w-[50px]">
                                        Count
                                    </th>
                                    <th className="text-end">
                                        Amount
                                    </th>
                                    <th className="text-end pe-1">
                                        Paid Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    purchaseData?.map((res) => {
                                        return (
                                            <tr className="text-[11px]" key={res.stoneDesc}>
                                                <td className="text-start py-1 ps-1">
                                                    {res.stoneDesc}
                                                </td>
                                                <td className="text-center py-1">
                                                    {res.count}
                                                </td>
                                                <td className="text-end py-1">
                                                    {res.grandTotal? res.grandTotal.toLocaleString("en-us"): "0"}
                                                </td>

                                                <td className="text-end py-1 pe-1">
                                                    {res.paidAmount? res.paidAmount.toLocaleString("en-us"): "0"}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr className="bg-gray-100">
                                    <td className="text-start py-1 ps-1">
                                        Total
                                    </td>
                                    <td className="text-center py-1">
                                        
                                    </td>
                                    <td className="text-end py-1">
                                        {purchaseAmt?.toLocaleString('en-us')}
                                    </td>

                                    <td className="text-end py-1 pe-1">
                                        {openingData?.purchase.toLocaleString('en-us')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <DataTable 
                            columns={purchaseColumn} 
                            data={purchaseData}
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6e46b9",
                                        color: "white",
                                        fontSize: "11px",
                                        padding: "2px",
                                        height: '20px'
                                    }
                                }
                            }}
                        /> */}
                    </CardBody>
                </Card>
                {/* Payable */}
                <Card className="h-fit shadow-none w-full rounded-sm border">
                    <CardBody className="rounded-sm overflow-auto p-2">
                        <Typography className="text-[13px] font-bold">
                            Last Payable :
                        </Typography>
                        <table className="w-full mt-2">
                            <thead className="">
                                <tr className="text-[11px] bg-gray-300">
                                    <th className="text-start w-[300px] py-1 ps-1">
                                        Stone
                                    </th>
                                    <th className="text-center w-[50px]">
                                        Count
                                    </th>
                                    <th className="text-end">
                                        Amount
                                    </th>
                                    {/* <th className="text-end pe-1">
                                        Paid Amount
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    payableData?.map((res) => {
                                        return (
                                            <tr className="text-[11px]" key={res.stoneDesc}>
                                                <td className="text-start py-1 ps-1">
                                                    {res.stoneDesc}
                                                </td>
                                                <td className="text-center py-1">
                                                    {res.count}
                                                </td>
                                                <td className="text-end py-1">
                                                    {res.totalAmount? res.totalAmount.toLocaleString("en-us"): "0"}
                                                </td>

                                                {/* <td className="text-end py-1 pe-1">
                                                    {res.paidAmount? res.paidAmount.toLocaleString("en-us"): "0"}
                                                </td> */}
                                            </tr>
                                        )
                                    })
                                }
                                <tr className="bg-gray-100">
                                    <td className="text-start py-1 ps-1">
                                        Total
                                    </td>
                                    <td className="text-center py-1">
                                        
                                    </td>
                                    <td className="text-end py-1">
                                        {totalPayable?.toLocaleString('en-us')}
                                    </td>

                                    {/* <td className="text-end py-1 pe-1">
                                        {openingData?.purchase.toLocaleString('en-us')}
                                    </td> */}
                                </tr>
                            </tbody>
                        </table>
                        {/* <DataTable 
                            columns={purchaseColumn} 
                            data={purchaseData}
                            customStyles={{
                                headCells: {
                                    style: {
                                        background: "#6e46b9",
                                        color: "white",
                                        fontSize: "11px",
                                        padding: "2px",
                                        height: '20px'
                                    }
                                }
                            }}
                        /> */}
                    </CardBody>
                </Card>
                {/* Sales */}
                <Card className="h-fit shadow-none w-full rounded-sm border">
                    <CardBody className="rounded-sm overflow-auto p-2">
                        <Typography className="text-[13px] font-bold">
                            Sales :
                        </Typography>
                        <table className="w-full mt-2">
                            <thead>
                                <tr className="text-[11px] bg-gray-300">
                                    <th className="text-start w-[300px] py-1 ps-1">
                                        Stone
                                    </th>
                                    <th className="text-center w-[50px]">
                                        Count
                                    </th>
                                    <th className="text-end">
                                        Amount
                                    </th>
                                    <th className="text-end pe-1">
                                        Received Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    salesData?.map((res) => {
                                        return (
                                            <tr className="text-[11px]" key={res.stoneDesc}>
                                                <td className="text-start py-1 ps-1">
                                                    {res.stoneDesc}
                                                </td>
                                                <td className="text-center py-1">
                                                    {res.count}
                                                </td>
                                                <td className="text-end py-1">
                                                    {res.grandTotal? res.grandTotal.toLocaleString("en-us"): "0"}
                                                </td>

                                                <td className="text-end py-1 pe-1">
                                                    {res.receivedAmount? res.receivedAmount.toLocaleString("en-us"): "0"}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr className="bg-gray-100">
                                    <td className="text-start py-1 ps-1">
                                        Total
                                    </td>
                                    <td className="text-center py-1">
                                        
                                    </td>
                                    <td className="text-end py-1">
                                        {salesAmt?.toLocaleString('en-us')}
                                    </td>
                                    <td className="text-end py-1 pe-1">
                                        {openingData?.sales.toLocaleString('en-us')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
                {/* Receivable */}
                <Card className="h-fit shadow-none w-full rounded-sm border">
                    <CardBody className="rounded-sm overflow-auto p-2">
                        <Typography className="text-[13px] font-bold">
                            Last Receivable :
                        </Typography>
                        <table className="w-full mt-2">
                            <thead>
                                <tr className="text-[11px] bg-gray-300">
                                    <th className="text-start w-[300px] py-1 ps-1">
                                        Stone
                                    </th>
                                    <th className="text-center w-[50px]">
                                        Count
                                    </th>
                                    <th className="text-end">
                                        Amount
                                    </th>
                                    {/* <th className="text-end pe-1">
                                        Received Amount
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    receivableData?.map((res) => {
                                        return (
                                            <tr className="text-[11px]" key={res.stoneDesc}>
                                                <td className="text-start py-1 ps-1">
                                                    {res.stoneDesc}
                                                </td>
                                                <td className="text-center py-1">
                                                    {res.count}
                                                </td>
                                                <td className="text-end py-1">
                                                    {res.totalAmount? res.totalAmount.toLocaleString("en-us"): "0"}
                                                </td>

                                                {/* <td className="text-end py-1 pe-1">
                                                    {res.receivedAmount? res.receivedAmount.toLocaleString("en-us"): "0"}
                                                </td> */}
                                            </tr>
                                        )
                                    })
                                }
                                <tr className="bg-gray-100">
                                    <td className="text-start py-1 ps-1">
                                        Total
                                    </td>
                                    <td className="text-center py-1">
                                        
                                    </td>
                                    <td className="text-end py-1">
                                        {totalReceivable?.toLocaleString('en-us')}
                                    </td>
                                    {/* <td className="text-end py-1 pe-1">
                                        {openingData?.sales.toLocaleString('en-us')}
                                    </td> */}
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
                {/* Cash in/out */}
                <div className="grid grid-cols-2 h-fit gap-2">
                    {/* Cash In */}
                    <Card className="h-fit shadow-none w-full rounded-sm border">
                        <CardBody className="rounded-sm overflow-auto p-2">
                            <Typography className="text-[13px] font-bold">
                                Cash In
                            </Typography>
                            <table className="w-full mt-2">
                                <thead>
                                    <tr className="text-[11px] bg-gray-300">
                                        <th className="text-start w-[100px] py-1 ps-1">
                                            Category
                                        </th>
                                        <th className="text-center w-[50px]">
                                            Count
                                        </th>
                                        <th className="text-end w-[124px] pe-1">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cashInOutData?.map((res) => {
                                            if(res.cashType === "DEBIT" && res.categoryDesc !== "Receivable") {
                                                return (
                                                    <tr className="text-[11px]" key={res.stoneDesc}>
                                                        <td className="text-start py-1 ps-1">
                                                            {res.categoryDesc}
                                                        </td>
                                                        <td className="text-center py-1">
                                                            {res.count}
                                                        </td>
                                                        <td className="text-end py-1 pe-1">
                                                            {res.amount? res.amount.toLocaleString("en-us"): "0"}
                                                        </td>
                                                    </tr>
                                                )
                                            } else return null
                                            
                                        })
                                    }
                                    <tr className="bg-gray-100">
                                        <td className="text-start py-1 ps-1">
                                            Total
                                        </td>
                                        <td className="text-center py-1">
                                            
                                        </td>
                                        <td className="text-end py-1 pe-1">
                                            {openingData?.cashIn.toLocaleString('en-us')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                    {/* Cash Out */}
                    <Card className="h-fit shadow-none w-full rounded-sm border">
                        <CardBody className="rounded-sm overflow-auto p-2">
                            <Typography className="text-[13px] font-bold">
                                Cash Out
                            </Typography>
                            <table className="w-full mt-2">
                                <thead>
                                    <tr className="text-[11px] bg-gray-300">
                                        <th className="text-start w-[100px] py-1 ps-1">
                                            Category
                                        </th>
                                        <th className="text-center w-[50px]">
                                            Count
                                        </th>
                                        <th className="text-end w-[124px] pe-1">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cashInOutData?.map((res) => {
                                            if(res.cashType === "CREDIT" && res.categoryDesc !== "Payable") {
                                                return (
                                                    <tr className="text-[11px]" key={res.stoneDesc}>
                                                        <td className="text-start py-1 ps-1">
                                                            {res.categoryDesc}
                                                        </td>
                                                        <td className="text-center py-1">
                                                            {res.count}
                                                        </td>
                                                        <td className="text-end py-1 pe-1">
                                                            {res.amount? res.amount.toLocaleString("en-us"): "0"}
                                                        </td>
                                                    </tr>
                                                )
                                            } else return null
                                            
                                        })
                                    }
                                    <tr className="bg-gray-100">
                                        <td className="text-start py-1 ps-1">
                                            Total
                                        </td>
                                        <td className="text-center py-1">
                                            
                                        </td>
                                        <td className="text-end py-1 pe-1">
                                            {openingData?.cashOut.toLocaleString('en-us')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ClosingPreview