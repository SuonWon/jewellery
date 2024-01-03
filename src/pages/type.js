/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaMagnifyingGlass } from "react-icons/fa6";
import { useState } from "react";
import { useFetchTypeQuery, useAddTypeMutation, useUpdateTypeMutation, useRemoveTypeMutation, useFetchTypeCountQuery } from "../store";
import Pagination from "../components/pagination";
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

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: ''
    });

    const {data} = useFetchTypeQuery(filterData);
    const {data:dataCount} = useFetchTypeCountQuery(filterData);

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

    const [ currentPage, setCurrentPage] = useState(1);

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
                    
                    <TableList columns={column} data={tbodyData} />

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
            <Dialog open={Boolean(open)} handler={openModal} size="sm">
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

export default StoneType;