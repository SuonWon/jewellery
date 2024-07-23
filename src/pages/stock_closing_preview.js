import { Button, Card, CardBody, Typography } from "@material-tailwind/react"
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useFetchStockQuery } from "../store";

function StockClosingPreview() {

    const location = useLocation();

    const params = new URLSearchParams(location.search);

    const startDate = params.get('startDate');

    const endDate = params.get('endDate');

    const { data: stockData } = useFetchStockQuery();

    const printDate = moment().format('DD MMM YYYY');

    const handlePrint = () => {
        const printBtn = document.getElementById('printBtn');
        printBtn.style.display='none'
        window.print();
        printBtn.style.display=''
        window.location.href = "/cash_closing";
    }

    return (
        <div className="w-[1123px] h-screen p-2 relative text-[11px]">
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
                    Stock Closing Statement
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
            <div className="grid gap-2 mt-2">
                {/* Stock */}
                <Card className="h-auto shadow-none w-full rounded-sm border">
                    <CardBody className="rounded-sm p-2">
                        <table className="w-full">
                            <thead className="bg-blue-gray-500 text-[11px] text-white">
                                <tr>
                                    <th className="p-2 border border-gray-200 py-1 ps-1"></th>
                                    <th className="p-2 border border-gray-200 py-1" colSpan={2}>Total</th>
                                    <th className="p-2 border border-gray-200 py-1" colSpan={2}>Sales</th>
                                    <th className="p-2 border border-gray-200 py-1" colSpan={2}>Issue</th>
                                    <th className="p-2 border border-gray-200 py-1" colSpan={2}>Adjustment</th>
                                    <th className="p-2 border border-gray-200 py-1" colSpan={2}>Damage</th>
                                    <th className="p-2 border border-gray-200 py-1" colSpan={2}>Sales Return</th>
                                    <th className="p-2 border border-gray-200 py-1" colSpan={2}>Purchase Return</th>
                                    <th className="p-2 border border-gray-200 py-1 pe-1" colSpan={2}>Issue Return</th>
                                </tr>
                                <tr>
                                    <th className="p-2 border border-gray-200 w-[250px] py-1 ps-1">Stone Details</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Weight</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Weight</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Weight</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Weight</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Weight</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Weight</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Weight</th>
                                    <th className="p-2 border border-gray-200 text-end py-1">Qty</th>
                                    <th className="p-2 border border-gray-200 text-end py-1 pe-1">Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    stockData?.map((res) => {
                                        return (
                                            <tr className="text-[11px]">
                                                <td className="p-2 border border-gray-200 py-1 ps-1">{res.stoneDesc}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.qty}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.weight}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalSalesQty? res.totalSalesQty: '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalSalesWeight? res.totalSalesWeight: '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalIssuesQty? res.totalIssuesQty: '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalIssuesWeight? res.totalIssuesWeight : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalAdjustmentsQty? res.totalAdjustmentsQty : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalAdjustmentsWeight? res.totalAdjustmentsWeight : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalDamageQty? res.totalDamageQty : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalDamageWeight? res.totalDamageWeight : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalSalesReturnQty? res.totalSalesReturnQty : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalSalesReturnWeight? res.totalSalesReturnWeight : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalPurchaseReturnQty? res.totalPurchaseReturnQty : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalPurchaseReturnWeight? res.totalPurchaseReturnWeight : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1">{res.totalIssueReturnQty? res.totalIssueReturnQty : '0'}</td>
                                                <td className="p-2 border border-gray-200 text-end py-1 pe-1">{res.totalIssueReturnWeight? res.totalIssueReturnWeight : '0'}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default StockClosingPreview