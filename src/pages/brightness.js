/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useAddBrightnessMutation, useFetchBrightnessCountQuery, useFetchBrightnessQuery, useRemoveBrightnessMutation, useUpdateBrightnessMutation } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import { AuthContent } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../components/success_alert";
import { pause } from "../const";

const validator = require("validator");

function Brightness() {

    const auth = useAuthUser();

    const {permissions} = useContext(AuthContent);

    // const brightness = permissions[3];
    const [brightness, setBrightness] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setBrightness(permissions[3]);

        if(brightness?.view == false) {
            navigate('/403');
        }
    }, [brightness, navigate, permissions])

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: ''
    });

    const [ validationText, setValidationText ] = useState({});

    const { data, isLoading: dataLoad } = useFetchBrightnessQuery(filterData);

    const { data:dataCount } = useFetchBrightnessCountQuery(filterData);

    const [formData, setFormData] = useState({
        brightDesc: "",
        status: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
        updatedAt: moment().toISOString(),
        updatedBy: "",
    }, []);

    const [addBrightness] = useAddBrightnessMutation();

    const [editBrightness] = useUpdateBrightnessMutation();

    const [removeBrightness] = useRemoveBrightnessMutation();

    const [ currentPage, setCurrentPage] = useState(1);

    const [deleteId, setDeleteId] = useState('');

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
    });

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
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Stone brightness updated successfully",
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
            await addBrightness(formData).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "New stone brightness added successfully",
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
            setOpen(!open);
            resetData();
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        }
    };

    const onSaveSubmit = async () => {
        if (validateForm()) {
            addBrightness(formData).then((res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "New stone brightness added successfully",
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
            resetData();
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
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
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Stone brightness updated successfully",
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
        setOpen(!open);
        await pause();
        setAlertMsg({
            ...alertMsg,
            visible: false,
        });
    };

    const handleRemove = async (id) => {
        removeBrightness(id).then((res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Stone brightness deleted successfully",
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
        setOpenDelete(!openDelete);
        await pause();
        setAlertMsg({
            ...alertMsg,
            visible: false,
        });
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const showAlert = () => {
        
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
                    {
                        brightness?.update ? (
                            <div className="border-r border-gray-400 pr-2">
                                <div class="custom-checkbox">
                                    <input class="input-checkbox" checked={row.Status} id={row.Code} type="checkbox" onChange={handleChange} />
                                    <label for={row.Code}></label>
                                </div>
                            </div>
                        ) : null
                    }
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)}><FaPencil /></Button>  
                    {
                        brightness?.delete ? (
                            <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                        ) : null
                    }
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
        <>
            {
                brightness != null && brightness != undefined ? (
                    <div className="flex flex-col gap-4 px-4 relative w-full">
                        <div className="w-78 absolute top-0 right-0 z-[9999]">
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                            }
                        </div>
                        <SectionTitle title="Stone Brightness" handleModal={openModal} permission={brightness?.create}/>
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
                                                    });
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
                        <Dialog open={Boolean(open)} handler={openModal} size="sm">
                            <DialogBody>
                                <ModalTitle titleName={isEdit ? "Edit Stone Brightness" : "Stone Brightness"} handleClick={openModal} />
                                {/* {
                                    addResult.isSuccess && isAlert && <SuccessAlert message="Save successful." handleAlert={() => setIsAlert(false)} />
                                } */}
                                    <div  className="flex flex-col p-3">
                                        {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                                        {/* <Input label="Description" value={formData.brightDesc} onChange={(e) => setFormData({...formData, brightDesc: e.target.value})} /> */}
                                        {/* Description */}
                                        <div>
                                            <label className="text-black text-sm mb-2">Description</label>
                                            <input
                                                type="text"
                                                className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                                value={formData.brightDesc}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData, 
                                                        brightDesc: e.target.value,
                                                    });
                                                }}
                                            />
                                            {
                                                validationText.brightDesc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.brightDesc}</p>
                                            }
                                        </div>
                                        <div className="flex items-center justify-end mt-6 gap-2">
                                            {
                                                isEdit ? (
                                                    brightness?.update ? (
                                                        <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                                            <FaFloppyDisk className="text-base" /> 
                                                            <Typography variant="small" className="capitalize">
                                                                Update
                                                            </Typography>
                                                        </Button>
                                                    ) : null
                                                ) : 
                                                <>
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
                                                </>
                                            }
                                        </div>
                                    </div>
                                 
                            </DialogBody>                      
                        </Dialog>
                        <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                    </div>
                ) : null
            }
        </>
    );

}

export default Brightness;