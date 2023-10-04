/* eslint-disable eqeqeq */
import { Alert, Button, Card, CardBody, Dialog, DialogBody, Input, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";
import { useState } from "react";
import { useFetchUOMQuery, useAddUOMMutation, useUpdateUOMMutation, useRemoveUOMMutation } from "../store";
import { useForm } from "react-hook-form";
import { pause, currentDate } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";

function UOM() {

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const [isEdit, setIsEdit] = useState(false);

    const [editData, setEditData] = useState({});

    const {data} = useFetchUOMQuery();

    const {register, handleSubmit, setValue, formState: {errors}, reset } = useForm({
        defaultValues:{
            unitInfo: {
                unitCode: "",
                unitDesc: ""
            }
        }
    });

    const [addUnit, addResult] = useAddUOMMutation();

    const [editUnit, editResult] = useUpdateUOMMutation();

    const [removeUnit, removeResult] = useRemoveUOMMutation();

    const [deleteId, setDeleteId] = useState('');

    // const handleChange = async (e) => {
        
    //     let unit = data.filter((unit) => unit.unitCode == e.target.id);
    //     await editUnit({
    //         unitCode: unit[0].unitCode,
    //         unitDesc: unit[0].unitDesc,
    //         status: e.target.checked ? true: false,
    //         createdAt: unit[0].createdAt,
    //         createdBy: unit[0].createdBy,
    //         updatedAt: currentDate,
    //         updatedBy: "Hello World",
    //     }).then((res) => {
    //         console.log(res);
    //     });

    // };

    const openModal = () => {
        setIsEdit(false);
        setValue("unitInfo", {
            unitCode: "",
            unitDesc: ""
        });
        setOpen(!open);
    };

    const onSubmit = async (unitData) => {
        console.log(unitData.unitInfo);
        let subData = {
            ...unitData.unitInfo,
            status: true,
            createdAt: currentDate,
            createdBy: 'Htet Wai Aung',
            updatedAt: currentDate,
        }
        addUnit(subData).then((res) => {
            reset({
                unitCode: "",
                unitDesc: "",
            });
            console.log(res);
        });
        setIsAlert(true);
        setOpen(!open);
        await pause(2000);
        setIsAlert(false);
    };

    const onSaveSubmit = (unitData) => {
        let subData = {
            ...unitData.unitInfo,
            status: true,
            createdAt: currentDate,
            createdBy: 'Htet Wai Aung',
            updatedAt: currentDate,
        }
        addUnit(subData).then((res) => {
            reset({
                unitCode: "",
                unitDesc: "",
            });
            console.log(res);
        });
        setIsAlert(true);
    };

    const handleEdit = async (id) => {
        let eData = data.filter((unit) => unit.unitCode === id);
        setEditData(eData[0]);
        setIsEdit(true);
        setValue("unitInfo", {
            unitCode: eData[0].unitCode,
            unitDesc: eData[0].unitDesc
        });
        setOpen(!open);
    };

    const submitEdit = async (unitData) => {
        editUnit({
            unitCode: unitData.unitInfo.unitCode,
            unitDesc: unitData.unitInfo.unitDesc,
            status: editData.status,
            createdAt: editData.createdAt,
            createdBy: editData.createdBy,
            updatedAt: currentDate,
            updatedBy: "Hello World",
        }).then((res) => {
            console.log(res);
        });
        setIsAlert(true);
        setOpen(!open);
        await pause(2000);
        setIsAlert(false);
    };

    const handleRemove = async (id) => {
        removeUnit(id).then((res) => {console.log(res)});
        setIsAlert(true);
        setOpenDelete(!openDelete);
        await pause(2000);
        setIsAlert(false);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    }

    const column = [
        {
            name: 'Code',
            sortable: true,
            selector: row => row.Code,
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
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <div className="border-r border-gray-400 pr-2">
                        <Switch color="deep-purple" defaultChecked={row.Status === true ? true : false} id={row.Code} onChange={handleChange} />
                    </div> */}
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
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
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    addResult.isSuccess && isAlert && <SuccessAlert message="Save successful." handleAlert={() => setIsAlert(false)} />
                }
                {
                    editResult.isSuccess && isAlert && <SuccessAlert message="Update successful." handleAlert={() => setIsAlert(false)} />
                }
                {
                    removeResult.isSuccess && isAlert && <SuccessAlert message="Delete successful." handleAlert={() => setIsAlert(false)} />
                }
            </div>
            <SectionTitle title="Unit of Measurement" handleModal={openModal} />
            <Card className="h-auto shadow-md w-[1000px] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Unit" : "Unit of Measurement"} handleClick={openModal} />
                    {
                        addResult.isSuccess && isAlert && <SuccessAlert message="Save successful." handleAlert={() => setIsAlert(false)} />
                    }
                    {
                        isEdit ? (
                            <form  className="flex flex-col items-end p-3">
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <Input label="Code" {...register('unitInfo.unitCode')} />
                                    <Input label="Description" {...register('unitInfo.unitDesc')} />
                                </div>
                                {
                                    errors.unitDesc && <Alert
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
                                    <Button onClick={handleSubmit(onSaveSubmit)} color="red" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaTrashCan className="text-base" /> 
                                        <Typography variant="small" className="capitalize">
                                            Delete
                                        </Typography>
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form  className="flex flex-col items-end p-3">
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <Input label="Code" onFocus={() => setIsAlert(false)} {...register('unitInfo.unitCode')} />
                                    <Input label="Description" onFocus={() => setIsAlert(false)} {...register('unitInfo.unitDesc')} />
                                </div>
                                {
                                    errors.unitDesc && <Alert
                                    icon={<FaTriangleExclamation />}
                                    className="rounded-none border-l-4 border-red-800 bg-red-500/10 font-medium text-red-900"
                                >
                                    This field is required
                                </Alert>
                                
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
    );

}

export default UOM;