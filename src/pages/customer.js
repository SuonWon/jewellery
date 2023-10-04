/* eslint-disable eqeqeq */
import { Alert, Button, Card, CardBody, Dialog, DialogBody, Input, Switch, Textarea, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";
import { useState } from "react";
import { useFetchCustomerQuery, useAddCustomerMutation, useUpdateCustomerMutation, useRemoveCustomerMutation } from "../store";
import { useForm } from "react-hook-form";
import { pause, currentDate } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";

function Customer() {

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const [isEdit, setIsEdit] = useState(false);

    const [editData, setEditData] = useState({});

    const {data } = useFetchCustomerQuery();

    const customer = {
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
    };

    const {register, handleSubmit, setValue, formState: {errors}, reset } = useForm({
        defaultValues: {
            customerInfo: customer
        }
    });

    const resetData = () => {
        reset({
            customerInfo: customer
        })
    };

    const [addCustomer, addResult] = useAddCustomerMutation();

    const [editCustomer, editResult] = useUpdateCustomerMutation();

    const [removeCustomer, removeResult] = useRemoveCustomerMutation();

    const [deleteId, setDeleteId] = useState('');

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
            updatedAt: currentDate,
            updatedBy: "Hello World",
        }).then((res) => {
            console.log(res);
        });

    };

    const openModal = () => {
        setIsEdit(false);
        setValue("customerInfo", customer);
        setOpen(!open);
    };

    const onSubmit = async (customerData) => {
        let subData = {
            ...customerData.customerInfo,
            isActive: true,
            createdAt: currentDate,
            createdBy: 'Htet Wai Aung',
            updatedAt: currentDate,
        };
        addCustomer(subData).then((res) => {
            resetData();
            console.log(res);
        });
        setIsAlert(true);
        setOpen(!open);
        await pause(2000);
        setIsAlert(false);
    };

    const onSaveSubmit = (customerData) => {
        let subData = {
            ...customerData.customerInfo,
            isActive: true,
            createdAt: currentDate,
            createdBy: 'Htet Wai Aung',
            updatedAt: currentDate,
        };
        addCustomer(subData).then((res) => {
            resetData();
            console.log(res);
        });
        setIsAlert(true);
    };

    const handleEdit = async (id) => {
        let eData = data.filter((customer) => customer.customerCode === id);
        setEditData(eData[0]);
        setIsEdit(true);
        setValue("customerInfo", {
            customerName: eData[0].customerName,
            nrcNo: eData[0].nrcNo,
            companyName: eData[0].companyName,
            contactNo: eData[0].contactNo,
            officeNo: eData[0].officeNo,
            street: eData[0].street,
            township: eData[0].township,
            city: eData[0].city,
            region: eData[0].region,
            remark: eData[0].remark
        });
        setOpen(!open);
    };

    const submitEdit = async (customerData) => {
        editCustomer({
            customerCode: editData.customerCode,
            customerName: customerData.customerInfo.customerName,
            nrcNo: customerData.customerInfo.nrcNo,
            companyName: customerData.customerInfo.companyName,
            contactNo: customerData.customerInfo.contactNo,
            officeNo: customerData.customerInfo.officeNo,
            street: customerData.customerInfo.street,
            township: customerData.customerInfo.township,
            city: customerData.customerInfo.city,
            region: customerData.customerInfo.region,
            remark: customerData.customerInfo.remark,
            isActive: editData.isActive,
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
        removeCustomer(id).then((res) => {console.log(res)});
        setIsAlert(true);
        setOpenDelete(!openDelete);
        await pause(2000);
        setIsAlert(false);
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
            sortable: true,
            width: "200px",
            selector: row => row.Name,
            
        },
        {
            name: 'NRC No',
            sortable: true,
            width: "200px",
            selector: row => row.NRCNo,
            
        },
        {
            name: 'Company Name',
            sortable: true,
            width: "200px",
            selector: row => row.CompanyName,
            
        },
        {
            name: 'Contact No',
            sortable: true,
            width: "150px",
            selector: row => row.ContactNo,
            
        },
        {
            name: 'Office No',
            sortable: true,
            width: "150px",
            selector: row => row.OfficeNo,
            
        },
        {
            name: 'Street',
            sortable: true,
            width: "200px",
            selector: row => row.Street,
            
        },
        {
            name: 'Township',
            sortable: true,
            width: "200px",
            selector: row => row.Township,
            
        },
        {
            name: 'City',
            sortable: true,
            width: "200px",
            selector: row => row.City,
            
        },
        {
            name: 'Region',
            sortable: true,
            width: "200px",
            selector: row => row.Region,
            
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
            center: true,
            width: "150px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="border-r border-gray-400 pr-2">
                        <Switch color="deep-purple" defaultChecked={row.Status === true ? true : false} id={row.Code} onChange={handleChange} />
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
            <SectionTitle title="Customers" handleModal={openModal} />
            <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <Dialog open={open} handler={openModal} size="lg">
                <DialogBody>
                    <ModalTitle titleName={isEdit ? "Edit Customer" : "Customer"} handleClick={openModal} />
                    {
                        addResult.isSuccess && isAlert && <SuccessAlert message="Save successful." handleAlert={() => setIsAlert(false)} />
                    }
                    {
                        isEdit ? (
                            <form  className="flex flex-col items-end p-3 gap-4">
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Input label="Name" {...register('customerInfo.customerName', {require: true})} />
                                    <Input label="NRC No" {...register('customerInfo.nrcNo', {require: true})} />
                                    <Input label="Company Name" {...register('customerInfo.companyName', {require: true})} />
                                </div>
                                <div className="grid grid-cols-4 gap-2 w-full">
                                    <Input label="Contact No" {...register('customerInfo.contactNo', {require: true})} />
                                    <Input label="Office No" {...register('customerInfo.officeNo', {require: true})} />
                                    <div className="col-span-2">
                                        <Input label="Street" {...register('customerInfo.street', {require: true})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Input label="Township" {...register('customerInfo.township', {require: true})} />
                                    <Input label="City" {...register('customerInfo.city', {require: true})} />
                                    <Input label="Region" {...register('customerInfo.region', {require: true})} />
                                </div>
                                <Textarea label="Remark" rows={1} {...register('customerInfo.remark')} />
                                {
                                    errors.stoneDesc && <Alert
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
                            <form  className="flex flex-col items-end p-3 gap-4">
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Input label="Name" onFocus={() => setIsAlert(false)} {...register('customerInfo.customerName', {require: true})} />
                                    <Input label="NRC No" onFocus={() => setIsAlert(false)} {...register('customerInfo.nrcNo', {require: true})} />
                                    <Input label="Company Name" onFocus={() => setIsAlert(false)} {...register('customerInfo.companyName', {require: true})} />
                                </div>
                                <div className="grid grid-cols-4 gap-2 w-full">
                                    <Input label="Contact No" onFocus={() => setIsAlert(false)} {...register('customerInfo.contactNo', {require: true})} />
                                    <Input label="Office No" onFocus={() => setIsAlert(false)} {...register('customerInfo.officeNo', {require: true})} />
                                    <div className="col-span-2">
                                        <Input label="Street" onFocus={() => setIsAlert(false)} {...register('customerInfo.street', {require: true})} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Input label="Township" onFocus={() => setIsAlert(false)} {...register('customerInfo.township', {require: true})} />
                                    <Input label="City" onFocus={() => setIsAlert(false)} {...register('customerInfo.city', {require: true})} />
                                    <Input label="Region" onFocus={() => setIsAlert(false)} {...register('customerInfo.region', {require: true})} />
                                </div>
                                <Textarea label="Remark" rows={1} onFocus={() => setIsAlert(false)} {...register('customerInfo.remark')} />
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
        
        </>
    );

}

export default Customer;
