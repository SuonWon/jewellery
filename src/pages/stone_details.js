/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useFetchStoneDetailsQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation, useFetchUOMQuery, useFetchTrueBrightnessQuery, useFetchTrueStoneQuery, useFetchTrueGradeQuery, useFetchTrueTypeQuery, useFetchTrueSupplierQuery, useFetchPurchaseQuery, useUpdatePurchaseStatusMutation, useUpdatePurchaseMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import SuccessAlert from "../components/success_alert";
import { focusSelect, sizeUnit } from "../const";

const validator = require("validator");

function StoneDetails() {

    const auth = useAuthUser();

    const {data, refetch} = useFetchStoneDetailsQuery();

    const {data: stoneData} = useFetchTrueStoneQuery();

    const {data: gradeData} = useFetchTrueGradeQuery();

    const {data: typeData} = useFetchTrueTypeQuery();

    const {data: unitData} = useFetchUOMQuery();

    const {data: brightData} = useFetchTrueBrightnessQuery();

    const {data: supplierData} = useFetchTrueSupplierQuery();

    const {data: purchaseData} = useFetchPurchaseQuery();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [selectedPurchase, setSelectedPurchase] = useState([]);

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: '',
        isWarning: false,
        isError: false,
        title: ""
    });

    useEffect(() => {
        refetch();
    }, []);

    // const stoneOption = stoneData?.map((stone) => {
    //     return {value: stone.stoneCode, label: stone.stoneDesc}
    // });

    // const typeOption = typeData?.map((type) => {
    //     return {value: type.typeCode, label: type.typeDesc}
    // });

    // const gradeOption = gradeData?.map((grade) => {
    //     return {value: grade.gradeCode, label: grade.gradeDesc}
    // });

    // const brightOption = brightData?.map((bright) => {
    //     return {value: bright.brightCode, label: bright.brightDesc}
    // });

    // const unitOption = unitData?.map((unit) => {
    //     return {value: unit.unitCode, label: unit.unitCode}
    // });

    const [description, setDescription] = useState({
        stoneDesc: "",
        brightDesc: "",
        gradeDesc: "",
        size: "",
        sizeUnit: "လုံးစီး",
    });

    const [addStoneDetail] = useAddStoneDetailsMutation();

    const [editStoneDetail] = useUpdateStoneDetailsMutation();

    const [removeStoneDetail] = useRemoveStoneDetailsMutation();

    const [updateStatus] = useUpdatePurchaseMutation();

    const [updatePStatus] = useUpdatePurchaseStatusMutation();

    const [deleteId, setDeleteId] = useState('');

    const [purchaseStatus, setPurchaseStatus] = useState(false);

    const [ validationText, setValidationText ] = useState({});

    const [purchase, setPurchase] = useState({});

    const stoneDetail = {
        stoneDesc: "",
        referenceNo: "",
        supplierCode: 0,
        stoneCode: 0,
        typeCode: 0,
        brightCode: 0,
        gradeCode: 0,
        size: 0,
        sizeUnit: "လုံးစီး",
        qty: 0,
        weight: 0,
        unitCode: "ct",
        remark: "",
        isActive: true,
        createdBy: auth().username,
        updatedBy: "",
    };

    const [formData, setFormData] = useState(stoneDetail);

    const openModal = () => {
        setIsEdit(false);
        setFormData(stoneDetail);
        setDescription({
            stoneDesc: "",
            brightDesc: "",
            gradeDesc: "",
            size: "",
            sizeUnit: "လုံးစီး",
        });
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        // if(validator.isEmpty(formData.referenceNo.toString())) {
        //     newErrors.referenceNo = 'Reference No is required.';
        // }
        if(formData.supplierCode === 0) {
            newErrors.supplierCode = 'Supplier name is required.'
        }
        if(formData.stoneCode === 0) {
            newErrors.stoneDesc = 'Stone Description is required.'
        } 
        if(formData.brightCode === 0) {
            newErrors.brightDesc = 'Bright Description is required.'
        }
        if(formData.gradeCode === 0) {
            newErrors.gradeDesc = 'Grade Description is required.'
        }
        if(formData.typeCode === 0) {
            newErrors.typeDesc = 'Type Description is required.'
        }
        if(validator.isEmpty(formData.unitCode.toString())) {
            newErrors.unitDesc = 'Unit is required.'
        }
        if(formData.size === 0) {
            newErrors.size = 'Size is required.'
        }
        // if(formData.qty === 0) {
        //     newErrors.qty = 'Quantity is required.'
        // }
        // if(formData.weight === 0) {
        //     newErrors.weight = 'Weight is required.'
        // }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            console.log(formData);
            try {
                console.log("Ji");
                addStoneDetail({
                    ...formData,
                    stoneDesc: `${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`,
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
                if (purchaseStatus) {
                    updatePStatus({
                        id: formData.referenceNo,
                        updatedBy: auth().username,
                    });
                }
                setPurchaseStatus(false);
                setFormData(stoneDetail);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            try {
                addStoneDetail({
                    ...formData,
                    stoneDesc: `${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`,
                }).then((res) => {

                    if(res.error != null) {
                        setOpen(!open);
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
                if (purchaseStatus) {
                    updatePStatus({
                        id: formData.referenceNo,
                        updatedBy: auth().username,
                    });
                }
                setPurchaseStatus(false);
                setFormData(stoneDetail);
                setDescription({
                    stoneDesc: "",
                    brightDesc: "",
                    gradeDesc: "",
                    size: "",
                    sizeUnit: "လုံးစီး",
                });
            }
            catch(err) {
                console.log(err.statusCode);
            }
            
        }
    };

    const handleEdit = async (id) => {
        let eData = data.find((stoneDetail) => stoneDetail.stoneDetailCode === id);
        let tempPurchase = purchaseData.find(res => res.invoiceNo === eData.referenceNo);
        setPurchase({
            invoiceNo: tempPurchase.invoiceNo,
            purDate: tempPurchase.purDate,
            supplierCode: tempPurchase.supplierCode,
            stoneCode: tempPurchase.stoneCode,
            qty: tempPurchase.qty,
            totalWeight: tempPurchase.totalWeight,
            unitCode: tempPurchase.unitCode,
            unitPrice: tempPurchase.unitPrice,
            subTotal: tempPurchase.subTotal,
            servicePer: tempPurchase.servicePer,
            serviceCharge: tempPurchase.serviceCharge,
            discAmt: tempPurchase.discAmt,
            grandTotal: tempPurchase.grandTotal,
            remark: tempPurchase.remark,
            paidStatus: tempPurchase.paidStatus,
            status: tempPurchase.status,
            createdBy: tempPurchase.createdBy,
            createdAt: tempPurchase.createdAt,
            updatedBy: tempPurchase.updatedBy,
            updatedAt: tempPurchase.updatedAt,
            deletedBy: tempPurchase.deletedBy,
            purchaseShareDetails: tempPurchase.purchaseShareDetails.map(el => {
                return {
                    id: el.id,
                    lineNo: el.lineNo,
                    shareCode: el.shareCode,
                    sharePercentage: el.sharePercentage,
                    amount: el.amount,
                }
            }),
        });
        setPurchaseStatus(tempPurchase.status === 'F' ? true : false)
        setIsEdit(true);
        setFormData(eData);
        setDescription({
            stoneDesc: eData.stone.stoneDesc,
            brightDesc: eData.stoneBrightness.brightDesc,
            gradeDesc: eData.stoneGrade.gradeDesc,
            size: eData.size,
            sizeUnit: eData.sizeUnit,
        });
        setOpen(!open);
    };

    const submitEdit = async () => {
        if(validateForm()) {
            let tempStatus = purchaseStatus ? 'F' : 'O';
            editStoneDetail({
                stoneDetailCode: formData.stoneDetailCode,
                referenceNo: formData.referenceNo,
                supplierCode: formData.supplierCode,
                stoneDesc: `${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`,
                stoneCode: formData.stoneCode,
                typeCode: formData.typeCode,
                brightCode: formData.brightCode,
                gradeCode: formData.gradeCode,
                size: formData.size,
                sizeUnit: formData.sizeUnit,
                qty: formData.qty,
                weight: formData.weight,
                unitCode: formData.unitCode,
                remark: formData.remark,
                isActive: formData.isActive,
                createdBy: formData.createdBy,
                updatedBy: auth().username,
            }).then((res) => {
                console.log(res);
            });
            if(tempStatus !== purchase.status && formData.referenceNo !== "") {
                updateStatus({
                    ...purchase,
                    status: tempStatus,
                    updatedBy: auth().username,
                })
            }
            setOpen(!open);
        }
    };

    const handleRemove = async (id) => {
        removeStoneDetail(id).then((res) => {console.log(res)});
        setOpenDelete(!openDelete);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const column = [
        {
            name: 'Status',
            width: "150px",
            center: "true",
            cell: row => (
                <div className={`w-[90px] flex items-center justify-center text-white h-7 rounded-full ${row.Status ? 'bg-green-500' : 'bg-red-500' } `}>
                    {
                        row.Status ? 'Active' : 'Inactive'
                    }
                </div>
            ),
        },
        {
            name: 'Quantity',
            width: "100px",
            selector: row => row.Qty,

        },
        {
            name: 'Description',
            width: '280px',
            selector: row => row.Description,
        },
        {
            name: 'Reference No',
            width: '150px',
            selector: row => row.ReferenceNo,
        },
        {
            name: 'Supplier Name',
            width: '200px',
            selector: row => row.SupplierName,
        },
        {
            name: 'Size',
            width: "150",
            selector: row => row.Size,

        },
        {
            name: 'Size Unit',
            width: "150",
            selector: row => row.SizeUnit,

        },
        // {
        //     name: 'Stone Description',
        //     width: "200px",
        //     selector: row => row.StoneDesc,

        // },
        {
            name: 'Brightness',
            width: "150px",
            selector: row => row.BrightnessDesc,

        },
        {
            name: 'Grade',
            width: "150px",
            selector: row => row.GradeDesc,

        },
        {
            name: 'Type',
            width: "150px",
            selector: row => row.TypeDesc,
        },
        {
            name: 'Weight',
            width: "150px",
            selector: row => row.Weight,
        },
        {
            name: 'Unit',
            width: "150px",
            selector: row => row.UnitDesc,
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

    const tbodyData = data?.map((stoneDetail) => {
        return {
            Code: stoneDetail.stoneDetailCode,
            ReferenceNo: stoneDetail.referenceNo,
            SupplierName: stoneDetail.supplier.supplierName,
            Description: stoneDetail.stoneDesc,
            StoneDesc: stoneDetail.stone.stoneDesc,
            BrightnessDesc: stoneDetail.stoneBrightness.brightDesc,
            GradeDesc: stoneDetail.stoneGrade.gradeDesc,
            TypeDesc: stoneDetail.stoneType.typeDesc,
            Size: stoneDetail.size,
            SizeUnit: stoneDetail.sizeUnit,
            Qty: stoneDetail.qty,
            Weight: stoneDetail.weight,
            UnitDesc: stoneDetail.unitCode,
            CreatedAt: moment(stoneDetail.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: stoneDetail.createdBy,
            UpdatedAt: moment(stoneDetail.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: stoneDetail.updatedBy,
            Remark: stoneDetail.remark,
            Status: stoneDetail.isActive,
        }
    });

    return(
        <>
        <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
            <SectionTitle title="Stone Details" handleModal={openModal} />
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    alert.isAlert && <SuccessAlert title="Stone Details" message={alert.message} isError={true} />
                }
            </div>
            <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="lg">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Stone Detail" : "Create Stone Detail"} handleClick={openModal} />
                    {
                        alert.isAlert? <SuccessAlert title={alert.title} message={alert.message} isWarning={alert.isWarning} /> : ""
                    }
                    <form  className="flex flex-col p-3 gap-4">
                        <div className="grid grid-cols-4 gap-2">
                            <div className="w-full col-span-2">
                                <label className="text-black text-sm mb-2">Description</label>
                                <input className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-md" value={`${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`} disabled />
                                {
                                    validationText.description && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.description}</p>
                                }
                            </div>
                            {/* <div className="w-full col-span-2">
                                <Input label="Name" value={`${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`} readOnly/>
                                {
                                    validationText.customerName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customerName}</p>
                                }
                            </div> */}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-black text-sm mb-2">Supplier Name</label>
                                <select 
                                    className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                    value={formData.supplierCode}
                                    onChange={(e) => {
                                        let selectP = purchaseData.filter(el => el.supplierCode === Number(e.target.value));
                                        console.log(selectP);
                                        setSelectedPurchase(selectP);
                                        setFormData({
                                            ...formData,
                                            supplierCode: Number(e.target.value),
                                            referenceNo: "",
                                        });
                                    }}
                                >
                                    <option value="0" disabled>Select supplier</option>
                                    {
                                        supplierData?.map((supplier) => {
                                            return <option value={supplier.supplierCode} key={supplier.supplierCode}>{supplier.supplierName}</option>
                                        })
                                    }
                                </select>
                                {
                                    validationText.supplierCode && <p className="block text-[12px] text-red-500 font-sans">{validationText.supplierCode}</p>
                                }
                            </div>
                            <div className="col-span-2 grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <label className="text-black text-sm mb-2">Reference No</label>
                                    <select 
                                        className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                        value={formData.referenceNo}
                                        onChange={(e) => {
                                            setFormData({...formData, referenceNo: e.target.value});
                                        }}
                                    >
                                        <option value="" disabled>Select...</option>
                                        {
                                            selectedPurchase.length === 0?
                                            purchaseData?.map((purchase) => {
                                                return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo} ({purchase.supplier.supplierName}, {purchase.stone.stoneDesc})</option>
                                            }) : 
                                            selectedPurchase?.map((purchase) => {
                                                return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo} ({purchase.supplier.supplierName}, {purchase.stone.stoneDesc})</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="">
                                    <label className="text-black text-sm mb-2">Purchase Complete</label>
                                    <div className="w-full">
                                        <input 
                                            type="checkbox" 
                                            className="border border-blue-gray-200 w-[20px] h-[20px] py-1.5 rounded-md text-black"
                                            checked={purchaseStatus}
                                            onChange={() => {
                                                if (formData.referenceNo === "") {
                                                    setAlert({
                                                        isAlert: true,
                                                        message: "Please select reference no.",
                                                        isWarning: true,
                                                        title: "Warning"
                                                    })
                                                    setTimeout(() => {
                                                        setAlert({
                                                            isAlert: false,
                                                            message: '',
                                                            isWarning: false,
                                                            title: ''
                                                        })
                                                    }, 2000);
                                                } else {
                                                    setPurchaseStatus(!purchaseStatus);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* <input className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-md" value={formData.referenceNo} disabled /> */}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <div>
                                <label className="text-black text-sm mb-2">Type</label>
                                <select 
                                    className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                    value={formData.typeCode}
                                    onChange={(e) => {
                                        setFormData({...formData, typeCode: Number(e.target.value)});
                                    }}
                                >
                                    <option value="0" disabled>Select...</option>
                                    {
                                        typeData?.map((type) => {
                                            return <option value={type.typeCode} key={type.typeCode}>{type.typeDesc}</option>
                                        })
                                    }
                                </select>
                                {
                                    validationText.typeDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.typeDesc}</p>
                                }
                            </div>
                            <div>
                                <label className="text-black text-sm mb-2">Stone Description</label>
                                <select 
                                    className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                    value={formData.stoneCode}
                                    onChange={(e) => {
                                        setDescription({...description, stoneDesc: e.target.selectedOptions[0].text}); 
                                        setFormData({...formData, stoneCode: Number(e.target.value)});
                                    }}
                                >
                                    <option value="0" disabled>Select...</option>
                                    {
                                        stoneData?.map((stone) => {
                                            return <option value={stone.stoneCode} key={stone.stoneCode}>{stone.stoneDesc}</option>
                                        })
                                    }
                                </select>
                                {/* <Select 
                                    options={stoneOption} 
                                    isSearchable
                                    defaultValue={{value: formData.stoneCode, label: formData.stone === ""? "Select..." : formData.stone}}
                                    onChange={(e) => {
                                        setDescription({...description, stoneDesc: e.label}); 
                                        setFormData({...formData, stoneCode: Number(e.value)});
                                    }}
                                /> */}
                                {
                                    validationText.stoneDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.stoneDesc}</p>
                                }
                            </div>
                            <div>
                                <label className="text-black text-sm mb-2">Brightness</label>
                                <select 
                                    className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                    value={formData.brightCode}
                                    onChange={(e) => {
                                        setDescription({...description, brightDesc: e.target.selectedOptions[0].text}); 
                                        setFormData({...formData, brightCode: Number(e.target.value)});
                                    }}
                                >
                                    <option value="0" disabled>Select...</option>
                                    {
                                        brightData?.map((bright) => {
                                            return <option value={bright.brightCode} key={bright.brightCode}>{bright.brightDesc}</option>
                                        })
                                    }
                                </select>
                                {/* <Select 
                                    options={brightOption} 
                                    isSearchable
                                    defaultValue={{value: formData.brightCode, label: formData.stone === ""? "Select..." : formData.bright}}
                                    onChange={(e) => {
                                        setDescription({...description, brightDesc: e.label}); 
                                        setFormData({...formData, brightCode: Number(e.value)});
                                    }}
                                /> */}
                                {
                                    validationText.brightDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.brightDesc}</p>
                                }
                            </div>
                            
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <div>
                                <label className="text-black text-sm mb-2">Grade</label>
                                <select 
                                    className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                    value={formData.gradeCode}
                                    onChange={(e) => {
                                        setDescription({...description, gradeDesc: e.target.selectedOptions[0].text}); 
                                        setFormData({...formData, gradeCode: Number(e.target.value)});
                                    }}
                                >
                                    <option value="0" disabled>Select...</option>
                                    {
                                        gradeData?.map((grade) => {
                                            return <option value={grade.gradeCode} key={grade.gradeCode}>{grade.gradeDesc}</option>
                                        })
                                    }
                                </select>
                                {/* <Select 
                                    options={gradeOption} 
                                    isSearchable
                                    defaultValue={{value: formData.gradeCode, label: formData.grade === ""? "Select..." : formData.grade}}
                                    onChange={(e) => {
                                        setFormData({...formData, gradeCode: Number(e.value)});
                                    }}
                                /> */}
                                {
                                    validationText.gradeDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.gradeDesc}</p>
                                }
                            </div>
                            <div className="col-span-2">
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="w-full">
                                        <label className="text-black text-sm mb-2">Size</label>
                                        <input 
                                            type="number" 
                                            className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" 
                                            value={formData.size} 
                                            onChange={(e) => {
                                                setDescription({...description, size: Number(e.target.value)}); 
                                                setFormData({...formData, size: Number(e.target.value)})
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                        {
                                            validationText.size && <p className="block text-[12px] text-red-500 font-sans">{validationText.size}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="text-black text-sm mb-2">Size Unit</label>
                                        <select 
                                            className="block w-full text-sm text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                            value={formData.sizeUnit}
                                            onChange={(e) => {
                                                setDescription({...description, sizeUnit: e.target.value});
                                                setFormData({...formData, sizeUnit: e.target.value});
                                            }}
                                        >
                                            {
                                                sizeUnit.map((el, index) => {
                                                    return <option value={el} key={index}>{el}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.sizeUnit && <p className="block text-[12px] text-red-500 font-sans">{validationText.sizeUnit}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="text-black text-sm mb-2">Qty</label>
                                        <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.qty} onChange={(e) => setFormData({...formData, qty: Number(e.target.value)})} readOnly={isEdit} onFocus={(e) => focusSelect(e)}/>
                                        {
                                            validationText.qty && <p className="block text-[12px] text-red-500 font-sans">{validationText.qty}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="text-black text-sm mb-2">Weight</label>
                                        <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.weight} onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} onFocus={(e) => focusSelect(e)} />
                                        {
                                            validationText.weight && <p className="block text-[12px] text-red-500 font-sans">{validationText.weight}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <div>
                                <label className="text-black text-sm mb-2">Unit</label>
                                <select 
                                    className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                    value={formData.unitCode}
                                    onChange={(e) => {
                                        setFormData({...formData, unitCode: e.target.value});
                                    }}
                                >
                                    <option value="" disabled>Select...</option>
                                    {
                                        unitData?.map((unit) => {
                                            return <option value={unit.unitCode} key={unit.unitCode}>{unit.unitCode}</option>
                                        })
                                    }
                                </select>
                                {/* <Select 
                                    options={unitOption} 
                                    isSearchable
                                    defaultValue={{value: formData.unitCode, label: formData.unitCode}}
                                    onChange={(e) => {
                                        setFormData({...formData, unitCode: e.value});
                                    }}
                                /> */}
                                {
                                    validationText.unitDesc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.unitDesc}</p>
                                }
                            </div>
                            <div className="col-span-2">
                                <label className="text-black text-sm mb-2">Remark</label>
                                <textarea
                                    className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                    rows={1} 
                                    value={formData.remark} onChange={(e) => setFormData({...formData, remark: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-6 gap-2">
                            {
                                isEdit ? 
                                <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                    <FaFloppyDisk className="text-base" />
                                    <Typography variant="small" className="capitalize">
                                        Update
                                    </Typography>
                                </Button> : 
                                <>
                                    <Button onClick={onSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save
                                        </Typography>
                                    </Button>
                                    <Button onClick={onSaveSubmit} color="green" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaCirclePlus className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save & New
                                        </Typography>
                                    </Button>
                                </>
                            }
                            
                        </div>
                    </form>
                </DialogBody>
            </Dialog>
            <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
        </div>

        </>
    );

}

export default StoneDetails;
