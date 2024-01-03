/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAddBrightnessMutation, useFetchBrightnessQuery, useRemoveBrightnessMutation, useUpdateBrightnessMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";

const validator = require("validator");

function Brightness() {

    const auth = useAuthUser();

    console.log(auth().username)

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [ validationText, setValidationText ] = useState({});

    const {data} = useFetchBrightnessQuery();

    const [formData, setFormData] = useState({
        brightDesc: "",
        status: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
        updatedAt: moment().toISOString(),
        updatedBy: "",
    });

    const [addBrightness, addResult] = useAddBrightnessMutation();

    const [editBrightness] = useUpdateBrightnessMutation();

    const [removeBrightness] = useRemoveBrightnessMutation();

    useEffect(() => {
        setFormData({
            brightDesc: "",
            status: true,
            createdAt: moment().toISOString(),
            createdBy: auth().username,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        });
    }, [addResult.isSuccess]);

    const [deleteId, setDeleteId] = useState('');

    const resetData = () => {
        setFormData({
            brightDesc: "",
            status: true,
            createdAt: moment().toISOString(),
            createdBy: auth().username,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        });
    };

    const handleChange = async (e) => {
        let bright = data.filter((bright) => bright.brightCode == e.target.id);
        await editBrightness({
            brightCode: bright[0].brightCode,
            brightDesc: bright[0].brightDesc,
            status: e.target.checked ? true: false,
            createdAt: bright[0].createdAt,
            createdBy: bright[0].createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        }).then((res) => {
            console.log(res);
        });

    };

    const openModal = () => {
        setIsEdit(false);
        resetData();
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};
        if(validator.isEmpty(formData.brightDesc.toString())) {
            newErrors.brightDesc = 'Description is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addBrightness(formData).then((res) => {
                console.log(res);
            });
            setOpen(!open);
            resetData();
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            addBrightness(formData).then((res) => {
                console.log(res);
            });
            resetData();
        }
    };

    const handleEdit = async (id) => {
        let eData = data.filter((bright) => bright.brightCode === id);
        setIsEdit(true);
        setFormData(eData[0]);
        setOpen(!open);
    };

    const submitEdit = async (brightData) => {
        editBrightness({
            ...formData,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });
        setOpen(!open);
    };

    const handleRemove = async (id) => {
        removeBrightness(id).then((res) => {console.log(res)});
        setOpenDelete(!openDelete);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    }

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
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="border-r border-gray-400 pr-2">
                        <Switch color="deep-purple" defaultChecked={row.Status} id={row.Code} onChange={handleChange} />
                    </div>
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((bright) => {
        return {
            Code: bright.brightCode,
            Description: bright.brightDesc,
            CreatedAt: moment(bright.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: bright.createdBy,
            UpdatedAt: moment(bright.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: bright.updatedBy,
            Status: bright.status,
        }
    });

    return(
        <div className="flex flex-col gap-4 px-2 relative">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {/* {
                    addResult.isSuccess && isAlert && <SuccessAlert message="Save successful." handleAlert={() => setIsAlert(false)} />
                }
                {
                    editResult.isSuccess && isAlert && <SuccessAlert message="Update successful." handleAlert={() => setIsAlert(false)} />
                }
                {
                    removeResult.isSuccess && isAlert && <SuccessAlert message="Delete successful." handleAlert={() => setIsAlert(false)} />
                } */}
            </div>
            <SectionTitle title="Stone Brightness" handleModal={openModal} />
            <Card className="h-auto shadow-md w-[1000px] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Stone Brightness" : "Stone Brightness"} handleClick={openModal} />
                    {/* {
                        addResult.isSuccess && isAlert && <SuccessAlert message="Save successful." handleAlert={() => setIsAlert(false)} />
                    } */}
                    {
                        isEdit ? (
                            <form  className="flex flex-col items-end p-3">
                                {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                                <Input label="Description" value={formData.brightDesc} onChange={(e) => setFormData({...formData, brightDesc: e.target.value})} />
                                {
                                    validationText.brightDesc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.brightDesc}</p>
                                }

                                <div className="flex items-center justify-end mt-6 gap-2">
                                    <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" /> 
                                        <Typography variant="small" className="capitalize">
                                            Update
                                        </Typography>
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form  className="flex flex-col items-end p-3">
                                {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                                <Input label="Description" value={formData.brightDesc} onChange={(e) => setFormData({...formData, brightDesc: e.target.value})} />
                                {
                                    validationText.brightDesc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.brightDesc}</p>
                                }
                                <div className="flex items-center justify-end mt-6 gap-2">
                                    <Button onClick={onSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" /> 
                                        <Typography variant="small" className="capitalize">
                                            Save
                                        </Typography>
                                    </Button>
                                    <Button onClick={onSaveSubmit} color="deep-purple" size="sm" variant="outlined" className="flex items-center gap-2">
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

export default Brightness;