import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaEye, FaFloppyDisk, FaPencil, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useAddIssueMutation, useFetchIssueQuery, useFetchStoneDetailsQuery, useFetchTrueCustomerQuery, useFetchUOMQuery, useRemoveIssueMutation, useUpdateIssueMutation } from "../store";
import moment from "moment";
import { useState } from "react";
import SuccessAlert from "../components/success_alert";
import TableList from "../components/data_table";
import DeleteModal from "../components/delete_modal";
import { Link } from "react-router-dom";
import { apiUrl, focusSelect } from "../const";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
import { useAuthUser } from "react-auth-kit";
import DataTable from "react-data-table-component";
import axios from "axios";
const validator = require('validator');


function IssueList() {

    const { data } = useFetchIssueQuery();

    axios.get(`${apiUrl}/issue/get-id`).then((res) => {
        setIssueId(res.data);
    });

    const [isEdit, setIsEdit] = useState(false);

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [deleteId, setDeleteId] = useState('');

    const [issueId, setIssueId] = useState('');

    const auth = useAuthUser();

    const { data: stoneDetails } = useFetchStoneDetailsQuery();

    const { data: unitData } = useFetchUOMQuery();

    const { data: customerData } = useFetchTrueCustomerQuery();

    const [addIssue, addResult] = useAddIssueMutation();

    const [removeIssue] = useRemoveIssueMutation();

    const [updateIssue] = useUpdateIssueMutation();

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: ''
    });

    const issueData = {
        issueNo: "",
        issueDate: moment().format("YYYY-MM-DD"),
        stoneDetailCode: "",
        qty: 0,
        weight: 0,
        unitCode: "",
        unitPrice: 0,
        totalPrice: 0,
        status: "O",
        remark: "",
        createdBy: auth().username,
        updatedBy: "",
        deletedBy: "",
        issueMember: [],
    };

    const issueMemberData = {
        id: uuidv4(),
        issueNo: "",
        lineNo: 0,
        customerCode: 0,
        customerName: "",
    }

    const [formData, setFormData] = useState(issueData);

    const [memberData, setMemberData] = useState(issueMemberData);

    const [tBodyData, setTBodyData] = useState([]);

    const [ validationText, setValidationText ] = useState({});

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const handleOpen = () => {
        setFormData(issueData);
        setTBodyData([]);
        setIsEdit(false);
        setOpen(!open);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.issueNo === id);
        console.log(tempData);
        setFormData({
            issueNo: tempData.issueNo,
            issueDate: tempData.issueDate,
            stoneDetailCode: tempData.stoneDetailCode,
            qty: tempData.qty,
            weight: tempData.weight,
            unitCode: tempData.unitCode,
            unitPrice: tempData.unitPrice,
            totalPrice: tempData.totalPrice,
            status: tempData.status,
            remark: tempData.remark,
            createdAt: tempData.createdAt,
            createdBy: tempData.createdBy,
            updatedAt: tempData.updatedAt,
            updatedBy: tempData.updatedBy,
            deletedAt: tempData.deletedAt,
            deletedBy: tempData.deletedBy,
            issueMember: tempData.issueMember.map(el => {
                return {
                    id: el.id,
                    lineNo: el.lineNo,
                    customerCode: el.customerCode,
                }
            })
        });
        setTBodyData(tempData.issueMember.map(el => {
            return {
                id: el.id,
                issueNo: el.issueNo,
                lineNo: el.lineNo,
                customerCode: el.customerCode,
                customerName: el.customer.customerName,
            }
        }));
        setIsEdit(true);
        setOpen(!open);
    };

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removeIssue({
            id: removeData[0].invoiceNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => { console.log(res) });
        // setIsAlert(true);
        setOpenDelete(!openDelete);
        // await pause(2000);
        // setIsAlert(false);
    };

    function validateForm() {

        const newErrors = {};

        if(validator.isEmpty(formData.issueDate)) {
            newErrors.issueDate = "Issue Date is required.";
        } 
        if(validator.isEmpty(formData.stoneDetailCode)) {
            newErrors.stoneDetailCode = "Stone Detail is required.";
        }
        if(validator.isEmpty(formData.unitCode)) {
            newErrors.unitCode = "Unit is required.";
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    function validateMember() {
        const newErrors = {};

        if(memberData.customerCode === 0) {
            newErrors.customer = "Customer Name is required.";
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = () => {
        if (validateForm()) {
            try {
                addIssue({
                    ...formData,
                    issueNo: issueId,
                    issueDate: moment(formData.issueDate).toISOString(),
                }).then((res) => {
                    if(res.error != null) {
                        let message = '';
                        if(res.error.data.statusCode == 409) {
                            message = "Duplicate data found."
                        }
                        else {
                            message = res.error.data.message
                        }
                        setAlert({
                            isAlert: true,
                            message: message
                        })
                        setTimeout(() => {
                            setAlert({
                                isAlert: false,
                                message: ''
                            })
                        }, 2000);
                    }
                    
                });
                setFormData(issueData);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(issueData);
            setTBodyData([]);
            setOpen(!open)
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            try {
                addIssue({
                    ...formData,
                    issueNo: issueId,
                    issueDate: moment(formData.issueDate).toISOString(),
                }).then((res) => {
                    if(res.error != null) {
                        let message = '';
                        if(res.error.data.statusCode == 409) {
                            message = "Duplicate data found."
                        }
                        else {
                            message = res.error.data.message
                        }
                        setAlert({
                            isAlert: true,
                            message: message
                        })
                        setTimeout(() => {
                            setAlert({
                                isAlert: false,
                                message: ''
                            })
                        }, 2000);
                    }
                    
                });
                setFormData(issueData);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(issueData);
            setTBodyData([]);
        }
    };

    const handleUpdate = () => {
        if (validateForm()) {
            try {
                console.log(formData);
                updateIssue({
                    issueNo: formData.issueNo,
                    issueDate: formData.issueDate,
                    stoneDetailCode: formData.stoneDetailCode,
                    qty: formData.qty,
                    weight: formData.weight,
                    unitCode: formData.unitCode,
                    unitPrice: formData.unitPrice,
                    totalPrice: formData.totalPrice,
                    status: formData.status,
                    remark: formData.remark,
                    createdBy: formData.createdBy,
                    createdAt: formData.createdAt,
                    updatedBy: auth().username,
                    updatedAt: moment().toISOString(),
                    deletedBy: "",
                    issueMember: formData.issueMember,
                }).then((res) => {
                    if(res.error != null) {
                        let message = '';
                        if(res.error.data.statusCode == 409) {
                            message = "Duplicate data found."
                        }
                        else {
                            message = res.error.data.message
                        }
                        setAlert({
                            isAlert: true,
                            message: message
                        })
                        setTimeout(() => {
                            setAlert({
                                isAlert: false,
                                message: ''
                            })
                        }, 2000);
                    }
                    
                });
                setFormData(issueData);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
            setFormData(issueData);
            setOpen(!open);
        }
    };

    const deleteCustomer = (id) => {
        const leftData = tBodyData.filter(rec => rec.id !== id);
        let newData = [];
        leftData.map((rec, index) => {
            newData.push({
                ...rec,
                lineNo: index + 1
            })
        });
        setTBodyData(newData);
        setFormData({
            ...formData,
            issueMember: formData.issueMember.filter(rec => rec.id !== id)
        });
    };

    const saveMember = () => {

        if(validateMember()) {
            let isExist = tBodyData.find(res => res.customerCode === memberData.customerCode);
            if(!isExist){
                setTBodyData([
                    ...tBodyData,
                    {
                        ...memberData,
                        lineNo: tBodyData.length + 1,
                    },
                ]);
                setFormData({
                    ...formData,
                    issueMember: [
                        ...formData.issueMember, 
                        {
                            id: memberData.id,
                            lineNo: tBodyData.length + 1,
                            customerCode: memberData.customerCode
                        }
                    ]
                });
                setMemberData(issueMemberData);
            } else {
                alert("Member already exist in the list");
            }
            
        }
    };

    const customerColumn = [
        {
            name: 'No',
            width: "80px",
            selector: row => row.lineNo,
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName,
        },
        {
            name: 'Action',
            center: "true",
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button variant="text" color="red" className="p-2" onClick={() => deleteCustomer(row.id)} ><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const column = [
        {
            name: 'Issue No',
            width: '200px',
            selector: row => row.issueNo,
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => row.issueDate,
        },
        {
            name: 'Stone Detail',
            width: "250px",
            selector: row => row.stoneDetailCode,
        },
        {
            name: 'Quantity',
            width: "100px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "100px",
            selector: row => row.weight,
            center: "true"

        },
        {
            name: 'Unit',
            width: "150px",
            selector: row => row.unitCode,
            center: "true"
        },
        {
            name: 'Unit Price',
            width: "150px",
            selector: row => row.unitPrice,
            right: "true",
        },
        {
            name: 'Total Price',
            width: "150px",
            selector: row => row.totalPrice,
            right: "true",
        },
        {
            name: 'Remark',
            width: "300px",
            selector: row => row.remark,
        },
        // {
        //     name: 'Created At',
        //     width: "200px",
        //     selector: row => row.createdAt,
        // },
        // {
        //     name: 'Updated At',
        //     width: "200px",
        //     selector: row => row.updatedAt,
        // },
        // {
        //     name: 'Deleted At',
        //     width: "200px",
        //     selector: row => row.deletedAt,
        // },
        {
            name: 'Action',
            center: true,
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <Link to={`/purchase_edit/${row.Code}`}>
                        <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
                    </Link> */}
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.issueNo)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.issueNo)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const issueDataList = data?.map((issueData) => {
        return {
            issueNo: issueData.issueNo,
            issueDate: moment(issueData.issueDate).format("YYYY-MM-DD"),
            stoneDetailCode: issueData.stoneDetail.stoneDesc,
            qty: issueData.qty,
            weight: issueData.weight,
            unitCode: issueData.unitCode,
            unitPrice: issueData.unitPrice.toLocaleString('en-US'),
            totalPrice: issueData.totalPrice.toLocaleString('en-US'),
            remark: issueData.remark,
            status: issueData.status,
            createdAt: moment(issueData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: issueData.createdBy,
            updatedAt: moment(issueData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: issueData.updatedBy,
            deletedAt: moment(issueData.deletedAt).format("YYYY-MM-DD hh:mm:ss a"),
            deletedBy: issueData.deletedBy,
        }
    });

    return (
        <>
            <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                <div className="w-78 absolute top-0 right-0 z-[9999]">
                    {/* {
                        removeResult.isSuccess && isAlert && <SuccessAlert title="Purchase" message="Delete successful." handleAlert={() => setIsAlert(false)} />
                    } */}
                </div>
                <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h5">
                        Issue List
                    </Typography>
                    <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                        <FaPlus /> Create New
                    </Button>
                </div>
                <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                    <CardBody className="rounded-sm overflow-auto p-0">
                        <TableList columns={column} data={issueDataList} />
                    </CardBody>
                </Card>
                <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                <Dialog open={open} size="lg">
                    <DialogBody>
                        <ModalTitle titleName={isEdit ? "Edit Issue" : "Create Issue"} handleClick={() => setOpen(!open)} />
                        <div className="grid grid-cols-4 gap-4 px-3 mb-3">
                            <div className="col-span-2 grid grid-cols-2 gap-2 h-fit">
                                {
                                    isEdit? 
                                    <div className="col-span-2 grid grid-cols-2">
                                        <div className="">
                                            <label className="text-black mb-2 text-sm">Issue No</label>
                                            <input
                                                type="text"
                                                className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                                value={formData.issueNo}
                                                readOnly={isEdit}
                                            />
                                        </div>
                                    </div> : ""
                                }
                                {/* Issue Date */}
                                <div className="">
                                    <label className="text-black mb-2 text-sm">Issue Date</label>
                                    <input
                                        type="date"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={moment(formData.issueDate).format("YYYY-MM-DD")}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            issueDate: e.target.value
                                        })}
                                    />
                                    {
                                        validationText.issueDate && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.issueDate}</p>
                                    }
                                </div>
                                {/* Stone Details */}
                                <div className="">
                                    <label className="text-black mb-2 text-sm">Stone Details</label>
                                    <select 
                                        className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                        value={formData.stoneDetailCode} 
                                        onChange={(e) => 
                                            setFormData({
                                                ...formData, 
                                                stoneDetailCode: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="" disabled>Select stone detail</option>
                                        {
                                            stoneDetails?.length === 0 ? <option value="" disabled>There is no Data</option> :
                                            stoneDetails?.map((stoneDetail) => {
                                                return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc}</option>
                                            })
                                        }
                                    </select>
                                    {
                                        validationText.stoneDetailCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.stoneDetailCode}</p>
                                    } 
                                </div>
                                <div className="col-span-2 grid grid-cols-3 gap-2">
                                    {/* Qty */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Qty</label>
                                        <input
                                            type="number"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.qty}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    qty: parseFloat(e.target.value),
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                    </div>
                                    {/* Weight */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Weight</label>
                                        <input
                                            type="number"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                            value={formData.weight}
                                            onChange={(e) => {
                                                let weight = parseFloat(e.target.value);
                                                setFormData({
                                                    ...formData, 
                                                    weight: weight,
                                                    totalPrice: formData.unitPrice * weight,
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
                                        />
                                    </div>
                                    {/* Unit */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Unit</label>
                                        <select 
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black" 
                                            value={formData.unitCode}
                                            onChange={(e) => {
                                                setFormData({
                                                    ...formData, 
                                                    unitCode: e.target.value,
                                                });
                                            }}
                                        >
                                            <option value=""  disabled>Select Unit</option>
                                            {
                                                unitData?.map((unit) => {
                                                    return <option value={unit.unitCode} key={unit.unitCode} >{unit.unitCode}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.unitCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.unitCode}</p>
                                        }
                                    </div>
                                </div>
                                {/* Unit Price */}
                                <div>
                                    <label className="text-black text-sm mb-2">Unit Price</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.unitPrice}
                                        onChange={(e) => {
                                            let price = parseFloat(e.target.value);
                                            setFormData({
                                                ...formData, 
                                                unitPrice: price,
                                                totalPrice: formData.weight * price,
                                            });
                                        }}
                                        onFocus={(e) => focusSelect(e)}
                                    />
                                </div>
                                {/* Total Price */}
                                <div>
                                    <label className="text-black text-sm mb-2">Total Price</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.totalPrice}
                                        readOnly
                                    />
                                </div>
                                {/* Remark */}
                                <div className="grid col-span-2 h-fit">
                                    <label className="text-black mb-2 text-sm">Remark</label>
                                    <textarea
                                        className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.remark}
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
                            <div className="col-span-2 grid grid-cols-3 gap-2 h-fit">
                                {/* Select Customer */}
                                <div className="col-span-3 gap-2">
                                    <div className="w-full">
                                        <label className="text-black mb-2 text-sm">Customer Name</label>
                                        <div className="flex items-center gap-2">
                                            <select 
                                            className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                            value={memberData.customerCode} 
                                            onChange={(e) => setMemberData({
                                                ...memberData,
                                                customerCode: Number(e.target.value),
                                                customerName: e.target.selectedOptions[0].text
                                            })}
                                            >
                                                <option value="0" disabled>Select Customer</option>
                                                {
                                                    customerData?.map((customer) => {
                                                        return <option value={customer.customerCode} key={customer.customerCode} >{customer.customerName}</option>
                                                    })
                                                }
                                            </select>
                                            <Button type="button" variant="gradient" color="deep-purple" className="py-2 px-4 capitalize" onClick={saveMember}>
                                                Select
                                            </Button>
                                        </div>
                                        
                                        {
                                            validationText.customer && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customer}</p>
                                        }
                                    </div>
                                </div>
                                {/* Customer table list */}
                                <div className="col-span-3">
                                    <Card className="w-full shadow-sm border border-blue-gray-200 rounded-md">
                                        <CardBody className="overflow-auto rounded-md p-0">
                                        <DataTable 
                                            columns={customerColumn} 
                                            data={tBodyData} 
                                            customStyles={{
                                                rows: {
                                                    style: {
                                                        minHeight: '40px',
                                                    },
                                                },
                                                headCells: {
                                                    style: {
                                                        fontWeight: "bold",
                                                        fontSize: "0.8rem",
                                                        minHeight: '40px',
                                                    }
                                                }
                                            }} 
                                        />
                                        </CardBody>
                                    </Card>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-6 gap-2">
                            {
                                isEdit? 
                                <Button onClick={handleUpdate} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                    <FaFloppyDisk className="text-base" />
                                    <Typography variant="small" className="capitalize">
                                        Update
                                    </Typography>
                                </Button> :
                                <>
                                    <Button onClick={handleSubmit} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaFloppyDisk className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save
                                        </Typography>
                                    </Button>
                                    <Button onClick={handleSave} color="green" size="sm" variant="gradient" className="flex items-center gap-2">
                                        <FaCirclePlus className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Save & New
                                        </Typography>
                                    </Button>
                                </>
                            }
                        </div>
                    </DialogBody>
                </Dialog>
            </div>
        </>
    );
}

export default IssueList;