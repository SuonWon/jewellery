/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { useFetchGradeQuery, useAddGradeMutation, useUpdateGradeMutation, useRemoveGradeMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment/moment";
import TableList from "../components/data_table";

const validator = require('validator');

function Grade() {

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const {data} = useFetchGradeQuery();

    const [ grade, setGrade ] = useState({
        gradeCode: 0,
        gradeDesc: '',
        status: true,
        createdAt: moment().toISOString(),
        createdBy: 'admin'
    })

    const [addGrade] = useAddGradeMutation();

    const [editGrade] = useUpdateGradeMutation();

    const [removeGrade] = useRemoveGradeMutation();

    const [deleteId, setDeleteId] = useState('');

    const [validationText, setValidationText] = useState({});

    const openModal = () => {
        setIsEdit(false);
        setGrade({ 
            gradeCode: 0,
            gradeDesc: '',
            status: true,
            createdAt: moment().toISOString(),
            createdBy: 'admin'
        })
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        if(validator.isEmpty(grade.gradeDesc)) {
            newErrors.desc = 'Description is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(isNew = true) {
        if(validateForm()) {
            const saveData = {
                gradeDesc: grade.gradeDesc,
                status: grade.status,
                createdAt: grade.createdAt,
                createdBy: grade.createdBy,
                updatedAt: moment().toISOString(),
                updatedBy: isEdit ? "admin" : "",

            }

            if(isEdit) {
                saveData.gradeCode = grade.gradeCode
            }

            isEdit ? await editGrade(saveData) : await addGrade(saveData);

            setOpen(isNew);

            setGrade({ 
                gradeCode: 0,
                gradeDesc: '',
                status: true,
                createdAt: moment().toISOString(),
                createdBy: 'admin'
            })
        }
    }

    async function changeStatus(isChecked, id) {
        const focusData = data.find(rec => rec.gradeCode == id);
        const saveData = {
            ...focusData,
            status: isChecked,
            updatedAt: moment().toISOString(),
            updatedBy: 'admin'
        }
        await editGrade(saveData);
    }

    function handleEdit(id) {
        const focusData = data.find(rec => rec.gradeCode == id);
        setGrade(focusData);
        setOpen(true);
        setIsEdit(true);
    }

    const handleDelete = async () => {
        await removeGrade(deleteId);
        setOpenDelete(!openDelete);
    }

    const column = [
        {
            name: 'Status',
            width: "150px",
            fixed: "left",
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

    const tbodyData = data?.map((grade) => {
        return {
            Code: grade.gradeCode,
            Description: grade.gradeDesc,
            CreatedAt: moment(grade.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: grade.createdBy,
            UpdatedAt: moment(grade.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: grade.updatedBy,
            Status: grade.status,
        }
    });

    return(
        <div className="flex flex-col gap-4 px-2 relative">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
            </div>
            <SectionTitle title="Stone Grade" handleModal={openModal} />
            <Card className="h-auto shadow-md w-[1000px] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Stone Grade" : "Stone Grade"} handleClick={openModal} />
                
                            <div  className="flex flex-col items-end p-3">
                                <Input 
                                    label="Description" 
                                    value={grade.gradeDesc}
                                    onChange={(e) => {
                                        setGrade({
                                            ...grade,
                                            gradeDesc: e.target.value
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
                                            {isEdit ? 'Update' : 'Save'}
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

export default Grade;