/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { useAddWalletCategoryMutation, useFetchWalletCategoryQuery, useRemoveWalletCategoryMutation, useUpdateWalletCategoryMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";

const validator = require('validator');

function WalletCategory() {

    const [addCategory] = useAddWalletCategoryMutation();

    const [editCategory] = useUpdateWalletCategoryMutation();

    const [removeCategory] = useRemoveWalletCategoryMutation();

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const {data} = useFetchWalletCategoryQuery();

    const resetData = {
        categoryCode: 0,
        categoryDesc: '',
        isDefault: false,
        status: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
    }

    const [ formData, setFormData ] = useState(resetData);

    const [deleteId, setDeleteId] = useState('');

    const [validationText, setValidationText] = useState({});

    const openModal = () => {
        setIsEdit(false);
        setFormData(resetData)
        setOpen(!open);
        setValidationText({});
    };

    function validateForm() {
        const newErrors = {};

        if(validator.isEmpty(formData.categoryDesc)) {
            newErrors.name = 'Name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(isNew = true) {

        if(validateForm()){
            
            const saveData = {
                categoryDesc: formData.categoryDesc,
                isDefault: formData.isDefault,
                status: formData.status,
                createdAt: formData.createdAt,
                createdBy: formData.createdBy,
                updatedAt: moment().toISOString(),
                updatedBy: isEdit ? auth().username : "",
            }

            if(isEdit) {
                saveData.categoryCode = formData.categoryCode
            }

            isEdit ? await editCategory(saveData) : await addCategory(saveData);

            setOpen(isNew);

            setFormData(resetData)

        }
    }

    async function changeStatus(isChecked, id) {
        const focusData = data.find(rec => rec.categoryCode === id);
        const saveData= {
            ...focusData,
            status: isChecked, 
            updatedAt: moment().toISOString(),
            updatedBy: auth().username
        }
        await editCategory(saveData);
    }

    function handleEdit(id) {
        const focusData = data.find(rec => rec.categoryCode == id);
        setFormData(focusData);
        setOpen(true);
        setIsEdit(true);
    }

    async function handleDelete() {
        console.log(deleteId);
        await removeCategory(deleteId);
        setOpenDelete(!openDelete);
    }

    const column = [
        {
            name: 'Status',
            width: "150px",
            center: "true",
            cell: row => (
                <div className={`w-[90px] flex items-center justify-center text-white h-7 rounded-full ${row.status ? 'bg-green-500' : 'bg-red-500' } `}>
                    {
                        row.status ? 'Active' : 'Inactive'
                    }
                </div>
            ),
        },
        {
            name: 'Description',
            width: "200px",
            selector: row => row.categoryDesc,
            
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
            fixed: 'right',
            center: "true",
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="border-r border-gray-400 pr-2">
                        <Switch color="deep-purple" defaultChecked={row.status} id={row.categoryCode} onChange={(e) => changeStatus(e.target.checked, row.categoryCode)} />
                    </div>
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.categoryCode)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => {
                        setDeleteId(row.categoryCode);
                        setOpenDelete(true);
                    }}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((category) => {
        return {
            categoryCode: category.categoryCode,
            categoryDesc: category.categoryDesc,
            createdAt: moment(category.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: category.createdBy,
            updatedAt: moment(category.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: category.updatedBy,
            remark: category.remark,
            status: category.status,
        }
    });

    return(
        <div className="flex flex-col gap-4 px-2 relative">
            <SectionTitle title="Wallet Category" handleModal={openModal} />
            <Card className="h-auto shadow-md w-[1000px] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Wallet Category" : "Wallet Category"} handleClick={openModal} />

                    <div  className="flex flex-col items-end p-3 gap-4">
                        {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                        <Input 
                            label="Name" 
                            value={formData.categoryDesc}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    categoryDesc: e.target.value
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

export default WalletCategory;