/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaEye, FaFloppyDisk, FaPencil, FaPlus, FaTrashCan,} from "react-icons/fa6";
import { useState } from "react";
import { useAddSalesMutation, useFetchSalesQuery, useFetchStoneDetailsQuery, useFetchTrueCustomerQuery, useFetchTrueSalesQuery, useFetchUOMQuery, useRemoveSalesMutation } from "../store";
import { focusSelect, pause } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
const validator = require('validator');

function SalesList() {

    const auth = useAuthUser();

    const [openDelete, setOpenDelete] = useState(false);

    const navigate = useNavigate();

    const [isAlert, setIsAlert] = useState(true);

    const {data} = useFetchSalesQuery();

    const [removeSales, removeResult] = useRemoveSalesMutation();

    const [addSales] = useAddSalesMutation();

    const [open, setOpen] = useState(false);

    const [isView, setIsView] = useState(false);

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: ''
    });

    const salesData = {
        invoiceNo: uuidv4(),
        salesDate: moment().format("YYYY-MM-DD"),
        issueNo: "",
        customerCode: 0,
        stoneDetailCode: "",
        qty: 0,
        weight: 0,
        unitCode: 'ct',
        unitPrice: 0,
        subTotal: 0,
        servicePer: 0,
        serviceCharge: 0,
        discAmt: 0,
        grandTotal: 0,
        remark: "",
        status: "O",
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
    };

    const {data: customerData} = useFetchTrueCustomerQuery();

    const {data: stoneDetails} = useFetchStoneDetailsQuery();

    const {data: unitData} = useFetchUOMQuery();

    const [formData, setFormData] = useState(salesData);

    const [ validationText, setValidationText ] = useState({});

    const [deleteId, setDeleteId] = useState('');

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removeSales({
            id: removeData[0].invoiceNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => {console.log(res)});
        setIsAlert(true);
        setOpenDelete(!openDelete);
        await pause(2000);
        setIsAlert(false);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const handleOpen = () => {
        setFormData(salesData);
        setIsView(false);
        setOpen(!open);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.invoiceNo === id);
        console.log(tempData);
        setFormData(tempData);
        setIsView(true);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if (formData.customerCode === 0) {
            newErrors.customer = "Customer Name is required."
        }

        if (formData.salesDate === "") {
            newErrors.salesDate = "Sales Date is required."
        }

        if (validator.isEmpty(formData.stoneDetailCode)) {
            newErrors.stoneDetailCode = "Stone Detail is required."
        }
        
        if (validator.isEmpty(formData.unitCode)) {
            newErrors.unitCode = "Unit is required."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const handleSubmit = () => {
        if (validateForm()) {
            console.log(formData);
            try {
                console.log("Ji");
                addSales({
                    ...formData,
                    invoiceNo: "SV-0001",
                    salesDate: moment(formData.salesDate).toISOString(),
                }).then((res) => {
                    if(res.error != null) {
                        let message = '';
                        if(res.error.data.statusCode == 409) {
                            message = "Duplicate data found."
                        }
                        else {
                            message = res.error.data.message
                        }
                        setAlert({
                            isAlert: true,
                            message: message
                        })
                        setTimeout(() => {
                            setAlert({
                                isAlert: false,
                                message: ''
                            })
                        }, 2000);
                    }
                    
                });
                setFormData(salesData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(salesData);
            setOpen(!open);
        }
    };

    const handleSave = () => {
        console.log(formData);
        setFormData(salesData);
    };

    const editSales = async (id) => {
        let editPuData = data.filter((e) => e.invoiceNo === id);
        console.log(editPuData);
        navigate(`/sales_edit/${editPuData}`);
    };

    const column = [
        {
            name: 'Invoice No',
            width: '200px',
            selector: row => row.Code,
            omit: true
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => row.SalesDate,

        },
        {
            name: 'Customer',
            width: "200px",
            selector: row => row.Supplier,

        },
        {
            name: 'Stone Detail',
            width: "250px",
            selector: row => row.StoneDetailCode,

        },
        {
            name: 'Qty',
            width: "150px",
            selector: row => row.Qty,
            right: true,

        },
        {
            name: 'Weight',
            width: "150px",
            selector: row => row.Weight,
            right: true,

        },
        {
            name: 'Unit Price',
            width: "150px",
            selector: row => row.UnitPrice,
            right: true,

        },
        {
            name: 'Sub Total',
            width: "150px",
            selector: row => row.SubTotal,
            right: true,
        },
        {
            name: 'Service Charge',
            width: "150px",
            selector: row => row.ServiceCharge,
            right: true,
        },
        {
            name: 'Discount Amt',
            width: "150px",
            selector: row => row.DiscAmt,
            right: true,
        },
        {
            name: 'Grand Total',
            width: "150px",
            selector: row => row.GrandTotal,
            right: true,
        },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.Remark,
        },
        {
            name: 'Created At',
            width: "200px",
            selector: row => row.CreatedAt,
        },
        {
            name: 'Updated At',
            width: "200px",
            selector: row => row.UpdatedAt,
        },
        {
            name: 'Action',
            center: true,
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.Code)}><FaEye /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((salesData) => {
        return {
            Code: salesData.invoiceNo,
            SalesDate: moment(salesData.salesDate).format("YYYY-MM-DD"),
            Supplier: salesData.customer.customerName,
            StoneDetailCode: salesData.stoneDetail.stoneDesc,
            Qty: salesData.qty,
            Weight: salesData.weight,
            UnitPrice: salesData.unitPrice.toLocaleString('en-US'),
            SubTotal: salesData.subTotal.toLocaleString('en-US'),
            ServiceCharge: salesData.serviceCharge.toLocaleString('en-US'),
            DiscAmt: salesData.discAmt.toLocaleString('en-US'),
            GrandTotal: salesData.grandTotal.toLocaleString('en-US'),
            Remark: salesData.remark,
            CreatedAt: moment(salesData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: salesData.createdBy,
            UpdatedAt: moment(salesData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: salesData.updatedBy,
            Status: salesData.status,
        }
    });

    return(
        <>
        <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    removeResult.isSuccess && isAlert && <SuccessAlert title="Sales" message="Delete successful." handleAlert={() => setIsAlert(false)} />
                }
            </div>
            <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                <Typography variant="h5">
                    Sales List
                </Typography>
                <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                    <FaPlus /> Create New
                </Button>
            </div>
            <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
            <Dialog open={open} size="lg">
                <DialogBody>
                    <ModalTitle titleName="Sales" handleClick={() => setOpen(!open)} />
                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {/* Issue No */}
                        <div>
                            <label className="text-black text-sm mb-2">Issue No</label>
                            <input
                                type="text"
                                className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                value={formData.issueNo}
                                readOnly={isView}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData, 
                                        issueNo: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        {/* Purchase Date */}
                        <div className="col-start-4 col-end-4">
                            <label className="text-black mb-2 text-sm">Sales Date</label>
                            <input
                                type="date"
                                className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                value={moment(formData.salesDate).format("YYYY-MM-DD")}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    salesDate: e.target.value
                                })}
                                readOnly={isView}
                            />
                            {
                                validationText.salesDate && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.salesDate}</p>
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {/* Customer Name */}
                        <div className="col-start-1 col-end-2">
                            <label className="text-black mb-2 text-sm">Customer Name</label>
                            {
                                isView ? <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.customer.customerName}
                                    readOnly={isView}
                                /> : 
                                <select 
                                className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                value={formData.customerCode} 
                                onChange={(e) => setFormData({
                                    ...formData,
                                    customerCode: Number(e.target.value)
                                })}
                                >
                                    <option value="0" disabled>Select Customer</option>
                                    {
                                        customerData?.map((customer) => {
                                            return <option value={customer.customerCode} key={customer.customerCode} >{customer.customerName}</option>
                                        })
                                    }
                                </select>
                            }
                            {
                                validationText.customer && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customer}</p>
                            }
                        </div>
                        {/* Stone Details */}
                        <div className="">
                            <label className="text-black mb-2 text-sm">Stone Details</label>
                            {
                                isView ? <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.stoneDetail.stoneDesc}
                                    readOnly={isView}
                                /> :
                                <select 
                                    className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                    value={formData.stoneDetailCode} 
                                    onChange={(e) => 
                                        setFormData({
                                            ...formData, 
                                            stoneDetailCode: e.target.value,
                                        })
                                    }
                                    >
                                    <option value="" disabled>Select stone detail</option>
                                    {
                                        stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                        stoneDetails?.map((stoneDetail) => {
                                            return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc}</option>
                                        })
                                    }
                                </select>
                            }
                            {
                                validationText.stoneDetailCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.stoneDetailCode}</p>
                            } 
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                        <div className="col-span-3 gap-2 grid grid-cols-3">
                            {/* Qty */}
                            <div>
                                <label className="text-black text-sm mb-2">Qty</label>
                                <input
                                    type="number"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.qty}
                                    readOnly={isView}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData, 
                                            qty: parseFloat(e.target.value),
                                        });
                                    }}
                                    onFocus={(e) => focusSelect(e)}
                                />
                            </div>
                            {/* Weight */}
                            <div>
                                <label className="text-black text-sm mb-2">Weight</label>
                                <input
                                    type="number"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.weight}
                                    readOnly={isView}
                                    onChange={(e) => {
                                        let weight = parseFloat(e.target.value);
                                        let totalP = formData.unitPrice * weight;
                                        let totalA = (totalP + formData.serviceCharge) - formData.discAmt;
                                        setFormData({
                                            ...formData, 
                                            weight: weight,
                                            subTotal: totalP,
                                            grandTotal: totalA,
                                        });
                                    }}
                                    onFocus={(e) => focusSelect(e)}
                                />
                            </div>
                            {/* Unit */}
                            <div>
                                <label className="text-black text-sm mb-2">Unit</label>
                                {
                                    isView ? <input
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.unitCode}
                                        readOnly={isView}
                                    /> :
                                    <select 
                                        className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                        value={formData.unitCode}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData, 
                                                unitCode: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value=""  disabled>Select Unit</option>
                                        {
                                            unitData?.map((unit) => {
                                                return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitCode}</option>
                                            })
                                        }
                                    </select>
                                }
                                {
                                    validationText.unitCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.unitCode}</p>
                                }
                            </div>
                        </div>
                        <div className="col-span-3 gap-2 grid grid-cols-2">
                            {/* Unit Price */}
                            <div>
                                <label className="text-black text-sm mb-2">Unit Price</label>
                                <input
                                    type="number"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.unitPrice}
                                    readOnly={isView}
                                    onChange={(e) => {
                                        let price = parseFloat(e.target.value);
                                        let totalP = formData.weight * price;
                                        let totalA = (totalP + formData.serviceCharge) - formData.discAmt;
                                        setFormData({
                                            ...formData, 
                                            unitPrice: price,
                                            subTotal: totalP,
                                            grandTotal: totalA,

                                        });
                                    }}
                                    onFocus={(e) => focusSelect(e)}
                                />
                            </div>
                            {/* Sub Total */}
                            <div>
                                <label className="text-black text-sm mb-2">Sub Total</label>
                                <input
                                    type="number"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.subTotal}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {/* Remark */}
                        <div className="grid col-span-3 h-fit">
                            <label className="text-black text-sm">Remark</label>
                            <textarea
                                className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                value={formData.remark}
                                readOnly={isView}
                                rows="2"
                                onChange={(e) => {
                                    setFormData({
                                        ...formData, 
                                        remark: e.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="col-start-5 col-span-2 grid grid-cols-2 gap-2">
                            {/* Total Price */}
                            <div>
                                <label className="text-black text-sm mb-2">Service Charge (%)</label>
                                <input
                                    type="number"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.servicePer}
                                    onChange={(e) => {
                                        let percentage = parseFloat(e.target.value);
                                        if (percentage < 100 && percentage > 0) {
                                            let serviceCharge = (percentage/100) * formData.subTotal
                                            setFormData({
                                                ...formData,
                                                servicePer: percentage,
                                                serviceCharge: serviceCharge,
                                                grandTotal: (formData.subTotal + serviceCharge) - formData.discAmt
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                servicePer: 0,
                                            })
                                        }
                                    }}
                                    onFocus={(e) => focusSelect(e)}
                                />
                            </div>
                            <div className="grid gap-y-2">
                                {/* Service Charge */}
                                <div>
                                    <label className="text-black text-sm mb-2">Service Charge</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.serviceCharge}
                                        readOnly={isView}
                                        onChange={(e) => {
                                            let charge = parseFloat(e.target.value);
                                            let totalA = charge + formData.subTotal;
                                            setFormData({
                                                ...formData, 
                                                serviceCharge: charge,
                                                servicePer: charge > 0 ? 0 : formData.servicePer,
                                                grandTotal: totalA - formData.discAmt,
                                            });
                                        }}
                                        onFocus={(e) => focusSelect(e)}
                                    />
                                </div>
                                {/* Discount Amount */}
                                <div>
                                    <label className="text-black text-sm mb-2">Discount Amount</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.discAmt}
                                        readOnly={isView}
                                        onChange={(e) => {
                                            let discAmt = parseFloat(e.target.value);
                                            setFormData({
                                                ...formData, 
                                                discAmt: discAmt,
                                                grandTotal: (formData.subTotal + formData.serviceCharge) - discAmt
                                            });
                                        }}
                                        onFocus={(e) => focusSelect(e)}
                                    />
                                </div>
                                {/* Grand Total */}
                                <div>
                                    <label className="text-black text-sm mb-2">Grand Total</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.grandTotal}
                                        readOnly
                                    />
                                </div>
                                {/* Total Amount */}
                                {/* <div>
                                    <label className="text-black text-sm mb-2">Total Amount</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.totalAmt}
                                        readOnly
                                    />
                                </div> */}
                            </div>
                        </div>
                        <div className="grid gap-y-2">
                            
                            
                        </div>
                    </div>
                    <div className="flex items-center justify-end mt-6 gap-2">
                        <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                            <FaFloppyDisk className="text-base" />
                            <Typography variant="small" className="capitalize">
                                Save
                            </Typography>
                        </Button>
                        <Button  color="green" size="sm" variant="gradient" className="flex items-center gap-2">
                            <FaCirclePlus className="text-base" />
                            <Typography variant="small" className="capitalize">
                                Save & New
                            </Typography>
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </div>

        </>
    );

}

export default SalesList;
