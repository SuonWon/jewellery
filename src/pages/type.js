/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { useFetchTypeQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";

const validator = require('validator');

function StoneType() {

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const {data} = useFetchTypeQuery();

    const [ stoneType, setStoneType ] = useState({
        typeCode: 0,
        typeDesc: '',
        status: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
    })

    const [addType] = useAddTypeMutation();

    const [editType] = useUpdateTypeMutation();

    const [removeType] = useRemoveTypeMutation();

    const [deleteId, setDeleteId] = useState('');

    const [validationText, setValidationText] = useState({});

    const openModal = () => {
        setIsEdit(false);
        setStoneType({
            typeCode: 0,
            typeDesc: '',
            status: true,
            createdAt: moment().toISOString(),
            createdBy: auth().username,
        })
        setValidationText({});
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if(validator.isEmpty(stoneType.typeDesc)) {
            newErrors.desc = 'Description is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(isNew = true) {
        if(validateForm()) {            
            const saveData = {
                typeDesc: stoneType.typeDesc,
                status: stoneType.status,
                createdAt: stoneType.createdAt,
                createdBy: stoneType.createdBy,
                updatedAt: moment().toISOString(),
                updatedBy: isEdit ? auth().username : "",
            }

            if(isEdit) {
                saveData.typeCode= stoneType.typeCode
            }

            isEdit ? await editType(saveData) : await addType(saveData);

            setOpen(isNew);

            setStoneType({
                typeCode: 0,
                typeDesc: '',
                status: true,
                createdAt: moment().toISOString(),
                createdBy: auth().username,
            })
        }
    }

    async function changeStatus(isChecked, id) {
        const focusData = data.find(rec => rec.typeCode == id);
        const saveData = {
            ...focusData,
            status: isChecked,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username
        }
        await editType(saveData);
    }

    function handleEdit(id) {
        const focusData = data.find(rec => rec.typeCode == id);
        setStoneType(focusData);
        setOpen(true);
        setIsEdit(true);
    }

    async function handleDelete() {
        await removeType(deleteId);
        setOpenDelete(!openDelete);
    }

    const column = [
        {
            name: 'Status',
            width: "150px",
            center: true,
            cell: row => (
                <div className={`w-[90px] flex items-center justify-center text-white h-7 rounded-full ${row.Status ? 'bg-green-500' : 'bg-red-500' } `}>
                    {
                        row.Status ? 'Active' : 'Inactive'
                    }
                </div>
            ),
        },
        {
            name: 'Description',
            sortable: true,
            selector: row => row.Description,
        },
        {
            name: 'Created At',
            width: "200px",
            selector: row => row.CreatedAt,
            sortable: true
        },
        {
            name: 'Updated At',
            width: "200px",
            selector: row => row.UpdatedAt,
            sortable: true
        },
        {
            name: 'Action',
            center: true,
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="border-r border-gray-400 pr-2">
                        <Switch color="deep-purple" defaultChecked={row.Status} id={row.Code} onChange={(e) => changeStatus(e.target.checked, row.Code)} />
                    </div>
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => {
                        setDeleteId(row.Code);
                        setOpenDelete(true);
                    }}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((type) => {
        return {
            Code: type.typeCode,
            Description: type.typeDesc,
            CreatedAt: moment(type.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: type.createdBy,
            UpdatedAt: moment(type.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: type.updatedBy,
            Status: type.status,
        }
    });

    return(
        <div className="flex flex-col gap-4 px-2 relative">
            
            <SectionTitle title="Stone Type" handleModal={openModal} />
            <Card className="h-auto shadow-md w-[1000px] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Stone Type" : "Stone Type"} handleClick={openModal} />
                
                        <div  className="flex flex-col items-end p-3">
                            {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                            <Input 
                            label="Description" 
                                value={stoneType.typeDesc}
                                onChange={(e) => {
                                    setStoneType({
                                        ...stoneType,
                                        typeDesc: e.target.value
                                    })
                                }}
                            />
                            {
                                validationText.desc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.desc}</p>
                            }
                            
                            <div className="flex items-center justify-end mt-6 gap-2">
                                <Button onClick={() => handleSubmit(false)} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                    <FaFloppyDisk className="text-base" /> 
                                    <Typography variant="small" className="capitalize">
                                        { isEdit ? 'Update' : 'Save' }
                                    </Typography>
                                </Button>
                                {
                                    !isEdit ? (
                                        <Button onClick={handleSubmit} color="green" size="sm" variant="gradient" className="flex items-center gap-2">
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

export default StoneType;