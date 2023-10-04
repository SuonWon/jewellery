import { Button, Card, CardBody, IconButton, Input, Textarea, Typography } from "@material-tailwind/react";
import SectionTitle from "../components/section_title";
import { useFetchPurchaseByIdQuery, useFetchStoneDetailsQuery, useFetchSupplierQuery, useFetchUOMQuery, useUpdatePurchaseMutation } from "../store";
import { FaFloppyDisk, FaPencil, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import DataTable from "react-data-table-component";
import { currentDate, pause } from "../const";
import moment from "moment";

function PurchaseEdit() {

    const {data} = useFetchPurchaseByIdQuery(puInvoiceNo);

    console.log(data);

    const [editPurchase, result] = useUpdatePurchaseMutation();

    const {data: supplierData} = useFetchSupplierQuery();

    const {data: stoneDetails} = useFetchStoneDetailsQuery();

    const {data: unitData} = useFetchUOMQuery();

    const [purchaseDetails, setPurchaseDetails] = useState([]); 

    const [no, setNo] = useState(0);

    const [isEditDetail, setIsEditDetail] = useState(false);

    const [purchase, setPurchase] = useState({
        purDate: "",
        supplierCode: "Select Supplier",
        subTotal: 0,
        discAmt: 0,
        grandTotal: 0,
        remark: "",
        status: "O",
        invoiceNo: "P-00001",
        createdBy: 'Htet Wai Aung',
        updatedBy: "",
        deletedBy: "",
        purchaseDetail: []
    })

    // const purchase = {
    //     purDate: "",
    //     supplierCode: "Select Supplier",
    //     subTotal: 0,
    //     discAmt: 0,
    //     grandTotal: 0,
    //     remark: ""
    // }

    const purchaseData = {
        lineNo: 0,
        stoneDetailCode: "stoneDetail",
        qty: 0,
        weight: 0,
        unitCode: "Select Unit",
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

    const onSubmit = async (purchaseData) => {
        let subData = {
            ...purchase,
            purDate: moment(purchase.purDate).toISOString(),
            supplierCode: Number(purchase.supplierCode),
            discAmt: parseFloat(purchase.discAmt),
            subTotal: parseFloat(purchase.subTotal),
            grandTotal: parseFloat(purchase.grandTotal),
            invoiceNo: "P-00002",
            createdBy: 'Htet Wai Aung',
            updatedBy: "",
            deletedBy: "",
            purchaseDetail: purchaseDetails
        };
        console.log(subData);
        editPurchase(subData).then((res) => {
            console.log(res);
        });
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

    const sTotal = () => {
        let sTotal = 0;
        if (purchaseDetails.length !== 0) {
            purchaseDetails.forEach((el) => {
                sTotal += el.totalAmt;
            })
        }
        return sTotal;
    }

    const gTotal = () => {
        let gTotal = parseFloat(getValues("puData.subTotal")) - parseFloat(getValues("puData.discAmt"));
        return gTotal;
    }

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

        let tempData = purchaseDetails.filter((e) => e.lineNo != submitData.details.lineNo);
        tempData.push(submitData.details);
        setPurchaseDetails(tempData);
        console.log(submitData);
        setIsEditDetail(false);

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
            selector: row => row.Description,

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
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
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
                        <Input
                            containerProps={{ className: "min-w-[100px]" }}
                            label="Purchase Date"
                            type="date"
                            onChange={(e) => setPurchase({
                                ...purchase,
                                purDate: e.target.value
                            })}
                        />
                        <select 
                            className="block w-full p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black" defaultValue="Select Supplier" 
                            onChange={(e) => setPurchase({
                                ...purchase,
                                supplierCode: e.target.value
                            })}
                        >
                            <option value="Select Supplier" disabled>Select Supplier</option>
                            {
                                supplierData?.map((supplier) => {
                                    return <option value={supplier.supplierCode} key={supplier.supplierCode} >{supplier.supplierName}</option>
                                })
                            }
                        </select>
                        <div className="col-span-2">
                            <Input
                                containerProps={{ className: "min-w-[100px]" }}
                                label="Remark"
                                type="text"
                                onChange={(e) => setPurchase({
                                    ...purchase,
                                    remark: e.target.value
                                })}
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
                                <select className="block w-full p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black" {...register("details.stoneDetailCode")} defaultValue="stoneDetail">
                                    <option value="stoneDetail" disabled>Select stone detail</option>
                                    {
                                        stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                        stoneDetails?.map((stoneDetail) => {
                                            return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDetailCode}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-2 px-3 mb-4 text-sm">
                                <Input
                                    {...register("details.qty")}
                                    containerProps={{ className: "min-w-[50px]" }}
                                    label="Quantity"
                                    type="number"
                                    onBlur={(e) => addQty(e)}
                                />
                                <Input
                                    {...register("details.weight")}
                                    containerProps={{ className: "min-w-[50px]" }}
                                    label="Weight"
                                    type="number"
                                />
                                <select className="block w-full p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black" {...register("details.unitCode")} defaultValue="Select Unit">
                                    <option value="Select Unit"  disabled>Select Unit</option>
                                    {
                                        unitData?.map((unit) => {
                                            return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitDesc}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2 px-3 mb-4 text-sm">
                                <Input
                                    {...register("details.unitPrice")}
                                    containerProps={{ className: "min-w-[100px]" }}
                                    label="Unit Price"
                                    type="number"
                                    onBlur={(e) => addUnitPrice(e)}
                                />
                                <input
                                    {...register("details.totalPrice")}
                                    className="rounded-md text-right p-2 placeholder:text-blue-gray-500" 
                                    type="number"
                                    placeholder="Total Price"
                                    disabled
                                />
                                {/* <Input
                                    {...register("details.totalPrice")}
                                    containerProps={{ className: "min-w-[100px]" }}
                                    label="Total Price"
                                    type="number"
                                    disabled
                                /> */}
                                <Input
                                    {...register("details.serviceCharge")}
                                    containerProps={{ className: "min-w-[100px]" }}
                                    label="Service Charge"
                                    type="number"
                                    onBlur={(e) => addServiceCharge(e)}
                                />
                                <input
                                    {...register("details.totalAmt")}
                                    className="rounded-md text-right p-2 placeholder:text-blue-gray-500" 
                                    type="number"
                                    placeholder="Total Amount"
                                    disabled
                                />
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
                        </CardBody>
                    </Card>
                    <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                        <label className="col-span-3 text-end">Sub Total :</label>
                        <input className="rounded-md text-right p-2" value={purchase.subTotal} disabled type="number"  />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                        <label className="col-span-3 text-end">Discount Amount :</label>
                        <input className="rounded-md text-right p-2 border border-blue-gray-500" defaultValue="0" type="number"  onBlur={(e) => addDiscAmt(e)} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4 items-center text-sm">
                        <label className="col-span-3 text-end">Grand Total :</label>
                        <input className="rounded-md text-right p-2" type="number" value={purchase.grandTotal}  disabled/>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default PurchaseEdit;