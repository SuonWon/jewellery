/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan } from "react-icons/fa6";
import { useState } from "react";
import { useAddShareMutation, useFetchShareQuery, useRemoveShareMutation, useUpdateShareMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
const validator = require("validator");

function Share() {

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const {data} = useFetchShareQuery();

    const [addShare, addResult] = useAddShareMutation();

    const [editShare] = useUpdateShareMutation();

    const [removeShare] = useRemoveShareMutation();

    const [deleteId, setDeleteId] = useState('');

    const auth = useAuthUser();

    const [ validationText, setValidationText ] = useState({});

    const shareInfo = {
        shareName: "",
        nrcNo: "",
        contactNo: "",
        street: "",
        township: "",
        city: "",
        region: "",
        remark: "",
        isActive: true,
        createdBy: auth().username,
        updatedBy: "",
    }

    const [formData, setFormData] = useState(shareInfo);

    const handleChange = async (e) => {
        
        let share = data.filter((share) => share.shareCode == e.target.id);
        await editShare({
            shareCode: share[0].shareCode,
            shareName: share[0].shareName,
            nrcNo: share[0].nrcNo,
            contactNo: share[0].contactNo,
            street: share[0].street,
            township: share[0].township,
            city: share[0].city,
            region: share[0].region,
            remark: share[0].remark,
            isActive: e.target.checked ? true: false,
            createdAt: share[0].createdAt,
            createdBy: share[0].createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });

    };

    const openModal = () => {
        setIsEdit(false);
        setFormData(shareInfo);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};
        if(validator.isEmpty(formData.shareName.toString())) {
            newErrors.shareName = 'Share name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addShare(formData).then((res) => {
                console.log(res);
            });
            setFormData(shareInfo);
            setOpen(!open);
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            addShare(formData).then((res) => {
                console.log(res);
            });
            setFormData(shareInfo)
        }
    };

    const handleEdit = async (id) => {
        let eData = data.filter((share) => share.shareCode === id);
        setIsEdit(true);
        setFormData(eData[0]);
        setOpen(!open);
    };

    const submitEdit = async () => {
        editShare({
            ...formData,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });
        setOpen(!open);
    };

    const handleRemove = async (id) => {
        removeShare(id).then((res) => {console.log(res)});
        setOpenDelete(!openDelete);
    };

    const handleDeleteBtn = (id) => {
        console.log(id);
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const column = [
        {
            name: 'Status',
            width: "150px",
            center: true,
            cell: row => (
                <div className={`w-[90px] flex items-center justify-center text-white h-7 rounded-full ${row.status ? 'bg-green-500' : 'bg-red-500' } `}>
                    {
                        row.status ? 'Active' : 'Inactive'
                    }
                </div>
            ),
        },
        {
            name: 'Name',
            width: "200px",
            selector: row => row.name,
            
        },
        {
            name: 'NRC No',
            width: "200px",
            selector: row => row.nrcNo,
            
        },
        {
            name: 'Contact No',
            width: "150px",
            selector: row => row.contactNo,
            
        },
        {
            name: 'Street',
            width: "200px",
            selector: row => row.street,
            
        },
        {
            name: 'Township',
            width: "200px",
            selector: row => row.township,
            
        },
        {
            name: 'City',
            width: "200px",
            selector: row => row.city,
            
        },
        {
            name: 'Region',
            width: "200px",
            selector: row => row.region,
            
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
            name: 'Remark',
            width: "200px",
            selector: row => row.remark,
        },
        {
            name: 'Action',
            center: true,
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="border-r border-gray-400 pr-2">
                        <Switch color="deep-purple" defaultChecked={row.status} id={row.code} onChange={handleChange} />
                    </div>
                    <Button 
                        variant="text" color="deep-purple" 
                        className="p-2" 
                        onClick={() => handleEdit(row.code)}
                    >
                        <FaPencil />
                    </Button>
                    <Button 
                        variant="text" 
                        color="red" 
                        className="p-2" 
                        onClick={() => handleDeleteBtn(Number(row.code))}
                        disabled={row.isOwner}
                    >
                        <FaTrashCan />
                    </Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((share) => {
        return {
            code: share.shareCode,
            name: share.shareName,
            nrcNo: share.nrcNo,
            contactNo: share.contactNo,
            street: share.street,
            township: share.township,
            city: share.city,
            region: share.region,
            createdAt: moment(share.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: share.createdBy,
            updatedAt: moment(share.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: share.updatedBy,
            remark: share.remark,
            status: share.isActive,
            isOwner: share.isOwner,
        }
    });

    return(
        <>
        <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
            <SectionTitle title="Share" handleModal={openModal} />
            <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="lg">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Share" : "Create Share"} handleClick={openModal} />
                    <form  className="flex flex-col items-end p-3 gap-2">
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {/* Share Name */}
                            <div>
                                <label className="text-black text-sm mb-2">Share Name</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.shareName}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            shareName: e.target.value
                                        });
                                    }}
                                />
                                {
                                    validationText.shareName && <p className="block text-[12px] text-red-500 font-sans">{validationText.shareName}</p>
                                }
                            </div>
                            {/* NRC No */}
                            <div>
                                <label className="text-black text-sm mb-2">NRC No</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.nrcNo}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            nrcNo: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            {/* Contact No */}
                            <div>
                                <label className="text-black text-sm mb-2">Contact No</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.contactNo}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            contactNo: e.target.value
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 w-full">
                            {/* Street */}
                            <div className="col-span-2">
                                <label className="text-black text-sm mb-2">Street</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.street}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            street: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            {/* Township */}
                            <div>
                                <label className="text-black text-sm mb-2">Township</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.township}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            township: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            {/* City */}
                            <div>
                                <label className="text-black text-sm mb-2">City</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.city}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            city: e.target.value
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {/* Region */}
                            <div>
                                <label className="text-black text-sm mb-2">Region</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.region}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            region: e.target.value
                                        });
                                    }}
                                />
                            </div>
                            {/* Remark */}
                            <div className="col-span-2 h-fit">
                                <label className="text-black mb-2 text-sm">Remark</label>
                                <textarea
                                    className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                    value={formData.remark == null ? "" : formData.remark}
                                    rows="1"
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
                                    isEdit ? <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
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

export default Share;
