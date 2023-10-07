import { Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";
import { useAddPurchaseMutation, useFetchStoneDetailsQuery, useFetchTrueSupplierQuery, useFetchUOMQuery } from "../store";
import { FaFloppyDisk, FaPencil, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DataTable from "react-data-table-component";
import moment from "moment";
import SuccessAlert from "../components/success_alert";
import { v4 as uuidv4 } from 'uuid';
import { pause } from "../const";

function PurchaseInvoice() {

    const [addPurchase, result] = useAddPurchaseMutation();

    const {data: supplierData} = useFetchTrueSupplierQuery();

    // const supplierOption = supplierData?.map((supplier) => {
    //     return {value: supplier.supplierCode, label: supplier.supplierName}
    // });

    const {data: stoneDetails} = useFetchStoneDetailsQuery();

    // const stoneDetailOption = stoneDetails?.map((stoneDetail) => {
    //     return {value: stoneDetail.stoneDetailCode, label: stoneDetail.stoneDesc}
    // });

    const {data: unitData} = useFetchUOMQuery();

    const [purchaseDetails, setPurchaseDetails] = useState([]); 

    const [no, setNo] = useState(0);

    const [isAlert, setIsAlert] = useState(true);

    const [isEditDetail, setIsEditDetail] = useState(false);

    const [ validationText, setValidationText ] = useState({});

    const [purchase, setPurchase] = useState({
        invoiceNo: uuidv4(),
        purDate: moment().format("YYYY-MM-DD"),
        supplierCode: "",
        subTotal: 0,
        discAmt: 0,
        grandTotal: 0,
        remark: "",
        status: "O",
        createdBy: 'Htet Wai Aung',
        updatedBy: "",
        deletedBy: "",
        purchaseDetail: []
    })

    const purchaseData = {
        lineNo: 0,
        stoneDetailCode: "",
        qty: 0,
        weight: 0,
        unitCode: 'ct',
        unitPrice: 0,
        totalPrice: 0,
        serviceCharge: 0,
        totalAmt: 0
    };

    const {register, handleSubmit, setValue, getValues, reset} = useForm({
        defaultValues:{
            details: purchaseData,
        }
    });

    function validateForm() {
        const newErrors = {};
    
        if(purchase.supplierCode === "") {
            newErrors.supplier = 'Supplier is required.'
        }

        if(purchaseDetails.length <= 0) {
            newErrors.rows = 'No purchase list.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const onSubmit = async () => {
        if (validateForm()) {
            console.log(purchase.purDate);
            let subData = {
                ...purchase,
                purDate: moment(purchase.purDate).toISOString(),
                supplierCode: Number(purchase.supplierCode),
                discAmt: parseFloat(purchase.discAmt),
                subTotal: parseFloat(purchase.subTotal),
                grandTotal: parseFloat(purchase.grandTotal),
                createdBy: 'Htet Wai Aung',
                updatedBy: "",
                deletedBy: "",
                purchaseDetail: purchaseDetails
            };
            console.log(subData);
            addPurchase(subData).then((res) => {
                console.log(res);
            });
            setPurchase({
                purDate: moment().format("YYYY-MM-DD"),
                supplierCode: "",
                subTotal: 0,
                discAmt: 0,
                grandTotal: 0,
                remark: "",
                status: "O",
                createdBy: 'Htet Wai Aung',
                updatedBy: "",
                deletedBy: "",
                purchaseDetail: []
            });
            setPurchaseDetails([]);
            setIsAlert(true);
            await pause(2000);
            setIsAlert(false);

        }
    };

    const submitDetail = (puData) => {
        setPurchase({
            ...purchase,
            subTotal: purchase.subTotal + parseFloat(puData.details.totalAmt),
            grandTotal: (purchase.subTotal + parseFloat(puData.details.totalAmt)) - purchase.discAmt
        })
        setPurchaseDetails([
            ...purchaseDetails,
            {
                ...puData.details,
                lineNo: no + 1,
                stoneDetailCode: Number(puData.details.stoneDetailCode),
                qty: Number(puData.details.qty),
                weight: parseFloat(puData.details.weight),
                unitPrice: parseFloat(puData.details.unitPrice),
                totalPrice: parseFloat(puData.details.totalPrice),
                serviceCharge: parseFloat(puData.details.serviceCharge),
                totalAmt: parseFloat(puData.details.totalAmt)
                
            }
        ]);
        setNo(no + 1);
        reset({
            details: purchaseData,
        });
    };

    const handleEdit = (id) => {

        let tempData = purchaseDetails.filter((detail)=> detail.lineNo === id);
        setValue("details", {
            lineNo: tempData[0].lineNo,
            stoneDetailCode: tempData[0].stoneDetailCode,
            qty: tempData[0].qty,
            weight: tempData[0].weight,
            unitCode: tempData[0].unitCode,
            unitPrice: tempData[0].unitPrice,
            totalPrice: tempData[0].totalPrice,
            serviceCharge: tempData[0].serviceCharge,
            totalAmt: tempData[0].totalAmt,
        });
        setIsEditDetail(true);

    }

    const handleDeleteBtn = (id) => {
        let tempData = purchaseDetails.filter((detail) => detail.lineNo !== id);
        setPurchaseDetails(tempData);
    }

    const SaveDetail = (submitData) => {
        let subTotal = parseFloat(0);
        let tempData = purchaseDetails.filter((e) => e.lineNo !== submitData.details.lineNo);
        tempData.push({
            ...submitData.details,
            stoneDetailCode: Number(submitData.details.stoneDetailCode),
            qty: Number(submitData.details.qty),
            weight: parseFloat(submitData.details.weight),
            unitPrice: parseFloat(submitData.details.unitPrice),
            totalPrice: parseFloat(submitData.details.totalPrice),
            serviceCharge: parseFloat(submitData.details.serviceCharge),
            totalAmt: parseFloat(submitData.details.totalAmt)
        });
        tempData.forEach(e => {
            subTotal += e.totalAmt;
        });
        console.log(subTotal);
        setPurchase({
            ...purchase,
            subTotal: subTotal,
            grandTotal: subTotal - purchase.discAmt
        });
        setPurchaseDetails(tempData);
        console.log(submitData);
        setIsEditDetail(false);
        reset({
            details: purchaseData,
        });

    };

    const addQty = (e) => {

        let totalP = parseFloat(getValues("details.unitPrice")) * parseFloat(e.target.value);
        let totalA = parseFloat(getValues("details.serviceCharge")) + totalP;

        console.log(totalP);
        setValue("details.totalPrice", totalP)
        setValue("details.totalAmt", totalA);

    };

    const addUnitPrice = (e) => {

        let totalP = parseFloat(getValues("details.qty")) * parseFloat(e.target.value);
        let totalA = parseFloat(getValues("details.serviceCharge")) + totalP;

        setValue("details.totalPrice", totalP);
        setValue("details.totalAmt", totalA);

    };

    const addServiceCharge = (e) => {

        let totalA = parseFloat(getValues("details.totalPrice")) + parseFloat(e.target.value);

        setValue("details.totalAmt", totalA);
    };

    const addDiscAmt = (e) => {
        setPurchase({
            ...purchase,
            discAmt: e.target.value,
            grandTotal: purchase.subTotal - e.target.value
        });
    }

    const column = [
        {
            name: 'No',
            width: "80px",
            selector: row => row.Code,
        },
        {
            name: 'Description',
            width: "200px",
            selector: row => <select className="block w-[200px]" defaultValue={row.Description} disabled>
            <option value="" disabled>Select stone detail</option>
            {
                stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                stoneDetails?.map((stoneDetail) => {
                    return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc}</option>
                })
            }
        </select>//row.Description,

        },
        {
            name: 'Qty',
            width: "120px",
            right: "true",
            selector: row => row.Qty,

        },
        {
            name: 'Weight',
            width: "120px",
            right: "true",
            selector: row => row.Weight,

        },
        {
            name: 'Unit',
            width: "150px",
            center: "true",
            selector: row => row.UnitCode,

        },
        {
            name: 'Unit Price',
            width: "150px",
            right: "true",
            selector: row => row.UnitPrice,

        },
        {
            name: 'Total Price',
            width: "150px",
            right: "true",
            selector: row => row.TotalPrice,

        },
        {
            name: 'Service Charge',
            width: "150px",
            right: "true",
            selector: row => row.ServiceCharge,

        },
        {
            name: 'Total Amount',
            width: "150px",
            right: "true",
            selector: row => row.TotalAmt,
        },
        {
            name: 'Action',
            center: "true",
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)} disabled={isEditDetail}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)} disabled={isEditDetail}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = purchaseDetails?.map((details) => {
        return {
            Code: details.lineNo,
            Description: details.stoneDetailCode,
            Qty: details.qty,
            Weight: details.weight,
            UnitCode: details.unitCode,
            UnitPrice: details.unitPrice,
            TotalPrice: details.totalPrice,
            ServiceCharge: details.serviceCharge,
            TotalAmt: details.totalAmt,
        }
    });

    return (
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
                result.isSuccess && isAlert && <SuccessAlert title="Purchase" message="Data is saved successfully." isError={false} />
            }
            </div>
            <div className="flex justify-between items-center py-3 bg-white gap-4 sticky top-0 z-10">
                <Typography variant="h5">Purchase Invoice</Typography>
                <Button color="deep-purple" variant="gradient" className="py-2" onClick={handleSubmit(onSubmit)}>Save</Button>
            </div>
            <Card className="h-auto w-full shadow-md border-t rounded-md">
                <CardBody className="p-0 pb-4">
                    <div className="bg-main py-1 px-4 w-fit text-white rounded-md mb-4">
                        <Typography variant="small">Basic Info</Typography>
                    </div>
                    <div className="grid grid-cols-4 gap-2 px-3">
                        <div>
                            <label className="text-black mb-2 text-sm">Purchase Date</label>
                            <Input
                                containerProps={{ className: "min-w-[100px]" }}
                                type="date"
                                defaultValue={purchase.purDate}
                                onChange={(e) => setPurchase({
                                    ...purchase,
                                    purDate: e.target.value
                                })}
                                labelProps={{
                                    className: "hidden"
                                }}
                                className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900"
                            />
                        </div>
                        <div>
                            <label className="text-black mb-2 text-sm">Supplier</label>
                            <select 
                                className="block w-full p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                value={purchase.supplierCode} 
                                onChange={(e) => setPurchase({
                                    ...purchase,
                                    supplierCode: e.target.value
                                })}
                            >
                                <option value="" disabled>Select Supplier</option>
                                {
                                    supplierData?.map((supplier) => {
                                        return <option value={supplier.supplierCode} key={supplier.supplierCode} >{supplier.supplierName}</option>
                                    })
                                }
                            </select>
                            {
                                validationText.supplier && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.supplier}</p>
                            }
                        </div>
                        <div className="col-span-2">
                            <label className="text-black mb-2 text-sm">Remarks</label>
                            <Input
                                containerProps={{ className: "min-w-[100px]" }}
                                type="text"
                                value={purchase.remark}
                                onChange={(e) => setPurchase({
                                    ...purchase,
                                    remark: e.target.value
                                })}
                                labelProps={{
                                    className: "hidden"
                                }}
                                className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900"
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
                                    <Button variant="outlined" color="deep-purple" className="flex items-center gap-2 mt-2 p-2 mr-2" onClick={handleSubmit(SaveDetail)}>
                                        <FaFloppyDisk/> <span>Save</span>
                                    </Button> : 
                                    <Button variant="outlined" color="deep-purple" className="flex items-center gap-2 mt-2 p-2 mr-2" onClick={handleSubmit(submitDetail)}>
                                        <FaPlus/> <span>Add</span>
                                    </Button>
                                }
                                
                            </div>
                            <div className="flex px-3 mb-4 text-sm">
                                <input hidden {...register("details.lineNo")} />
                                <div className="w-full">
                                    <label className="text-black mb-2 text-sm">Weight</label>
                                    <select className="block w-full p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black" {...register("details.stoneDetailCode")} defaultValue="">
                                        <option value="" disabled>Select stone detail</option>
                                        {
                                            stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                            stoneDetails?.map((stoneDetail) => {
                                                return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                
                            </div>
                            <div className="grid grid-cols-3 gap-2 px-3 mb-4 text-sm">
                                <div>
                                    <label className="text-black text-sm mb-2">Qty</label>
                                    <Input
                                        {...register("details.qty")}
                                        containerProps={{ className: "min-w-[50px]" }}
                                        type="number"
                                        onChange={(e) => addQty(e)}
                                        labelProps={{
                                            className: "hidden"
                                        }}
                                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                                    />
                                </div>
                                <div>
                                    <label className="text-black text-sm mb-2">Weight</label>
                                    <Input
                                        {...register("details.weight")}
                                        containerProps={{ className: "min-w-[50px]" }}
                                        type="number"
                                        labelProps={{
                                            className: "hidden"
                                        }}
                                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                                    />
                                </div>
                                <div>
                                    <label className="text-black text-sm mb-2">Unit</label>
                                    <select className="block w-full p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black" {...register("details.unitCode")} defaultValue="">
                                        <option value=""  disabled>Select Unit</option>
                                        {
                                            unitData?.map((unit) => {
                                                return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitCode}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 px-3 mb-4 text-sm">
                                <div>
                                    <label className="text-black text-sm mb-2">Unit Price</label>
                                    <Input
                                        {...register("details.unitPrice")}
                                        containerProps={{ className: "min-w-[95px]" }}
                                        type="number"
                                        onChange={(e) => addUnitPrice(e)}
                                        labelProps={{
                                            className: "hidden"
                                        }}
                                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                                    />
                                </div>
                                <div>
                                    <label className="text-black text-sm mb-2">Total Price</label>
                                    <Input
                                        containerProps={{ className: "min-w-[95px]" }}
                                        {...register("details.totalPrice")}
                                        type="number"
                                        placeholder="Total Price"
                                        readOnly
                                        labelProps={{
                                            className: "hidden"
                                        }}
                                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                                    />
                                </div>
                                <div>
                                    <label className="text-black text-sm mb-2">Service Charge</label>
                                    <Input
                                        {...register("details.serviceCharge")}
                                        containerProps={{ className: "min-w-[95px]" }}
                                        type="number"
                                        onChange={(e) => addServiceCharge(e)}
                                        labelProps={{
                                            className: "hidden"
                                        }}
                                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                                    />
                                </div>
                                <div>
                                    <label className="text-black text-sm mb-2">Total Amt</label>
                                    <Input
                                        containerProps={{ className: "min-w-[95px]" }}
                                        {...register("details.totalAmt")}
                                        type="number"
                                        placeholder="Total Amount"
                                        readOnly
                                        labelProps={{
                                            className: "hidden"
                                        }}
                                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                                    />
                                </div>
                                
                                {/* <Input
                                    {...register("details.totalAmt")}
                                    className="text-right"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    label="Total Amount"
                                    type="number"
                                    disabled
                                /> */}
                            </div>
                        </form>
                    </CardBody>
                </Card>
                <div className="col-span-2 flex flex-col h-fit shadow-md rounded-md p-2">
                    <Card className="w-full shadow-none">
                        <CardBody className="overflow-auto rounded-md p-0 max-h-[320px]">
                            <DataTable 
                                columns={column} 
                                data={tbodyData} 
                                customStyles={{
                                    headCells: {
                                        style: {
                                            fontWeight: "bold",
                                            fontSize: "0.8rem"
                                        }
                                    }
                                }} />
                                {
                                    validationText.rows && <p className="block text-[12px] text-red-500 font-sans mb-2 text-center">{validationText.rows}</p>
                                }
                        </CardBody>
                    </Card>
                    <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                        <label className="col-span-3 text-end">Sub Total :</label>
                        <Input 
                            labelProps={{
                                className: "hidden"
                            }}
                            className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                            value={purchase.subTotal} 
                            readOnly 
                            type="number"  
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                        <label className="col-span-3 text-end">Discount Amount :</label>
                        <Input 
                        labelProps={{
                            className: "hidden"
                        }}
                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                        value={purchase.discAmt} type="number"  onChange={(e) => addDiscAmt(e)} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                        <label className="col-span-3 text-end">Grand Total :</label>
                        <Input 
                        labelProps={{
                            className: "hidden"
                        }}
                        className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
                        type="number" 
                        value={purchase.grandTotal} 
                        readOnly/>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default PurchaseInvoice;