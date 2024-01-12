/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Typography, } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { useFetchUOMQuery, useAddUOMMutation, useUpdateUOMMutation, useRemoveUOMMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";

const validator = require('validator');

function UOM() {

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const {data} = useFetchUOMQuery();

    const [ unitData, setUnitData ] = useState({
        unitCode: '',
        unitDesc: '',
        createdAt: moment().toISOString(),
        createdBy: auth().username,
    })

    const [addUnit] = useAddUOMMutation();

    const [editUnit] = useUpdateUOMMutation();

    const [removeUnit] = useRemoveUOMMutation();

    const [deleteId, setDeleteId] = useState('');

    const [validationText, setValidationText] = useState({});

    const openModal = () => {
        setIsEdit(false);
        setOpen(!open);
        setUnitData({
            unitCode: '',
            unitDesc: '',
            createdAt: moment().toISOString(),
            createdBy: auth().username,
        });
        setValidationText({});
    };

    function validateForm() {
        const newErrors = {};

        if(validator.isEmpty(unitData.unitCode)) {
            newErrors.code = 'Unit code is required.'
        }
        if(validator.isEmpty(unitData.unitDesc)) {
            newErrors.desc = 'Unit description is required.'
        }

        console.log(newErrors);

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(isNew = true) {

        if(validateForm()) {
            const saveData = {
                unitCode: unitData.unitCode,
                unitDesc: unitData.unitDesc,
                createdAt: unitData.createdAt,
                createdBy: unitData.createdBy,
                updatedAt: moment().toISOString(),
                updatedBy: isEdit ? auth().username : "",
            }
    
            isEdit ?  await editUnit(saveData) : await addUnit(saveData);
    
            setOpen(isNew);
    
            setUnitData({
                unitCode: '',
                unitDesc: '',
                createdAt: moment().toISOString(),
                createdBy: auth().username,
            })
        }
    }

    function handleEdit(id) {
        const focusData = data.find(rec => rec.unitCode === id);
        setUnitData(focusData);
        setOpen(true);
        setIsEdit(true);
    }

    async function handleDelete() {
        await removeUnit(deleteId);
        setOpenDelete(!openDelete);
    }

    const column = [
        {
            name: 'Code',
            selector: row => row.Code,
        },
        {
            name: 'Description',
            selector: row => row.Description,
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
                    <Button variant="text" color="red" className="p-2" onClick={() => {
                        setDeleteId(row.Code);
                        setOpenDelete(true);
                    }}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((unit) => {
        return {
            Code: unit.unitCode,
            Description: unit.unitDesc,
            CreatedAt: moment(unit.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: unit.createdBy,
            UpdatedAt: moment(unit.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: unit.updatedBy,
        }
    });

    return(
        <div className="flex flex-col gap-4 px-2 relative">
            <SectionTitle title="Unit of Measurement" handleModal={openModal} />
            <Card className="h-auto shadow-md w-[1000px] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Unit" : "Unit of Measurement"} handleClick={openModal} />
            
                    <div  className="flex flex-col items-end p-3">
                        <div className="grid grid-cols-2 gap-2 w-full">
                            {/* Code */}
                            <div>
                                <label className="text-black text-sm mb-2">Code</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={unitData.unitCode}
                                    onChange={(e) => {
                                        setUnitData({
                                            ...unitData, 
                                            unitCode: e.target.value,
                                        });
                                    }}
                                    readOnly={isEdit}
                                />
                                {
                                    validationText.code && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.code}</p>
                                }
                            </div>
                            {/* Code */}
                            <div>
                                <label className="text-black text-sm mb-2">Description</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={unitData.unitDesc}
                                    onChange={(e) => {
                                        setUnitData({
                                            ...unitData, 
                                            unitDesc: e.target.value,
                                        });
                                    }}
                                />
                                {
                                    validationText.desc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.desc}</p>
                                }
                            </div>
                        </div>
                            <div className="flex items-center justify-end mt-6 gap-2">
                            <Button onClick={() => handleSubmit(false)} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                <FaFloppyDisk className="text-base" />
                                <Typography variant="small" className="capitalize">
                                    { isEdit ? 'Update' : 'Save'}
                                </Typography>
                            </Button>
                            {
                                !isEdit ? (
                                    <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="outlined" className="flex items-center gap-2">
                                        <FaCirclePlus className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save & New
                                        </Typography>
                                    </Button>
                                ) : null
                            }
                        </div>
                    </div>

                </DialogBody>
            </Dialog>
            <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleDelete} closeModal={() => setOpenDelete(!openDelete)} />
        </div>
    );

}

export default UOM;