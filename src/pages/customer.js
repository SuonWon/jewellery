/* eslint-disable eqeqeq */
import {  Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useFetchCustomerQuery, useAddCustomerMutation, useUpdateCustomerMutation, useRemoveCustomerMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
const validator = require("validator");

function Customer() {

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const {data } = useFetchCustomerQuery();

    const [addCustomer, addResult] = useAddCustomerMutation();

    const [editCustomer] = useUpdateCustomerMutation();

    const [removeCustomer] = useRemoveCustomerMutation();

    const [deleteId, setDeleteId] = useState('');

    const [ validationText, setValidationText ] = useState({});

    const resetData = () => {
        setFormData({
            customerName: "",
            nrcNo: "",
            companyName: "",
            contactNo: "",
            officeNo: "",
            street: "",
            township: "",
            city: "",
            region: "",
            remark: "",
            isActive: true,
            createdAt: moment().toISOString(),
            createdBy: auth().username,
            updatedAt: moment().toISOString(),
            updatedBy: "",
        });
    }

    const [formData, setFormData] = useState({
        customerName: "",
        nrcNo: "",
        companyName: "",
        contactNo: "",
        officeNo: "",
        street: "",
        township: "",
        city: "",
        region: "",
        remark: "",
        isActive: true,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
        updatedAt: moment().toISOString(),
        updatedBy: "",
    });

    const handleChange = async (e) => {
        
        let customer = data.filter((customer) => customer.customerCode == e.target.id);
        await editCustomer({
            customerCode: customer[0].customerCode,
            customerName: customer[0].customerName,
            nrcNo: customer[0].nrcNo,
            companyName: customer[0].companyName,
            contactNo: customer[0].contactNo,
            officeNo: customer[0].officeNo,
            street: customer[0].street,
            township: customer[0].township,
            city: customer[0].city,
            region: customer[0].region,
            remark: customer[0].remark,
            isActive: e.target.checked ? true: false,
            createdAt: customer[0].createdAt,
            createdBy: customer[0].createdBy,
            updatedAt: moment().toISOString(),
            updatedBy: "Hello World",
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
        if(validator.isEmpty(formData.customerName.toString())) {
            newErrors.customerName = 'Customer name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            addCustomer(formData).then((res) => {
                console.log(res);
            });
            resetData();
            setOpen(!open);
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            addCustomer(formData).then((res) => {
                console.log(res);
            });
            resetData();
        }
    };

    const handleEdit = async (id) => {
        let eData = data.filter((customer) => customer.customerCode === id);
        setIsEdit(true);
        setFormData(eData[0]);
        setOpen(!open);
    };

    const submitEdit = async () => {
        editCustomer({
            ...formData,
            updatedAt: moment().toISOString(),
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });
        setOpen(!open);
    };

    const handleRemove = async (id) => {
        removeCustomer(id).then((res) => {console.log(res)});
        setOpenDelete(!openDelete);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

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
            name: 'Name',
            width: "200px",
            selector: row => row.Name,
            
        },
        {
            name: 'NRC No',
            width: "200px",
            selector: row => row.NRCNo,
            
        },
        {
            name: 'Company Name',
            width: "200px",
            selector: row => row.CompanyName,
            
        },
        {
            name: 'Contact No',
            width: "150px",
            selector: row => row.ContactNo,
            
        },
        {
            name: 'Office No',
            width: "150px",
            selector: row => row.OfficeNo,
            
        },
        {
            name: 'Street',
            width: "200px",
            selector: row => row.Street,
            
        },
        {
            name: 'Township',
            width: "200px",
            selector: row => row.Township,
            
        },
        {
            name: 'City',
            width: "200px",
            selector: row => row.City,
            
        },
        {
            name: 'Region',
            width: "200px",
            selector: row => row.Region,
            
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
            name: 'Remark',
            width: "200px",
            selector: row => row.Remark,
        },
        {
            name: 'Action',
            center: true,
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

    const tbodyData = data?.map((customer) => {
        return {
            Code: customer.customerCode,
            Name: customer.customerName,
            NRCNo: customer.nrcNo,
            CompanyName: customer.companyName,
            ContactNo: customer.contactNo,
            OfficeNo: customer.officeNo,
            Street: customer.street,
            Township: customer.township,
            City: customer.city,
            Region: customer.region,
            CreatedAt: moment(customer.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: customer.createdBy,
            UpdatedAt: moment(customer.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: customer.updatedBy,
            Remark: customer.remark,
            Status: customer.isActive,
        }
    });

    return(
        <>
        <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
            </div>
            <SectionTitle title="Customers" handleModal={openModal} />
            <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="lg">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Customer" : "Customer"} handleClick={openModal} />
                    <form  className="flex flex-col items-end p-3 gap-4">
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <div>
                                <Input label="Name" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
                                {
                                    validationText.customerName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customerName}</p>
                                }
                            </div>
                            <Input label="NRC No" value={formData.nrcNo} onChange={(e) => setFormData({...formData, nrcNo: e.target.value})} />
                            <Input label="Company Name" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-4 gap-2 w-full">
                            <Input label="Contact No" value={formData.contactNo} onChange={(e) => setFormData({...formData, contactNo: e.target.value})} />
                            <Input label="Office No" value={formData.officeNo} onChange={(e) => setFormData({...formData, officeNo: e.target.value})} />
                            <div className="col-span-2">
                                <Input label="Street" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <Input label="Township" value={formData.township} onChange={(e) => setFormData({...formData, township: e.target.value})} />
                            <Input label="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                            <Input label="Region" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} />
                        </div>
                        <Textarea label="Remark" rows={1} value={formData.remark} onChange={(e) => setFormData({...formData, remark: e.target.value})} />
                        <div className="flex items-center justify-end mt-6 gap-2">
                            {
                                isEdit ? 
                                <Button onClick={submitEdit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                    <FaFloppyDisk className="text-base" /> 
                                    <Typography variant="small" className="capitalize">
                                        Update
                                    </Typography>
                                </Button> : <>
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

export default Customer;
