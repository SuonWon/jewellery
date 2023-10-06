/* eslint-disable eqeqeq */
import { Alert, Button, Card, CardBody, Dialog, DialogBody, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useFetchStoneDetailsQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation, useFetchUOMQuery, useFetchTrueBrightnessQuery, useFetchTrueStoneQuery, useFetchTrueGradeQuery, useFetchTrueTypeQuery } from "../store";
import { useForm } from "react-hook-form";
import { pause, currentDate } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
const validator = require("validator");

function StoneDetails() {

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const [isEdit, setIsEdit] = useState(false);

    const [editData, setEditData] = useState({});

    const {data} = useFetchStoneDetailsQuery();

    const {data: stoneData} = useFetchTrueStoneQuery();

    const {data: gradeData} = useFetchTrueGradeQuery();

    const {data: typeData} = useFetchTrueTypeQuery();

    const {data: unitData} = useFetchUOMQuery();

    const {data: brightData} = useFetchTrueBrightnessQuery();

    const [description, setDescription] = useState({
        stoneDesc: "",
        brightDesc: "",
        typeDesc: ""
    });

    const [stoneDesc, setStoneDesc] = useState("");

    const [brightDesc, setBrightDesc] = useState("");

    const [typeDesc, setTypeDesc] = useState("");

    const [addStoneDetail, addResult] = useAddStoneDetailsMutation();

    const [editStoneDetail] = useUpdateStoneDetailsMutation();

    const [removeStoneDetail] = useRemoveStoneDetailsMutation();

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    useEffect(() => {
        setFormData({
            stoneDesc: "",
            stoneCode: 0,
            typeCode: 0,
            brightCode: 0,
            gradeCode: 0,
            size: "",
            qty: 0,
            weight: 0,
            unitCode: "",
            remark: "",
            isActive: true,
            createdAt: moment().toISOString(),
            createdBy: auth().username,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        });
    }, [addResult.isSuccess]);

    const [formData, setFormData] = useState({
        stoneDesc: "",
        stoneCode: 0,
        typeCode: 0,
        brightCode: 0,
        gradeCode: 0,
        size: "",
        qty: 0,
        weight: 0,
        unitCode: "",
        remark: "",
        isActive: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
        updatedAt: moment().toISOString(),
        updatedBy: "",
    });

    const stoneDetail = {
        stoneDesc: "",
        stoneCode: "",
        typeCode: "",
        brightCode: "",
        gradeCode: "",
        size: "",
        qty: "",
        weight: "",
        unitCode: "",
        remark: "",
        isActive: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
        updatedAt: moment().toISOString(),
        updatedBy: "",
    };

    const {register, handleSubmit, setValue, formState: {errors}, reset } = useForm({
        defaultValues: {
            detailsInfo: stoneDetail
        }
    });

    const resetData = () => {
        reset({
            detailsInfo: stoneDetail
        });
    };

    const openModal = () => {
        setIsEdit(false);
        setFormData({
            stoneDesc: "",
            stoneCode: 0,
            typeCode: 0,
            brightCode: 0,
            gradeCode: 0,
            size: "",
            qty: 0,
            weight: 0,
            unitCode: "",
            remark: "",
            isActive: true,
            createdAt: moment().toISOString(),
            createdBy: auth().username,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        })
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};
        if(validator.isEmpty(formData.customerName.toString())) {
            newErrors.customerName = 'Customer name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addStoneDetail(formData).then((res) => {
                console.log(res);
            });
            setOpen(!open);
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            addStoneDetail(formData).then((res) => {
                console.log(res);
            });
        }
    };

    const handleEdit = async (id) => {
        let eData = data.filter((stoneDetail) => stoneDetail.stoneDetailCode === id);
        setEditData(eData[0]);
        setIsEdit(true);
        setFormData(eData[0]);
        setOpen(!open);
    };

    const submitEdit = async () => {
        editStoneDetail({
            ...formData,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });
        setOpen(!open);
    };

    const handleRemove = async (id) => {
        removeStoneDetail(id).then((res) => {console.log(res)});
        setIsAlert(true);
        setOpenDelete(!openDelete);
        await pause(2000);
        setIsAlert(false);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const column = [
        {
            name: 'Description',
            width: '200px',
            selector: row => row.Description,
        },
        {
            name: 'Stone Description',
            width: "200px",
            selector: row => row.StoneDesc,

        },
        {
            name: 'Brightness',
            width: "200px",
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
            name: 'Size',
            width: "200px",
            selector: row => row.Size,

        },
        {
            name: 'Quantity',
            width: "200px",
            selector: row => row.Qty,

        },
        {
            name: 'Weight',
            width: "200px",
            selector: row => row.Weight,

        },
        {
            name: 'Unit',
            width: "200px",
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
            center: true,
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
            Description: stoneDetail.stoneDesc,
            StoneDesc: stoneDetail.stoneCode,
            BrightnessDesc: stoneDetail.brightCode,
            GradeDesc: stoneDetail.gradeCode,
            TypeDesc: stoneDetail.typeCode,
            Size: stoneDetail.size,
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
            <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="lg">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Stone Detail" : "Create Stone Detail"} handleClick={openModal} />
                    {
                        isEdit ? (
                            <form  className="flex flex-col p-3 gap-4">
                                <div className="grid grid-cols-4">
                                    <div>
                                        <Input label="Name" value={`${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`} readOnly/>
                                        {
                                            validationText.customerName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customerName}</p>
                                        }
                                    </div>
                                    {/* <div className="w-full col-span-2">
                                        <input placeholder="Stone Description" className="border border-blue-gray-200 w-full h-full p-2.5 rounded-md placeholder:text-blue-gray-500" {...register('detailsInfo.stoneDesc')} value={`${stoneDesc} ${brightDesc} ${typeDesc}`} onFocus={() => setIsAlert(false)} disabled />
                                    </div> */}
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Select 
                                        value={formData.stoneCode} 
                                        onChange={(e) => {
                                            setStoneDesc(e.target.selectedOptions[0].text); 
                                            setFormData({...formData, stoneCode: e.target.value});
                                        }}
                                    >
                                        <option value={editData.stoneCode} selected={true} disabled>{editData.stoneCode}</option>
                                        {
                                            stoneData?.map((stone) => {
                                                return <option value={stone.stoneCode} key={stone.stoneCode} >{stone.stoneDesc}</option>
                                            })
                                        }
                                    </Select>
                                    {/* <select {...register('detailsInfo.stoneCode')} className="block w-full p-2.5 border border-blue-gray-200 rounded-md focus:border-black" onChange={(e) => setStoneDesc(e.target.selectedOptions[0].text)}>
                                        <option value={editData.stoneCode} selected={true} disabled>{editData.stoneCode}</option>
                                        {
                                            stoneData?.map((stone) => {
                                                return <option value={stone.stoneCode} key={stone.stoneCode} >{stone.stoneDesc}</option>
                                            })
                                        }
                                    </select> */}
                                    <select {...register('detailsInfo.brightCode')} className="block w-full p-2.5 border border-blue-gray-200 rounded-md focus:border-black" onChange={(e) => setBrightDesc(e.target.selectedOptions[0].text)}>
                                        <option value={editData.brightCode} selected={true} disabled>{editData.brightCode}</option>
                                        {
                                            brightData?.map((bright) => {
                                                return <option value={bright.brightCode} key={bright.brightCode} >{bright.brightDesc}</option>
                                            })
                                        }
                                    </select>
                                    <select {...register('detailsInfo.typeCode')} className="block w-full p-2.5 border border-blue-gray-200 rounded-md focus:border-black" onChange={(e) => setTypeDesc(e.target.selectedOptions[0].text)}>
                                        <option value={editData.typeCode} selected={true} disabled>{editData.typeCode}</option>
                                        {
                                            typeData?.map((type) => {
                                                return <option value={type.typeCode} key={type.typeCode} >{type.typeDesc}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <select {...register('detailsInfo.gradeCode')} className="block w-full p-2.5 border border-blue-gray-200 rounded-md focus:border-black">
                                        <option value={editData.gradeCode} selected disabled>{editData.gradeCode}</option>
                                        {
                                            gradeData?.map((grade) => {
                                                return <option value={grade.gradeCode} key={grade.gradeCode} >{grade.gradeDesc}</option>
                                            })
                                        }
                                    </select>
                                    <div className="col-span-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="w-full">
                                                <input placeholder="size" className="border border-blue-gray-200 w-full h-full p-2.5 rounded-md placeholder:text-blue-gray-500" {...register('detailsInfo.size')} onFocus={() => setIsAlert(false)} />
                                            </div>
                                            <div>
                                                <input placeholder="Qty" className="border border-blue-gray-200 w-full h-full p-2.5 rounded-md placeholder:text-blue-gray-500" {...register('detailsInfo.qty')} onFocus={() => setIsAlert(false)} />
                                                
                                            </div>
                                            <div>
                                                <input placeholder="Weight" className="border border-blue-gray-200 w-full h-full p-2.5 rounded-md placeholder:text-blue-gray-500" {...register('detailsInfo.weight')} onFocus={() => setIsAlert(false)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <select {...register('detailsInfo.unitCode')} className="block w-full max-h-[2.5rem] p-2.5 border border-blue-gray-200 rounded-md focus:border-black">
                                        <option value={editData.unitCode} selected={true} disabled>{editData.unitCode}</option>
                                        {
                                            unitData?.map((unit) => {
                                                return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitDesc}</option>
                                            })
                                        }
                                    </select>
                                    <div className="col-span-2">
                                        <Textarea 
                                            label="Remark" 
                                            className="min-h-full" 
                                            rows={1}
                                            {...register('detailsInfo.remark')} 
                                        />
                                    </div>
                                </div>
                                {
                                    errors.stoneDesc && <Alert
                                    icon={<FaTriangleExclamation />}
                                    className="rounded-none border-l-4 border-red-800 bg-red-500/10 font-medium text-red-900"
                                >
                                    This field is required
                                </Alert>

                                }
                                <div className="flex items-center justify-end mt-6 gap-2">
                                    <Button onClick={handleSubmit(submitEdit)} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Update
                                        </Typography>
                                    </Button>
                                    {/* <Button onClick={handleSubmit(onSaveSubmit)} color="red" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaTrashCan className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Delete
                                        </Typography>
                                    </Button> */}
                                </div>
                            </form>
                        ) : (
                            <form  className="flex flex-col p-3 gap-4">
                                <div className="grid grid-cols-4">
                                    <div className="w-full col-span-2">
                                        <Input label="Name" value={`${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`} readOnly/>
                                        {
                                            validationText.customerName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customerName}</p>
                                        }
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Select 
                                        label="Stone Description"
                                        value={formData.stoneCode} 
                                        onChange={(e) => {
                                            //setStoneDesc(e.target.value); 
                                            setFormData({...formData, stoneCode: e.target.value});
                                        }}
                                    >
                                        <Option value={0} selected={true} disabled>Select Stone</Option>
                                        {
                                            stoneData?.map((stone) => {
                                                return <Option value={stone.Code} key={stone.stoneCode} >{stone.stoneDesc}</Option>
                                            })
                                        }
                                    </Select>
                                    <select {...register('detailsInfo.brightCode')} className="block w-full p-2.5 border border-blue-gray-200 rounded-md focus:border-black" onFocus={() => setIsAlert(false)} onChange={(e) => setBrightDesc(e.target.selectedOptions[0].text)}>
                                        <option value="" selected={true} disabled>Select Brightness</option>
                                        {
                                            brightData?.map((bright) => {
                                                return <option value={bright.brightCode} key={bright.brightCode} >{bright.brightDesc}</option>
                                            })
                                        }
                                    </select>
                                    <select {...register('detailsInfo.typeCode')} className="block w-full p-2.5 border border-blue-gray-200 rounded-md focus:border-black" onFocus={() => setIsAlert(false)} onChange={(e) => setTypeDesc(e.target.selectedOptions[0].text)}>
                                        <option value="" selected={true} disabled>Select Type</option>
                                        {
                                            typeData?.map((type) => {
                                                return <option value={type.typeCode} key={type.typeCode} >{type.typeDesc}</option>
                                            })
                                        }
                                    </select>
                                    
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <select {...register('detailsInfo.gradeCode')} className="block w-full p-2.5 border border-blue-gray-200 rounded-md focus:border-black" onFocus={() => setIsAlert(false)}>
                                        <option value="" selected={true} disabled>Select Grade</option>
                                        {
                                            gradeData?.map((grade) => {
                                                return <option value={grade.gradeCode} key={grade.gradeCode} >{grade.gradeDesc}</option>
                                            })
                                        }
                                    </select>
                                    <div className="col-span-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="w-full">
                                                <input placeholder="size" className="border border-blue-gray-200 w-full h-full p-2.5 rounded-md placeholder:text-blue-gray-500" {...register('detailsInfo.size')} onFocus={() => setIsAlert(false)} />
                                            </div>
                                            <div>
                                                <input placeholder="Qty" className="border border-blue-gray-200 w-full h-full p-2.5 rounded-md placeholder:text-blue-gray-500" {...register('detailsInfo.qty')} onFocus={() => setIsAlert(false)} />
                                                
                                            </div>
                                            <div>
                                                <input placeholder="Weight" className="border border-blue-gray-200 w-full h-full p-2.5 rounded-md placeholder:text-blue-gray-500" {...register('detailsInfo.weight')} onFocus={() => setIsAlert(false)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <select {...register('detailsInfo.unitCode')} className="block w-full max-h-[2.5rem] p-2.5 border border-blue-gray-200 rounded-md focus:border-black" onFocus={() => setIsAlert(false)}>
                                        <option value="" selected={true} disabled>Select Unit</option>
                                        {
                                            unitData?.map((unit) => {
                                                return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitDesc}</option>
                                            })
                                        }
                                    </select>
                                    <div className="col-span-2">
                                        <Textarea 
                                            label="Remark" 
                                            className="min-h-full" 
                                            rows={1} 
                                            onFocus={() => setIsAlert(false)} 
                                            {...register('detailsInfo.remark')} 
                                        />
                                    </div>
                                </div>
                                
                                {
                                    addResult.isSuccess && isAlert && <SuccessAlert message="Save successful." handleAlert={() => setIsAlert(false)} />
                                }
                                <div className="flex items-center justify-end mt-6 gap-2">
                                    <Button onClick={handleSubmit(onSubmit)} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save
                                        </Typography>
                                    </Button>
                                    <Button onClick={handleSubmit(onSaveSubmit)} color="green" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaCirclePlus className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save & New
                                        </Typography>
                                    </Button>
                                </div>
                            </form>
                        )
                    }

                </DialogBody>
            </Dialog>
            <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
        </div>

        </>
    );

}

export default StoneDetails;
