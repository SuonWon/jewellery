/* eslint-disable eqeqeq */
import { Alert, Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";
import { useState } from "react";
import { useFetchStoneQuery, useAddStoneMutation, useUpdateStoneMutation, useRemoveStoneMutation } from "../store";
import { useForm } from "react-hook-form";
import { pause, currentDate } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";

function Stone() {

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const {data} = useFetchStoneQuery();

    const [ stone, setStone ] = useState({
        stoneCode: 0,
        stoneDesc: '',
        remark: '',
        status: true,
        createdAt: currentDate,
        createdBy: 'admin',
    })

    const [addStone, addResult] = useAddStoneMutation();

    const [editStone, editResult] = useUpdateStoneMutation();

    const [removeStone, removeResult] = useRemoveStoneMutation();

    const [deleteId, setDeleteId] = useState('');

    const openModal = () => {
        setIsEdit(false);
        setStone({
            stoneCode: 0,
            stoneDesc: "",
            remark: "",
            status: true,
            createdAt: currentDate,
            createdBy: 'admin',
        })
        setOpen(!open);
    };

    async function handleSubmit(isNew = true) {
        const saveData = {
            stoneDesc: stone.stoneDesc,
            status: stone.status,
            remark: stone.remark,
            createdAt: stone.createdAt,
            createdBy: stone.createdBy,
            updatedAt: currentDate,
            updatedBy: isEdit ? "admin" : "",
        }

        if(isEdit) {
            saveData.stoneCode = stone.stoneCode
        }

        isEdit ? await editStone(saveData) : await addStone(saveData);

        setOpen(isNew);

        setStone({
            stoneCode: 0,
            stoneDesc: "",
            remark: "",
            status: true,
            createdAt: currentDate,
            createdBy: 'admin',
        })
    }

    async function changeStatus(isChecked, id) {
        const focusData = data.find(rec => rec.stoneCode === id);
        const saveData= {
            ...focusData,
            status: isChecked, 
            updatedAt: currentDate,
            updatedBy: "admin"
        }
        await editStone(saveData);
    }

    function handleEdit(id) {
        const focusData = data.find(rec => rec.stoneCode == id);
        setStone(focusData);
        setOpen(true);
        setIsEdit(true);
    }

    async function handleDelete() {
        await removeStone(deleteId);
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
            width: "200px",
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
            name: 'Remark',
            width: "200px",
            selector: row => row.Remark,
        },
        {
            name: 'Action',
            fixed: 'right',
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

    const tbodyData = data?.map((stone) => {
        return {
            Code: stone.stoneCode,
            Description: stone.stoneDesc,
            CreatedAt: moment(stone.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: stone.createdBy,
            UpdatedAt: moment(stone.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: stone.updatedBy,
            Remark: stone.remark,
            Status: stone.status,
        }
    });

    return(
        <div className="flex flex-col gap-4 px-2 relative">
            <SectionTitle title="Stone" handleModal={openModal} />
            <Card className="h-auto shadow-md w-[1000px] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Stone" : "Stone"} handleClick={openModal} />

                    <div  className="flex flex-col items-end p-3 gap-4">
                        {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                        <Input 
                            label="Description" 
                            value={stone.stoneDesc}
                            onChange={(e) => {
                                setStone({
                                    ...stone,
                                    stoneDesc: e.target.value
                                })
                            }} 
                        />
                        <Textarea 
                            label="Remark" rows={2} 
                            value={stone.remark}
                            onChange={(e) => {
                                setStone({
                                    ...stone,
                                    remark: e.target.value
                                })
                            }} 
                        />
                       
                        <div className="flex items-center justify-end mt-6 gap-2">
                            <Button onClick={() => handleSubmit(false)} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                <FaFloppyDisk className="text-base" /> 
                                <Typography variant="small" className="capitalize">
                                    { isEdit ? 'Update' : 'Save'}
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

export default Stone;