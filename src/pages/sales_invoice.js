import { Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";
import { FaFloppyDisk, FaPencil, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useAddSalesMutation, useFetchCustomerQuery, useFetchStoneDetailsQuery, useFetchUOMQuery } from "../store";
import moment from "moment";
import SuccessAlert from "../components/success_alert";
import { v4 as uuidv4 } from 'uuid';

const validator = require('validator');

function SalesInvoice() {

    const [ salesData, setSalesData ] = useState({
        invoiceNo: uuidv4(),
        salesDate: moment().format('yyyy-MM-DD'),
        customerCode: 0,
        subTotal: 0,
        discAmt: 0,
        grandTotal: 0,
        status: 'O',
        remark: '',
        createdBy: 'user-1',
        salesDetails: []
    })
    const [ tBodyData, setTBodyData ] = useState([]); 
    const [ salesDetails, setSalesDetails] = useState({
        id: '',
        lineNo: 0,
        stoneDetailCode: 0,
        stoneDetailName: '',
        qty: 0,
        weight: 0,
        unitCode: '',
        unitPrice: 0,
        totalPrice: 0,
        serviceCharge: 0,
        totalAmt: 0
    })
    const [isEditDetail, setIsEditDetail] = useState(false);
    const [ alert, setAlert] = useState({
        isAlert: false,
        message: ''
    });
    const [ validationText, setValidationText ] = useState({});
    const [ selectedId, setSelectedId ] = useState('');
    const [addSales] = useAddSalesMutation();

    const column = [
        {
            name: 'Id',
            width: '80px',
            selector: row => row.id,
            omit: true
        },
        {
            name: 'No.',
            width: "80px",
            selector: row => row.lineNo,

        },
        {
            name: 'Description',
            width: "200px",
            selector: row => row.stoneDetailName,
        },
        {
            name: 'Qty',
            width: "120px",
            center: "true",
            selector: row => row.qty,

        },
        {
            name: 'Weight',
            width: "120px",
            center: "true",
            selector: row => row.weight,

        },
        {
            name: 'Unit',
            width: "150px",
            center: "true",
            selector: row => row.unitCode,

        },
        {
            name: 'Unit Price',
            width: "150px",
            right: "true",
            selector: row => row.unitPrice,

        },
        {
            name: 'Total Price',
            width: "150px",
            right: "true",
            selector: row => row.totalPrice,

        },
        {
            name: 'Service Charge',
            width: "150px",
            right: "true",
            selector: row => row.serviceCharge,

        },
        {
            name: 'Total Amount',
            width: "150px",
            right: "true",
            selector: row => row.totalAmt,
        },
        {
            name: 'Action',
            center: "true",
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button 
                        variant="text" 
                        color="deep-purple" 
                        className="p-2" 
                        onClick={() => handleEdit(row.id)}
                        disabled={selectedId == row.id}
                    >
                        <FaPencil />
                    </Button>
                    <Button 
                        variant="text" 
                        color="red" 
                        className="p-2" 
                        onClick={() => handleDeleteBtn(row.id)}
                        disabled={selectedId == row.id}
                    >
                        <FaTrashCan />
                    </Button>
                </div>
            )
        },
    ]

    const {data: customers} = useFetchCustomerQuery();

    const {data: stoneDetails} = useFetchStoneDetailsQuery();

    const {data: unitData} = useFetchUOMQuery();

    function validateForm() {
        const newErrors = {};
    
        if(salesData.customerCode == 0) {
            newErrors.customer = 'Customer is required.'
        }

        if(salesData.salesDetails.length <= 0) {
            newErrors.rows = 'No sales list.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function validateDetail() {
        const newErrors = {};

        if(salesDetails.stoneDetailCode == 0) {
            newErrors.stoneDetail = 'Stone detail is required.'
        }

        if(validator.isEmpty(salesDetails.unitCode)) {
            newErrors.unitCode = 'Unit is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit() {

        if(validateForm()) {   

            const saveData = {
                invoiceNo: salesData.invoiceNo,
                salesDate: moment(salesData.salesDate).toISOString(),
                customerCode: salesData.customerCode,
                subTotal: salesData.subTotal,
                discAmt: salesData.discAmt,
                grandTotal: salesData.grandTotal,
                status: 'O',
                remark: salesData.remark,
                createdBy: 'user-1',
                salesDetails: salesData.salesDetails
            }
            await addSales(saveData)

            setAlert({
                isAlert: true,
                message: 'Saved successfully'
            });

            setSalesData({
                invoiceNo: uuidv4(),
                salesDate: moment().format('yyyy-MM-DD'),
                customerCode: 0,
                subTotal: 0,
                discAmt: 0,
                grandTotal: 0,
                status: 'O',
                remark: '',
                createdBy: 'user-1',
                salesDetails: []
            })
            setTBodyData([])

            setTimeout(() => {
                setAlert({
                    ...alert,
                    isAlert: false,
                });
            }, 3000)
        }
    }

    function handleAdd() {

        if(validateDetail()) {

            if(isEditDetail) {

                const obj = {
                    id: salesDetails.id,
                    lineNo: salesDetails.lineNo,
                    stoneDetailCode: salesDetails.stoneDetailCode,
                    qty: salesDetails.qty,
                    weight: salesDetails.weight,
                    unitCode: salesDetails.unitCode,
                    unitPrice: salesDetails.unitPrice,
                    totalPrice: salesDetails.totalPrice,
                    serviceCharge: salesDetails.serviceCharge,
                    totalAmt: salesDetails.totalAmt
                };

                const editObj = tBodyData.find(rec => rec.id === salesDetails.id);
                Object.assign(editObj, {...obj, stoneDetailName: salesDetails.stoneDetailName});
                const saveObj = salesData.salesDetails.find(rec => rec.id === salesDetails.id);
                Object.assign(saveObj, obj);


                calculateTotal(salesData.salesDetails);
            }
            else {

                const detailId = uuidv4();
                let lineNo = tBodyData.length + 1;
                let curRows = salesData.salesDetails;

                let addObj = {
                    id: detailId,
                    lineNo: lineNo,
                    stoneDetailCode: salesDetails.stoneDetailCode,
                    qty: salesDetails.qty,
                    weight: salesDetails.weight,
                    unitCode: salesDetails.unitCode,
                    unitPrice: salesDetails.unitPrice,
                    totalPrice: salesDetails.totalPrice,
                    serviceCharge: salesDetails.serviceCharge,
                    totalAmt: salesDetails.totalAmt
                }

                curRows.push(addObj);

                setSalesData({
                    ...salesData,
                    salesDetails: curRows
                })

                setTBodyData(cur => [...cur, {
                    ...addObj,
                    stoneDetailName: salesDetails.stoneDetailName,
                }]);

                calculateTotal(curRows);

            }

            setSalesDetails({
                id: '',
                lineNo: 0,
                stoneDetailCode: 0,
                stoneDetailName: '',
                qty: 0,
                weight: 0,
                unitCode: '',
                unitPrice: 0,
                totalPrice: 0,
                serviceCharge: 0,
                totalAmt: 0
            })
            setIsEditDetail(false);
            setSelectedId('');
        }
    }

    function calculateTotal(sumRows) {

        console.log(sumRows.length);
        let subTotal = 0;
        for(let i = 0; i < sumRows.length; i++) {
            subTotal += sumRows[i].totalAmt
        }
        setSalesData({
            ...salesData,
            subTotal: subTotal,
            grandTotal: subTotal - parseFloat(salesData.discAmt)
        });

    }

    function handleEdit(rowId) {

        setSelectedId(rowId);
        const curRow = tBodyData.find(rec => rec.id === rowId);
        console.log(curRow);
        setSalesDetails({
            id: curRow.id,
            lineNo: curRow.lineNo,
            stoneDetailCode: curRow.stoneDetailCode,
            stoneDetailName: curRow.stoneDetailName,
            qty: curRow.qty,
            weight: curRow.weight,
            unitCode: curRow.unitCode,
            unitPrice: curRow.unitPrice,
            totalPrice: curRow.totalPrice,
            serviceCharge: curRow.serviceCharge,
            totalAmt: curRow.totalAmt
        })
        setIsEditDetail(true);
    }

    function handleDeleteBtn(rowId) {
        setTBodyData(tBodyData.filter(rec => rec.id !== rowId))
        setSalesData({
            ...salesData,
            salesDetails: salesData.salesDetails.filter(rec => rec.id !== rowId)
        })
    }

    return(
        <>
            <style>
                {
                    `
                    [data-column-id="${column.length}"] {
                        position: sticky;
                        right: 0;
                        background-color: #fff;
                    }
                    `
                }
            </style>
            <div className="flex flex-col gap-2 min-w-[85%] max-w-[85%]"> 
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    alert.isAlert && <SuccessAlert message={alert.message} handleAlert={() => setAlert({...alert, isAlert: false})} />
                }
            </div>
                <div className="flex justify-between items-center py-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h5">Sales Invoice</Typography>
                    <Button color="deep-purple" variant="gradient" className="py-2" onClick={handleSubmit}>Save</Button>
                </div>
                <Card className="h-auto w-full shadow-md border-t rounded-md">
                    <CardBody className="p-0 pb-4">
                        <div className="bg-main py-1 px-4 w-fit text-white rounded-md mb-4">
                            <Typography variant="small">Basic Info</Typography>
                        </div>
                        <div className="grid grid-cols-4 gap-2 px-3">
                            <Input
                                containerProps={{ className: "min-w-[100px]" }}
                                label="Sales Date"
                                type="date"
                                value={salesData.salesDate}
                                onChange={(e) => {
                                    setSalesData({
                                        ...salesData,
                                        salesDate: e.target.value
                                    })
                                }}
                            />
                            <div>
                                <select className="block w-full p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black" value={salesData.customerCode} placeholder="Select Customer"
                                    onChange={(e) => {
                                        setSalesData({
                                            ...salesData,
                                            customerCode: parseInt(e.target.value)
                                        })
                                    }}
                                >
                                    <option value="0" disabled>Select Customer</option>
                                    {
                                        customers?.map((customer) => {
                                            return <option value={customer.customerCode} key={customer.customerCode} >{customer.customerName}</option>
                                        })
                                    }
                                </select>
                                {
                                    validationText.customer && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customer}</p>
                                }
                            </div>
                            
                            <div className="col-span-2">
                                <Input
                                    containerProps={{ className: "min-w-[100px]" }}
                                    label="Remark"
                                    type="text"
                                    value={salesData.remark}
                                    onChange={(e) => {
                                        setSalesData({
                                            ...salesData,
                                            remark: e.target.value
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <div className="grid grid-cols-3 gap-2">
                    <Card className="h-fit w-full rounded-md shadow-md border-t">
                        <CardBody className="p-0 pb-4">
                            <form>
                                <div className="flex justify-between mb-4 p-0">
                                    <Typography variant="small" className="bg-main py-1 px-4 w-fit h-fit text-white rounded-md">Details Info</Typography>
                                    {
                                        isEditDetail ? 
                                        <Button variant="outlined" color="deep-purple" className="flex items-center gap-2 mt-2 p-2 mr-2" onClick={handleAdd}>
                                            <FaFloppyDisk/> <span>Save</span>
                                        </Button> : 
                                        <Button variant="outlined" color="deep-purple" className="flex items-center gap-2 mt-2 p-2 mr-2" onClick={() => handleAdd()}>
                                            <FaPlus/> <span>Add</span>
                                        </Button>
                                    }
                                    
                                </div>
                                <div className="flex px-3 mb-4 text-sm">
                                    <input hidden />
                                    <div className="w-full ">
                                        <select className="border-blue-gray-200 max-h-[2.5rem] p-2.5 border w-full rounded-md block focus:border-black" value={salesDetails.stoneDetailCode}
                                            onChange={(e) => {
                                                console.log(e.target.options[e.target.selectedIndex].text);
                                                setSalesDetails({
                                                    ...salesDetails,
                                                    stoneDetailCode: parseInt(e.target.value),
                                                    stoneDetailName: e.target.options[e.target.selectedIndex].text
                                                })
                                            }}
                                        >
                                            <option value="0" disabled>Select stone detail</option>
                                            {
                                                stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                                stoneDetails?.map((stoneDetail) => {
                                                    return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.stoneDetail && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.stoneDetail}</p>
                                        }
                                    </div>
                                    
                                </div>
                                <div className="grid grid-cols-3 gap-2 px-3 mb-4 text-sm">
                                    <Input
                                        containerProps={{ className: "min-w-[50px]" }}
                                        label="Quantity"
                                        type="number"
                                        value={salesDetails.qty}
                                        onChange={(e) => {
                                            const qty = parseFloat(e.target.value);
                                            const totalPrice = qty * parseFloat(salesDetails.unitPrice);
                                            setSalesDetails({
                                                ...salesDetails,
                                                qty: qty,
                                                totalPrice: totalPrice,
                                                totalAmt: totalPrice - salesDetails.serviceCharge
                                            })
                                        }}
                                    />
                                    <Input
                                        containerProps={{ className: "min-w-[50px]" }}
                                        label="Weight"
                                        type="number"
                                        value={salesDetails.weight}
                                        onChange={(e) => {
                                            setSalesDetails({
                                                ...salesDetails,
                                                weight: parseFloat(e.target.value)
                                            })
                                        }}
                                    />
                                    <div>
                                        <select className="block w-full p-2.5  border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"  value={salesDetails.unitCode}
                                            onChange={(e) => {
                                                setSalesDetails({
                                                    ...salesDetails,
                                                    unitCode : e.target.value
                                                })
                                            }}
                                        >
                                            <option value=""  disabled>Select Unit</option>
                                            {
                                                unitData?.map((unit) => {
                                                    return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitDesc}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.unitCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.unitCode}</p>
                                        }
                                    </div>
                                    
                                </div>
                                <div className="grid grid-cols-2 gap-2 px-3 mb-4 text-sm">
                                    <Input
                                        containerProps={{ className: "min-w-[95px]" }}
                                        label="Unit Price"
                                        type="number"
                                        value={salesDetails.unitPrice}
                                        onChange={(e) => {
                                            const price = parseFloat(e.target.value);
                                            const totalPrice = price * parseFloat(salesDetails.qty);
                                            setSalesDetails({
                                                ...salesDetails,
                                                unitPrice: price,
                                                totalPrice: totalPrice,
                                                totalAmt: totalPrice - salesDetails.serviceCharge
                                            })
                                        }}
                                    />
                                    <Input
                                        containerProps={{ className: "min-w-[95px]"}}
                                        label="Total Price"
                                        type="number"
                                        value={salesDetails.totalPrice}
                                        onChange={(e) => {
                                            setSalesDetails({
                                                ...salesDetails,
                                                totalPrice: parseFloat(e.target.value)
                                            })
                                        }}
                                        readOnly
                                    />
                                    <Input
                                        containerProps={{ className: "min-w-[95px]" }}
                                        label="Service Charge"
                                        type="number"
                                        value={salesDetails.serviceCharge}
                                        onChange={(e) => {
                                            const service = parseFloat(e.target.value);
                                            setSalesDetails({
                                                ...salesDetails,
                                                serviceCharge: parseFloat(e.target.value),
                                                totalAmt: salesDetails.totalPrice - service
                                            })
                                        }}
                                    />
                                    <Input
                                        containerProps={{ className: "min-w-[95px]" }}
                                        label="Total Amount"
                                        type="number"
                                        value={salesDetails.totalAmt}
                                        onChange={(e) => {
                                            setSalesDetails({
                                                ...salesDetails,
                                                totalAmt: parseFloat(e.target.value)
                                            })
                                        }}
                                        readOnly
                                    />
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    <div className="col-span-2 flex flex-col h-fit shadow-md rounded-md p-2">
                        <Card className="w-full shadow-none">
                            <CardBody className="overflow-auto rounded-md p-0 max-h-[320px]">
                                <DataTable 
                                    columns={column} 
                                    data={tBodyData} 
                                    customStyles={{
                                        headCells: {
                                            style: {
                                                fontWeight: "bold",
                                                fontSize: "0.8rem"
                                            }
                                        }
                                    }} 
                                />
                                {
                                    validationText.rows && <p className="block text-[12px] text-red-500 font-sans mb-2 text-center">{validationText.rows}</p>
                                }
                            </CardBody>
                        </Card>
                        <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                            <label className="col-span-3 text-end">Sub Total :</label>
                            <input 
                                className="rounded-md text-right p-2 border border-blue-gray-500" 
                                type="number"
                                value={salesData.subTotal} 
                                disabled
                                onChange={(e) => {
                                    const subTotal = parseFloat(e.target.value);
                                    setSalesData({
                                        ...salesData,
                                        subTotal: subTotal,
                                        grandTotal: subTotal - salesData.discAmt
                                    })
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                            <label className="col-span-3 text-end">Discount Amount :</label>
                            <input 
                                className="rounded-md text-right p-2 border border-blue-gray-500" 
                                type="number"
                                value={salesData.discAmt} 
                                onChange={(e) => {
                                    const discAmt = parseFloat(e.target.value);
                                    setSalesData({
                                        ...salesData,
                                        discAmt: discAmt,
                                        grandTotal: salesData.subTotal - discAmt
                                    })
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                            <label className="col-span-3 text-end">Grand Total :</label>
                            <input 
                                className="rounded-md text-right p-2 border border-blue-gray-500" 
                                type="number"
                                value={salesData.grandTotal}
                                disabled
                                onChange={(e) => {
                                    setSalesData({
                                        ...salesData,
                                        grandTotal: e.target.value
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default SalesInvoice;