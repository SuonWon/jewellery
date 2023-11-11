/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaEye, FaFloppyDisk, FaPencil, FaPlus, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { focusSelect, pause } from "../const";
import { useAddDamageMutation, useFetchDamageIdQuery, useFetchDamageQuery, useFetchPurchaseQuery, useFetchStoneDetailsQuery, useFetchUOMQuery, useRemoveDamageMutation, useUpdateDamageMutation, } from "../store";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";
import axios from "axios";
const validator = require('validator');

function Adjustment() {

    const { data } = useFetchDamageQuery();

    const {data: stoneDetails} = useFetchStoneDetailsQuery();

    const {data: unitData} = useFetchUOMQuery();

    const {data: purchaseData} = useFetchPurchaseQuery();

    axios.get('http://localhost:3005/v1/damage/get-id').then((res) => {
        setDamageId(res.data);
    });

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [isEdit, setIsView] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const [damageId, setDamageId] = useState("");

    const [removeDamage, removeResult] = useRemoveDamageMutation();

    const [addDamage] = useAddDamageMutation();

    const [updateDamage] = useUpdateDamageMutation();

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: ''
    });

    const damageData = {
        damageNo: "",
        damageDate: moment().format("YYYY-MM-DD"),
        referenceNo: "",
        stoneDetailCode: "",
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

    const [formData, setFormData] = useState(damageData);

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.damageNo === id);
        removeDamage({
            id: removeData[0].damageNo,
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
        setFormData(damageData);
        setIsView(false);
        setOpen(!open);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.damageNo === id);
        console.log(tempData);
        setFormData(tempData);
        setIsView(true);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if (formData.damageDate === "") {
            newErrors.damageDate = "Damage Date is required."
        }

        if (formData.referenceNo === "") {
            newErrors.referenceNo = "Reference No is required."
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
            try {
                console.log(formData);
                addDamage({
                    ...formData,
                    damageNo: damageId,
                    damageDate: moment(formData.returnDate).toISOString(),
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
                setFormData(damageData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(damageData);
            setOpen(!open);
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            try {
                addDamage({
                    ...formData,
                    damageNo: damageId,
                    damageDate: moment(formData.returnDate).toISOString(),
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
                setFormData(damageData);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(damageData);
        }
    };

    const handleUpdate = () => {
        if (validateForm()) {
            try {
                console.log(formData);
                updateDamage({
                    damageNo: formData.damageNo,
                    damageDate: formData.damageDate,
                    referenceNo: formData.referenceNo,
                    stoneDetailCode: formData.stoneDetailCode,
                    qty: formData.qty,
                    weight: formData.weight,
                    unitCode: formData.unitCode,
                    unitPrice: formData.unitPrice,
                    totalPrice: formData.totalPrice,
                    remark: formData.remark,
                    status: formData.status,
                    createdBy: formData.createdBy,
                    createdAt: formData.createdDate,
                    updatedBy: auth().username,
                    updatedAt: moment().toISOString(),
                    deletedBy: "",
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
                setFormData(damageData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(damageData);
            setOpen(!open);
        }
    };

    const column = [
        {
            name: 'Status',
            width: '200px',
            selector: row => row.status,
            omit: true
        },
        {
            name: 'Damage No',
            width: '200px',
            selector: row => row.damageNo,
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => row.damageDate,
        },
        {
            name: 'Reference No',
            width: "200px",
            selector: row => row.referenceNo,
        },
        {
            name: 'Stone Detail',
            width: "200px",
            selector: row => row.stoneDetail,
        },
        {
            name: 'Qty',
            width: "150px",
            selector: row => row.qty,
        },
        {
            name: 'Weight',
            width: "150px",
            selector: row => row.weight,
        },
        {
            name: 'Unit',
            width: "150px",
            selector: row => row.unit,
        },
        {
            name: 'Unit Price',
            width: "150px",
            selector: row => row.unitPrice,
        },
        {
            name: 'Total Price',
            width: "150px",
            selector: row => row.totalPrice,
        },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.remark,
        },
        {
            name: 'Created At',
            width: "200px",
            selector: row => row.createdAt,
        },
        {
            name: 'Updated At',
            width: "200px",
            selector: row => row.updatedAt,
        },
        {
            name: 'Action',
            center: true,
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <Link to={`/purchase_edit/${row.Code}`}>
                        <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
                    </Link> */}
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.damageNo)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.damageNo)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((damageData) => {
        return {
            damageNo: damageData.damageNo,
            damageDate: moment(damageData.damageDate).format("YYYY-MM-DD"),
            referenceNo: damageData.referenceNo,
            stoneDetail: damageData.stoneDetailCode,
            qty: damageData.qty.toLocaleString('en-US'),
            weight: damageData.weight.toLocaleString('en-US'),
            unit: damageData.unitCode,
            unitPrice: damageData.unitPrice.toLocaleString('en-US'),
            totalPrice: damageData.unitPrice.toLocaleString('en-US'),
            remark: damageData.remark,
            createdAt: moment(damageData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: damageData.createdBy,
            updatedAt: moment(damageData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: damageData.updatedBy,
            status: damageData.status,
        }
    });

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
                        Damage List
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
                        <ModalTitle titleName={isEdit ? "Edit Damage" : "Create Damage"} handleClick={() => setOpen(!open)} />
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {
                                isEdit? 
                                <div>
                                    {/* Damage No */}
                                    <label className="text-black text-sm mb-2">Damage No</label>
                                    <input
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.damageNo}
                                        readOnly={isEdit}
                                    />
                                </div> : 
                                <div>
                                    {/* Reference No */}
                                    <label className="text-black text-sm mb-2">Reference No</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={formData.referenceNo}
                                        onChange={(e) => {
                                            setFormData({...formData, referenceNo: e.target.value});
                                        }}
                                    >
                                        <option value="" disabled>Select...</option>
                                        {
                                            purchaseData?.map((purchase) => {
                                                return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo}</option>
                                            })
                                        }
                                    </select>
                                    {
                                        validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                    }
                                </div>
                            }
                            
                            {/* Return Date */}
                            <div className="col-start-4 col-end-4">
                                <label className="text-black mb-2 text-sm">Damage Date</label>
                                <input
                                    type="date"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={moment(formData.damageDate).format("YYYY-MM-DD")}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        damageDate: e.target.value
                                    })}
                                />
                                {
                                    validationText.damageDate && <p className="block text-[12px] text-red-500 font-sans">{validationText.damageDate}</p>
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {
                                isEdit? 
                                <div>
                                    {/* Reference No */}
                                    <label className="text-black text-sm mb-2">Reference No</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={formData.referenceNo}
                                        onChange={(e) => {
                                            setFormData({...formData, referenceNo: e.target.value});
                                        }}
                                    >
                                        <option value="" disabled>Select...</option>
                                        {
                                            purchaseData?.map((purchase) => {
                                                return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo}</option>
                                            })
                                        }
                                    </select>
                                    {
                                        validationText.referenceNo && <p className="block text-[12px] text-red-500 font-sans">{validationText.referenceNo}</p>
                                    }
                                </div> : ""
                            }
                            {/* Stone Details */}
                            <div className="">
                                <label className="text-black mb-2 text-sm">Stone Details</label>
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
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-right"
                                        value={formData.totalPrice.toLocaleString()}
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
                            {
                                isEdit? 
                                <Button onClick={handleUpdate} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                    <FaFloppyDisk className="text-base" />
                                    <Typography variant="small" className="capitalize">
                                        Update
                                    </Typography>
                                </Button> : 
                                <>
                                    <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save
                                        </Typography>
                                    </Button>
                                    <Button onClick={handleSave} color="green" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaCirclePlus className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save & New
                                        </Typography>
                                    </Button>
                                </>
                            }
                        </div>
                    </DialogBody>
                </Dialog>
            </div>

        </>
    );

}

export default Adjustment;
