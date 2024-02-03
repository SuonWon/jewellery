/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useAddWalletCategoryMutation, useFetchWalletCategoryCountQuery, useFetchWalletCategoryQuery, useRemoveWalletCategoryMutation, useUpdateWalletCategoryMutation } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import { AuthContent } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { pause } from "../const";
import SuccessAlert from "../components/success_alert";

const validator = require('validator');

function WalletCategory() {

    const [addCategory] = useAddWalletCategoryMutation();

    const [editCategory] = useUpdateWalletCategoryMutation();

    const [removeCategory] = useRemoveWalletCategoryMutation();

    const auth = useAuthUser();

    const { permissions } = useContext(AuthContent);

    const [catePermission, setCatePermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setCatePermission(permissions[5]);

        if(catePermission?.view == false) {
            navigate('./supplier');
        }
    }, [catePermission, permissions, navigate])

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: ''
    });

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
    });

    const {data, isLoading: dataLoad} = useFetchWalletCategoryQuery(filterData);

    const {data:dataCount} = useFetchWalletCategoryCountQuery(filterData);

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

    const [ currentPage, setCurrentPage] = useState(1);

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

            isEdit ? await editCategory(saveData).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Wallet category updated successfully.",
                    });
                } else {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Error",
                        message: res.error.data.message,
                        isError: true,
                    });
                }
            }) : await addCategory(saveData).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Wallet category created successfully.",
                    });
                } else {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Error",
                        message: res.error.data.message,
                        isError: true,
                    });
                }
            });
            setOpen(isNew);
            setFormData(resetData);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
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
        await editCategory(saveData).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Wallet category updated successfully.",
                });
            } else {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Error",
                    message: res.error.data.message,
                    isError: true,
                });
            }
        });
        await pause();
        setAlertMsg({
            ...alertMsg,
            visible: false,
        });
    }

    function handleEdit(id) {
        const focusData = data.find(rec => rec.categoryCode == id);
        setFormData(focusData);
        setOpen(true);
        setIsEdit(true);
    }

    async function handleDelete() {
        console.log(deleteId);
        await removeCategory(deleteId).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Wallet category deleted successfully.",
                });
            } else {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Error",
                    message: "This data cannot be deleted.",
                    isError: true,
                });
            }
        });
        setOpenDelete(!openDelete);
        await pause();
        setAlertMsg({
            ...alertMsg,
            visible: false,
        });
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
                    {
                        catePermission?.update ? (
                            <div className="border-r border-gray-400 pr-2">
                                <div class="custom-checkbox">
                                    <input class="input-checkbox" checked={row.status} id={row.categoryCode} type="checkbox" onChange={(e) => changeStatus(e.target.checked, row.categoryCode)} />
                                    <label for={row.categoryCode}></label>
                                </div>
                            </div>
                        ) : null
                    }
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.categoryCode)}><FaPencil /></Button>
                    {
                        catePermission?.delete ? (
                            <Button variant="text" color="red" className="p-2" onClick={() => {
                                setDeleteId(row.categoryCode);
                                setOpenDelete(true);
                            }}><FaTrashCan /></Button>
                        ) : null
                    }
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
        <div className="flex flex-col gap-4 px-4 relative w-full">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                }
            </div>
            <SectionTitle title="Wallet Category" handleModal={openModal} permission={catePermission?.create}/>
            <Card className="h-auto shadow-md min-w-[100%] max-w-[100%] mx-1 rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <div className="flex justify-end py-2">
                        <div className="w-72">
                            <Input label="Search" value={filterData.search} onChange={(e) => {
                                    setFilterData({
                                        skip: 0,
                                        take: 10,
                                        search: e.target.value
                                    });
                                    setCurrentPage(1);
                                }}
                                icon={<FaMagnifyingGlass />}
                            />
                        </div>
                    </div>
                    
                    <TableList columns={column} data={tbodyData} pending={dataLoad} />

                    <div className="grid grid-cols-2">
                        <div className="flex mt-7 mb-5">
                            <p className="mr-2 mt-[6px]">Show</p>
                            <div className="w-[80px]">
                                <select
                                    className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                    value={filterData.take} 
                                    onChange={(e) => {
                                        setFilterData({
                                            ...filterData,
                                            skip: 0,
                                            take: e.target.value
                                        })
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            
                            <p className="ml-2 mt-[6px]">entries</p>
                        </div>
                        
                        <div className="flex justify-end">
                            {
                                dataCount != undefined ? (
                                    <Pagination
                                        className="pagination-bar"
                                        siblingCount={1}
                                        currentPage={currentPage}
                                        totalCount={dataCount}
                                        pageSize={filterData.take}
                                        onPageChange={(page) => {
                                            setCurrentPage(page);
                                            setFilterData({
                                                ...filterData,
                                                skip: (page - 1) * filterData.take
                                            })
                                        }}
                                    />
                                ) : (<></>)
                            }
                        </div>
                        
                    </div>
                    
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="sm">
                <DialogBody>
                    {
                        alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                    }
                    <ModalTitle titleName={isEdit ? "Edit Wallet Category" : "Wallet Category"} handleClick={openModal} />
                    <div  className="flex flex-col p-3 gap-4">
                        {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                        <div>
                            <label className="text-black text-sm mb-2">Name</label>
                            <input
                                type="text"
                                className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                value={formData.categoryDesc}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData, 
                                        categoryDesc: e.target.value,
                                    });
                                }}
                            />
                            {
                                validationText.desc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.desc}</p>
                            }
                        </div>
                        <div className="flex items-center justify-end mt-6 gap-2">
                            {
                                !isEdit ? (
                                    <>
                                        <Button onClick={() => handleSubmit(false)} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                            <FaFloppyDisk className="text-base" /> 
                                            <Typography variant="small" className="capitalize">
                                                Save
                                            </Typography>
                                        </Button>
                                        <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="outlined" className="flex items-center gap-2">
                                            <FaCirclePlus className="text-base" /> 
                                            <Typography variant="small" className="capitalize">
                                                Save & New
                                            </Typography>
                                        </Button>
                                    </>
                                ) : (
                                    catePermission?.update ? (
                                        <Button onClick={() => handleSubmit(false)} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                            <FaFloppyDisk className="text-base" /> 
                                            <Typography variant="small" className="capitalize">
                                                Update
                                            </Typography>
                                        </Button>
                                    ) : null
                                )
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