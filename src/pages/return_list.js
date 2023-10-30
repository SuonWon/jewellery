/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaEye, FaFloppyDisk, FaPlus, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { focusSelect, pause } from "../const";
import { useFetchStoneDetailsQuery, useFetchTruePurchaseQuery, useFetchUOMQuery, useRemovePurchaseMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
const validator = require('validator');

function ReturnList() {

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [isView, setIsView] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const { data } = useFetchTruePurchaseQuery();

    const {data: stoneDetails} = useFetchStoneDetailsQuery();

    const {data: unitData} = useFetchUOMQuery();

    const [removeReturn, removeResult] = useRemovePurchaseMutation();

    const returnData = {
        returnNo: "",
        returnDate: moment().format("YYYY-MM-DD"),
        referenceNo: "",
        stoneDetailCode: 0,
        qty: 0,
        weight: 0,
        unitCode: 'ct',
        unitPrice: 0,
        totalPrice: 0,
        remark: "",
        status: "O",
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
    };

    const [formData, setFormData] = useState(returnData);

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removeReturn({
            id: removeData[0].invoiceNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => { console.log(res) });
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
        setFormData(returnData);
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

        if (formData.returnDate === "") {
            newErrors.returnData = "Return Date is required."
        }

        if (formData.referenceNo === "") {
            newErrors.referenceNo = "Reference No is required."
        }

        if (formData.stoneDetailCode === 0) {
            newErrors.stoneDetailCode = "Stone Detail is required."
        }
        
        if (validator.isEmpty(formData.unitCode)) {
            newErrors.unitCode = "Unit is required."
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    }

    const handleSubmit = () => {
        console.log(returnData)
        if(validateForm()) {
            console.log(formData);
            setFormData(returnData);
            setOpen(!open);
        }
    }

    const handleSave = () => {
        console.log(formData);
        setFormData(returnData);
    }

    // const column = [
    //     {
    //         name: 'Status',
    //         width: '200px',
    //         selector: row => row.status,
    //         omit: true
    //     },
    //     {
    //         name: 'Return No',
    //         width: '200px',
    //         selector: row => row.returnNo,
    //         omit: true
    //     },
    //     {
    //         name: 'Date',
    //         width: "150px",
    //         selector: row => row.returnDate,
    //     },
    //     {
    //         name: 'Reference No',
    //         width: "200px",
    //         selector: row => row.referenceNo,
    //     },
    //     {
    //         name: 'Stone Detail',
    //         width: "200px",
    //         selector: row => row.stoneDetail,
    //     },
    //     {
    //         name: 'Qty',
    //         width: "150px",
    //         selector: row => row.qty,
    //     },
    //     {
    //         name: 'Weight',
    //         width: "150px",
    //         selector: row => row.weight,
    //     },
    //     {
    //         name: 'Unit',
    //         width: "150px",
    //         selector: row => row.unitCode,
    //     },
    //     {
    //         name: 'Unit Price',
    //         width: "150px",
    //         selector: row => row.unitPrice,
    //     },
    //     {
    //         name: 'Total Price',
    //         width: "150px",
    //         selector: row => row.totalPrice,
    //     },
    //     {
    //         name: 'Remark',
    //         width: "200px",
    //         selector: row => row.remark,
    //     },
    //     {
    //         name: 'Created At',
    //         width: "200px",
    //         selector: row => row.createdAt,
    //     },
    //     {
    //         name: 'Updated At',
    //         width: "200px",
    //         selector: row => row.updatedAt,
    //     },
    //     {
    //         name: 'Action',
    //         center: true,
    //         width: "100px",
    //         cell: (row) => (
    //             <div className="flex items-center gap-2">
    //                 {/* <Link to={`/purchase_edit/${row.Code}`}>
    //                     <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
    //                 </Link> */}
    //                 <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.Code)}><FaEye /></Button>
    //                 <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
    //             </div>
    //         )
    //     },
    // ];

    // const tbodyData = data?.map((returnData) => {
    //     return {
    //         returnNo: returnData.returnNo,
    //         returnDate: moment(returnData.returnDate).format("YYYY-MM-DD"),
    //         referenceNo: returnData.referenceNo,
    //         stoneDetail: returnData.stoneDetailCode,
    //         qty: returnData.qty.toLocaleString('en-US'),
    //         weight: returnData.weight.toLocaleString('en-US'),
    //         unit: returnData.unitCode,
    //         unitPrice: returnData.unitPrice.toLocaleString('en-US'),
    //         totalPrice: returnData.unitPrice.toLocaleString('en-US'),
    //         Remark: returnData.remark,
    //         createdAt: moment(returnData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
    //         createdBy: returnData.createdBy,
    //         updatedAt: moment(returnData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
    //         updatedBy: returnData.updatedBy,
    //         status: returnData.status,
    //     }
    // });

    return (
        <>
            <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                <div className="w-78 absolute top-0 right-0 z-[9999]">
                    {
                        removeResult.isSuccess && isAlert && <SuccessAlert title="Purchase" message="Delete successful." handleAlert={() => setIsAlert(false)} />
                    }
                </div>
                <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h5">
                        Return List
                    </Typography>
                    <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                        <FaPlus /> Create New
                    </Button>
                </div>
                <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                    <CardBody className="rounded-sm overflow-auto p-0">
                        {/* <TableList columns={column} data={tbodyData} /> */}
                    </CardBody>
                </Card>
                <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                <Dialog open={open} size="lg">
                    <DialogBody>
                        <ModalTitle titleName="Return" handleClick={() => setOpen(!open)} />
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {/* Reference No */}
                            <div>
                                <label className="text-black text-sm mb-2">Reference No</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.referenceNo}
                                    readOnly={isView}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData, 
                                            referenceNo: e.target.value,
                                        });
                                    }}
                                />
                                {
                                    validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                }
                            </div>
                            {/* Return Date */}
                            <div className="col-start-4 col-end-4">
                                <label className="text-black mb-2 text-sm">Return Date</label>
                                <input
                                    type="date"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={moment(formData.returnDate).format("YYYY-MM-DD")}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        returnDate: e.target.value
                                    })}
                                    readOnly={isView}
                                />
                                {
                                    validationText.returnDate && <p className="block text-[12px] text-red-500 font-sans">{validationText.returnDate}</p>
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {/* Stone Details */}
                            <div className="">
                                <label className="text-black mb-2 text-sm">Stone Details</label>
                                {
                                    isView ? <input
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.stoneDetailCode}
                                        readOnly={isView}
                                    /> :
                                    <select 
                                        className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                        value={formData.stoneDetailCode} 
                                        onChange={(e) => 
                                            setFormData({
                                                ...formData, 
                                                stoneDetailCode: Number(e.target.value),
                                            })
                                        }
                                        >
                                        <option value="0" disabled>Select stone detail</option>
                                        {
                                            stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                            stoneDetails?.map((stoneDetail) => {
                                                return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc}</option>
                                            })
                                        }
                                    </select>
                                }
                                {
                                    validationText.stoneDetailCode && <p className="block text-[12px] text-red-500 font-sans">{validationText.stoneDetailCode}</p>
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
                                            setFormData({
                                                ...formData, 
                                                weight: weight,
                                                totalPrice: formData.unitPrice * weight,
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
                                            setFormData({
                                                ...formData, 
                                                unitPrice: price,
                                                totalPrice: formData.weight * price,

                                            });
                                        }}
                                        onFocus={(e) => focusSelect(e)}
                                    />
                                </div>
                                {/* Total Price */}
                                <div>
                                    <label className="text-black text-sm mb-2">Total Price</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.totalPrice}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            {/* Remark */}
                            <div className="grid col-span-3 h-fit">
                                <label className="text-black mb-2 text-sm">Remark</label>
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

export default ReturnList;
