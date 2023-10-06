/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useFetchStoneDetailsQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation, useFetchUOMQuery, useFetchTrueBrightnessQuery, useFetchTrueStoneQuery, useFetchTrueGradeQuery, useFetchTrueTypeQuery } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
const validator = require("validator");

function StoneDetails() {

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);


    const {data} = useFetchStoneDetailsQuery();

    const {data: stoneData} = useFetchTrueStoneQuery();

    const {data: gradeData} = useFetchTrueGradeQuery();

    const {data: typeData} = useFetchTrueTypeQuery();

    const {data: unitData} = useFetchUOMQuery();

    const {data: brightData} = useFetchTrueBrightnessQuery();

    const stoneOption = stoneData?.map((stone) => {
        return {value: stone.stoneCode, label: stone.stoneDesc}
    });

    const typeOption = typeData?.map((type) => {
        return {value: type.typeCode, label: type.typeDesc}
    });

    const gradeOption = gradeData?.map((grade) => {
        return {value: grade.gradeCode, label: grade.gradeDesc}
    });

    const brightOption = brightData?.map((bright) => {
        return {value: bright.brightCode, label: bright.brightDesc}
    });

    const unitOption = unitData?.map((unit) => {
        return {value: unit.unitCode, label: unit.unitDesc}
    });

    const [description, setDescription] = useState({
        stoneDesc: "",
        brightDesc: "",
        typeDesc: ""
    });

    const [addStoneDetail, addResult] = useAddStoneDetailsMutation();

    const [editStoneDetail] = useUpdateStoneDetailsMutation();

    const [removeStoneDetail] = useRemoveStoneDetailsMutation();

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    const stoneDetail = {
        stoneDesc: "",
        stone: "",
        stoneCode: "",
        type: "",
        typeCode: "",
        bright: "",
        brightCode: "",
        grade: "",
        gradeCode: "",
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
    };

    useEffect(() => {
        setFormData(stoneDetail);
    }, [addResult.isSuccess]);

    const [formData, setFormData] = useState(stoneDetail);

    const openModal = () => {
        setIsEdit(false);
        setFormData(stoneDetail);
        setDescription({
            stoneDesc: "",
            brightDesc: "",
            typeDesc: ""
        })
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if(validator.isEmpty(formData.stoneCode.toString())) {
            newErrors.stoneDesc = 'Stone Description is required.'
        } 
        if(validator.isEmpty(formData.brightCode.toString())) {
            newErrors.brightDesc = 'Bright Description is required.'
        }
        if(validator.isEmpty(formData.gradeCode.toString())) {
            newErrors.gradeDesc = 'Grade Description is required.'
        }
        if(validator.isEmpty(formData.typeCode.toString())) {
            newErrors.typeDesc = 'Type Description is required.'
        }
        if(validator.isEmpty(formData.unitCode.toString())) {
            newErrors.unitDesc = 'Unit is required.'
        }
        if(validator.isEmpty(formData.size.toString())) {
            newErrors.size = 'Size is required.'
        }
        if(formData.qty === 0) {
            newErrors.qty = 'Quantity is required.'
        }
        if(formData.weight === 0) {
            newErrors.weight = 'Weight is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addStoneDetail({
                ...formData,
                stoneDesc: `${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`,
            }).then((res) => {
                console.log(res);
            });
            setOpen(!open);
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            addStoneDetail({
                ...formData,
                stoneDesc: `${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`,
            }).then((res) => {
                console.log(res);
            });
        }
    };

    const handleEdit = async (id) => {
        let eData = data.filter((stoneDetail) => stoneDetail.stoneDetailCode === id);
        setIsEdit(true);
        setFormData({
            ...formData,
            stoneDetailCode: eData[0].stoneDetailCode,
            stoneDesc: eData[0].stoneDesc,
            stone: eData[0].stone.stoneDesc,
            stoneCode: eData[0].stone.stoneCode,
            type: eData[0].stoneType.typeDesc,
            typeCode: eData[0].stoneType.typeCode,
            bright: eData[0].stoneBrightness.brightDesc,
            brightCode: eData[0].stoneBrightness.brightCode,
            grade: eData[0].stoneGrade.gradeDesc,
            gradeCode: eData[0].stoneGrade.gradeCode,
            size: eData[0].size,
            qty: eData[0].qty,
            weight: eData[0].weight,
            unitCode: eData[0].unitCode,
            remark: eData[0].remark,
            isActive: eData[0].isActive,
            createdAt: eData[0].createdAt,
            createdBy: eData[0].createdBy,
        });
        setDescription({
            stoneDesc: eData[0].stone.stoneDesc,
            brightDesc: eData[0].stoneBrightness.brightDesc,
            typeDesc: eData[0].stoneType.typeDesc
        });
        setOpen(!open);
    };

    const submitEdit = async () => {
        editStoneDetail({
            ...formData,
            stoneDesc: `${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });
        setOpen(!open);
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
            name: 'Description',
            width: '250px',
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
            StoneDesc: stoneDetail.stone.stoneDesc,
            BrightnessDesc: stoneDetail.stoneBrightness.brightDesc,
            GradeDesc: stoneDetail.stoneGrade.gradeDesc,
            TypeDesc: stoneDetail.stoneType.typeDesc,
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
                    <form  className="flex flex-col p-3 gap-4">
                        <div className="grid grid-cols-4">
                            <div className="w-full col-span-2">
                                <label className="text-black">Description</label>
                                <input className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-md" value={`${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`} disabled />
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
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <div>
                                <label className="text-black">Stone Description</label>
                                <Select 
                                    options={stoneOption} 
                                    isSearchable
                                    defaultValue={{value: formData.stoneCode, label: formData.stone === ""? "Select..." : formData.stone}}
                                    onChange={(e) => {
                                        setDescription({...description, stoneDesc: e.label}); 
                                        setFormData({...formData, stoneCode: Number(e.value)});
                                    }}
                                />
                                {
                                    validationText.stoneDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.stoneDesc}</p>
                                }
                            </div>
                            <div>
                                <label className="text-black">Brightness</label>
                                <Select 
                                    options={brightOption} 
                                    isSearchable
                                    defaultValue={{value: formData.brightCode, label: formData.stone === ""? "Select..." : formData.bright}}
                                    onChange={(e) => {
                                        setDescription({...description, brightDesc: e.label}); 
                                        setFormData({...formData, brightCode: Number(e.value)});
                                    }}
                                />
                                {
                                    validationText.brightDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.brightDesc}</p>
                                }
                            </div>
                            <div>
                                <label className="text-black">Type</label>
                                <Select 
                                    options={typeOption} 
                                    isSearchable
                                    defaultValue={{value: formData.typeCode, label: formData.type === ""? "Select..." : formData.type}}
                                    onChange={(e) => {
                                        setDescription({...description, typeDesc: e.label}); 
                                        setFormData({...formData, typeCode: Number(e.value)});
                                    }}
                                />
                                {
                                    validationText.typeDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.typeDesc}</p>
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <div>
                                <label className="text-black">Grade</label>
                                <Select 
                                    options={gradeOption} 
                                    isSearchable
                                    defaultValue={{value: formData.gradeCode, label: formData.grade === ""? "Select..." : formData.grade}}
                                    onChange={(e) => {
                                        setFormData({...formData, gradeCode: Number(e.value)});
                                    }}
                                />
                                {
                                    validationText.gradeDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.gradeDesc}</p>
                                }
                            </div>
                            <div className="col-span-2">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="w-full">
                                        <label className="text-black">Size</label>
                                        <input type="text" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} />
                                        {
                                            validationText.size && <p className="block text-[12px] text-red-500 font-sans">{validationText.size}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="text-black">Qty</label>
                                        <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} />
                                        {
                                            validationText.qty && <p className="block text-[12px] text-red-500 font-sans">{validationText.qty}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="text-black">Weight</label>
                                        <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                                        {
                                            validationText.weight && <p className="block text-[12px] text-red-500 font-sans">{validationText.weight}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <div>
                                <label className="text-black">Unit</label>
                                <Select 
                                    options={unitOption} 
                                    isSearchable
                                    defaultValue={{value: formData.unitCode, label: formData.unitCode}}
                                    onChange={(e) => {
                                        setFormData({...formData, unitCode: e.value});
                                    }}
                                />
                                {
                                    validationText.unitDesc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.unitDesc}</p>
                                }
                            </div>
                            <div className="col-span-2">
                                <label className="text-black">Remark</label>
                                <Textarea 
                                    labelProps={{
                                        className: "hidden"
                                    }}
                                    className="min-h-full !border !border-blue-gray-200 focus:border-2 focus:!border-gray-900 focus:!border-t-gray-900" 
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
