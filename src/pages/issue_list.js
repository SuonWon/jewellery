import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaPlus, FaTrashCan } from "react-icons/fa6";
import { useAddIssueMutation, useFetchActiveStoneDetailsQuery, useFetchIssueCountQuery, useFetchIssueQuery, useFetchReturnQuery, useFetchTrueCustomerQuery, useFetchUOMQuery, useRemoveIssueMutation, useUpdateIssueMutation } from "../store";
import Pagination from "../components/pagination";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import SuccessAlert from "../components/success_alert";
import TableList from "../components/data_table";
import DeleteModal from "../components/delete_modal";
import { apiUrl, focusSelect, pause } from "../const";
import ModalTitle from "../components/modal_title";
import { v4 as uuidv4 } from 'uuid';
import { useAuthUser } from "react-auth-kit";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContent } from "../context/authContext";
import ButtonLoader from "../components/buttonLoader";

const validator = require('validator');


function IssueList() {

    const {permissions} = useContext(AuthContent);

    const token = 'Bearer ' + Cookies.get('_auth');

    const [issuePermission, setIssuePermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setIssuePermission(permissions[13]);

        if(issuePermission?.view === false) {
            navigate('/403');
        }
    },[permissions, issuePermission, navigate])

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        status: 'O',
        isComplete: 'A',
        search_word: '',
        start_date: null,
        end_date: null
    });

    const [alertMsg, setAlertMsg] = useState({
        visible: false,
        title: '',
        message: '',
        isError: false,
        isWarning: false,
        isNew: false,
    });

    const { data, isLoading: dataLoad, refetch } = useFetchIssueQuery(filterData);

    const { data: dataCount } = useFetchIssueCountQuery(filterData);

    const { data: stoneDetails } = useFetchActiveStoneDetailsQuery();

    const { data: unitData } = useFetchUOMQuery();

    const { data: customerData } = useFetchTrueCustomerQuery();

    // const { data: returnData } = useFetchReturnQuery('I');
    const { data: returnData } = useFetchReturnQuery({
        skip: 0,
        take: 10,
        status: 'O',
        return_type: 'I',
        search_word: '',
        start_date: null,
        end_date: null
    });

    const [isEdit, setIsEdit] = useState(false);

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [deleteId, setDeleteId] = useState('');

    // const [issueId, setIssueId] = useState('');

    const auth = useAuthUser();

    const [addIssue, addResult] = useAddIssueMutation();

    const [removeIssue, removeResult] = useRemoveIssueMutation();

    const [updateIssue, updateResult] = useUpdateIssueMutation();

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        refetch();
    }, [data]);

    const issueData = {
        issueNo: "",
        issueDate: moment().format("YYYY-MM-DD"),
        stoneDetailCode: "",
        qty: 0,
        weight: 0,
        unitCode: "ct",
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

    const [tBodyReturnData, setTBodyReturnData] = useState([]);

    const [ validationText, setValidationText ] = useState({});

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const handleOpen = () => {
        setFormData(issueData);
        setTBodyData([]);
        setIsEdit(false);
        setValidationText({});
        setOpen(!open);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.issueNo === id);

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
        setTBodyReturnData(returnData.filter(el => el.referenceNo === id));
        setIsEdit(true);
        setOpen(!open);
    };

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.issueNo === id);
        removeIssue({
            id: removeData[0].issueNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then(async(res) => { 
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Issue data deleted successfully.",
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
            setOpenDelete(!openDelete);
            await pause();
            setAlertMsg({
                ...alertMsg,
                visible: false,
            });
        });
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
        if(formData.issueMember.length === 0) {
            newErrors.issueMember = "Please choose at least one customer.";
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

    const handleSubmit = async () => {
        if (validateForm()) {
            var issueId = '';

            await axios.get(`${apiUrl}/issue/get-id`, {
                headers: {
                    "Authorization": token
                }
            }).then((res) => {
                issueId = res.data;
            });

            addIssue({
                ...formData,
                issueNo: issueId,
                issueDate: moment(formData.issueDate).toISOString(),
            }).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Issue data created successfully.",
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
                setFormData(issueData);
                setOpen(!open);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const handleSave = async () => {
        if (validateForm()) {
            var issueId = '';

            await axios.get(`${apiUrl}/issue/get-id`, {
                headers: {
                    "Authorization": token
                }
            }).then((res) => {
                issueId = res.data;
            });

            addIssue({
                ...formData,
                issueNo: issueId,
                issueDate: moment(formData.issueDate).toISOString(),
            }).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Issue data created successfully.",
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
                setFormData(issueData);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    };

    const handleUpdate = async () => {
        if (validateForm()) {
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
            }).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Issue data updated successfully.",
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
                setFormData(issueData);
                setOpen(!open);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
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

    const saveMember = async () => {

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
                setAlertMsg({
                    visible: true,
                    message: "Customer is already selected.",
                    isWarning: true,
                    title: "Warning"
                });
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false
                });
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
            name: 'Status',
            width: '120px',
            selector: row => row.status === 'O' ? 
                <div className="bg-green-500 px-3 py-[5px] text-white rounded-xl">
                    Open
                </div>
                : row.status === 'V' ? 
                    <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                        Void
                    </div> 
                : <div className="bg-orange-500 px-3 py-[5px] text-white rounded-xl">
                        Closed
                    </div>,
            center: 'true'
        },
        {
            name: 'Issue No',
            width: '130px',
            selector: row => row.isComplete? <div className="bg-blue-500 px-3 py-[5px] text-white rounded-xl">
                {row.issueNo}
            </div> : <div className="bg-red-500 px-3 py-[5px] text-white rounded-xl">
                {row.issueNo}
            </div>,
            center: true,
        },
        {
            name: 'Date',
            width: "130px",
            selector: row => row.issueDate,
        },
        {
            name: 'Stone Detail',
            width: "250px",
            selector: row => row.stoneDetailCode,
        },
        {
            name: 'Quantity',
            width: "80px",
            selector: row => row.qty,
            center: "true"
        },
        {
            name: 'Weight',
            width: "80px",
            selector: row => row.weight,
            center: "true"

        },
        {
            name: 'Unit',
            width: "80px",
            selector: row => row.unitCode,
            center: "true"
        },
        {
            name: 'Unit Price',
            width: "130px",
            selector: row => row.unitPrice,
            right: "true",
        },
        {
            name: 'Total Price',
            width: "130px",
            selector: row => row.totalPrice,
            right: "true",
        },
        {
            name: 'Agents',
            width: "300px",
            selector: row => row.issueMember,
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
        {
            name: 'Updated At',
            width: "200px",
            selector: row => row.updatedAt,
        },
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
                    {
                        issuePermission?.delete ? (
                            <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.issueNo)}><FaTrashCan /></Button>
                        ) : null
                    }
                </div>
            )
        },
    ];

    const returnColumn = [
        {
            name: "Return No",
            width: "110px",
            selector: row => row.returnNo,
        },
        {
            name: "Stone Detail",
            width: "180px",
            selector: row => row.stoneDetail.stoneDesc,
        },
        {
            name: "Qty",
            selector: row => row.qty,
            right: true,
        },
        {
            name: "Weight",
            selector: row => row.weight,
            right: true,
        },
        // {
        //     name: "Amount",
        //     selector: row => row.totalPrice.toLocaleString('en-us'),
        //     right: true,
        // },
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
            issueMember: issueData.issueMember.map(el => {
                return `${el.customer.customerName}, `
            }),
            remark: issueData.remark,
            status: issueData.status,
            isComplete: issueData.isComplete,
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
        {
            permissions !== null && permissions !== undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError} isWarning={alertMsg.isWarning} /> : ""
                        }
                    </div>
                    <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                        <Typography variant="h5">
                            Issue List
                        </Typography>
                        {
                            issuePermission?.create ? (
                                <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2" onClick={handleOpen}>
                                    <FaPlus /> Create New
                                </Button>
                            ) : null
                        }
                    </div>
                    <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                        <CardBody className="rounded-sm overflow-auto p-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 py-2">
                                <div>
                                    <label className="text-black text-sm mb-2">Status</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={filterData.status}
                                        onChange={(e) => {
                                            setFilterData({
                                                ...filterData,
                                                skip: 0,
                                                take: 10,
                                                status: e.target.value
                                            })
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="A">All</option>
                                        <option value="O">Open</option>
                                        <option value="C">Close</option>
                                        <option value="V">Void</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-black text-sm mb-2">Selection Complete</label>
                                    <select 
                                        className="block w-full text-black border border-blue-gray-200 h-[35px] px-2.5 py-1.5 rounded-md focus:border-black"
                                        value={filterData.isComplete}
                                        onChange={(e) => {
                                            setFilterData({
                                                ...filterData,
                                                skip: 0,
                                                take: 10,
                                                isComplete: e.target.value
                                            })
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="A">All</option>
                                        <option value="F">In Progress</option>
                                        <option value="T">Complete</option>
                                    </select>
                                </div>
                                <div className="">
                                    <label className="text-black mb-2 text-sm">Start Date</label>
                                    <input
                                        type="date"
                                        value={filterData.start_date == null ? '' : filterData.start_date}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            // if (filterData.start_date !== "") {
                                            //     if(moment(e.target.value) > moment(filterData.start_date)) {
                                            //         console.log(e.target.value)
                                            //         // setAlert({
                                            //         //     isAlert: true,
                                            //         //     message: "Start Date cannot be greater than End Date.",
                                            //         //     isWarning: true,
                                            //         //     title: "Warning"
                                            //         // });
                                            //         // setTimeout(() => {
                                            //         //     setAlert({
                                            //         //         isAlert: false,
                                            //         //         message: '',
                                            //         //         isWarning: false,
                                            //         //         title: ''
                                            //         //     })
                                            //         // }, 2000);
                                            //     } else {
                                            //         setFilterData({
                                            //             ...filterData,
                                            //             skip: 0,
                                            //             take: 10,
                                            //             start_date: e.target.value,
                                            //         });
                                            //     }
                                            // } else {
                                                setFilterData({
                                                    ...filterData,
                                                    skip: 0,
                                                    take: 10,
                                                    start_date: e.target.value,
                                                });
                                                setCurrentPage(1);
                                            // }
                                        }}
                                    />
                                </div>
                                <div className="">
                                    <label className="text-black mb-2 text-sm">End Date</label>
                                    <input
                                        type="date"
                                        value={filterData.end_date == null ? '' : filterData.end_date}
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        onChange={(e) => {
                                            // if(filterData.end_date === "" || moment(e.target.value) < moment(filterData.end_date)) {
                                            //     // setAlert({
                                            //     //     isAlert: true,
                                            //     //     message: "Start Date cannot be greater than End Date.",
                                            //     //     isWarning: true,
                                            //     //     title: "Warning"
                                            //     // });
                                            //     // setTimeout(() => {
                                            //     //     setAlert({
                                            //     //         isAlert: false,
                                            //     //         message: '',
                                            //     //         isWarning: false,
                                            //     //         title: ''
                                            //     //     })
                                            //     // }, 2000);
                                                
                                            //     return; 
                                            // }
                                            setFilterData({
                                                ...filterData,
                                                skip: 0,
                                                take: 10,
                                                end_date: e.target.value,
                                            });
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-black mb-2 text-sm">Search</label>
                                    <input
                                        placeholder="Search" 
                                        type="text" 
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={filterData.search} onChange={(e) => {
                                            setFilterData({
                                                ...filterData,
                                                skip: 0,
                                                take: 10,
                                                search_word: e.target.value
                                            });
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>
    
                            <TableList columns={column} data={issueDataList} pending={dataLoad} />
    
    
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
                                        dataCount !== undefined ? (
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
                    <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} isLoading={removeResult.isLoading} closeModal={() => setOpenDelete(!openDelete)} />
                    <Dialog open={open} size="lg">
                        <DialogBody>
                            <ModalTitle titleName={isEdit ? "Edit Issue" : "Create Issue"} handleClick={() => setOpen(!open)} />
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError} isWarning={alertMsg.isWarning} /> : ""
                            }
                            <div className="grid grid-cols-4 gap-4 px-3 mb-3">
                                <div className="col-span-2 grid grid-cols-2 gap-2 h-fit">
                                    {
                                        isEdit? 
                                            <div className="">
                                                <label className="text-black mb-2 text-sm">Issue No</label>
                                                <input
                                                    type="text"
                                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                                    value={formData.issueNo}
                                                    readOnly={isEdit}
                                                />
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
                                    <div className="col-span-2 grid grid-cols-3 gap-2">
                                        {/* Stone Details */}
                                        <div className="col-span-3">
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
                                                        if(stoneDetail.isActive) {
                                                            return <option value={stoneDetail.stoneDetailCode} key={stoneDetail.stoneDetailCode} >{stoneDetail.stoneDesc} ({stoneDetail.supplier.supplierName})</option>
                                                        }
                                                    })
                                                }
                                            </select>
                                            {
                                                validationText.stoneDetailCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.stoneDetailCode}</p>
                                            } 
                                        </div>
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
                                                    let weight = parseFloat(e.target.value === "" ? 0 : e.target.value);
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
                                            readOnly
                                        />
                                    </div>
                                    {/* Total Price */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Total Price</label>
                                        <input
                                            type="text"
                                            className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black text-end"
                                            value={formData.totalPrice.toLocaleString('en')}
                                            onChange={(e) => {
                                                let totalP = Number(e.target.value === "" ? 0 : e.target.value.replace(/[^0-9]/g, ""));
                                                let price = totalP / formData.weight;
                                                setFormData({
                                                    ...formData,
                                                    unitPrice: Number(price.toFixed(2)),
                                                    totalPrice: totalP
                                                });
                                            }}
                                            onFocus={(e) => focusSelect(e)}
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
                                <div className="col-span-2 grid grid-cols-3 h-fit gap-2">
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
                                    <div className="col-span-3 mt-2">
                                        <Card className="w-full shadow-sm border border-blue-gray-200 rounded-md">
                                            <CardBody className="overflow-auto rounded-md p-0">
                                            <DataTable 
                                                columns={customerColumn} 
                                                data={tBodyData}
                                                fixedHeader
                                                fixedHeaderScrollHeight="150px"
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
                                        {
                                            validationText.issueMember && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.issueMember}</p>
                                        }
                                    </div>
                                    {/* Return table list */}
                                    <div className="col-span-3 mt-2">
                                        <Card className="w-full shadow-sm border border-blue-gray-200 rounded-md">
                                            <CardBody className="overflow-auto rounded-md p-0">
                                                <Typography variant="h6" className="px-2 ml-3 mt-2 border-l-2 border-purple-700 text-black rounded-md">
                                                    Returns
                                                </Typography>
                                                <DataTable 
                                                columns={returnColumn} 
                                                data={tBodyReturnData} 
                                                fixedHeader
                                                fixedHeaderScrollHeight="150px"
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
                                    isEdit? (
                                        issuePermission?.update ? (
                                            <Button onClick={handleUpdate} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2" disabled={updateResult.isLoading}>
                                                {
                                                    updateResult.isLoading? <ButtonLoader /> : <FaFloppyDisk className="text-base" /> 
                                                }
                                                <Typography variant="small" className="capitalize">
                                                    Update
                                                </Typography>
                                            </Button>
                                        ) : null
                                    ) :
                                    <>
                                        <Button 
                                            onClick={() => {
                                                handleSubmit();
                                                setAlertMsg({
                                                    ...alertMsg,
                                                    isNew: false
                                                });
                                            }} 
                                            color="deep-purple" size="sm" variant="gradient" 
                                            className="flex items-center gap-2"
                                            disabled={addResult.isLoading}
                                        >
                                            {
                                                addResult.isLoading && !alertMsg.isNew ? <ButtonLoader /> : <FaFloppyDisk className="text-base" /> 
                                            } 
                                            <Typography variant="small" className="capitalize">
                                                Save
                                            </Typography>
                                        </Button>
                                        <Button 
                                            onClick={() => {
                                                handleSave();
                                                setAlertMsg({
                                                    ...alertMsg,
                                                    isNew: true
                                                });
                                            }}
                                            color="deep-purple" size="sm" variant="outlined" 
                                            className="flex items-center gap-2"
                                            disabled={addResult.isLoading}
                                        >
                                            {
                                                addResult.isLoading && alertMsg.isNew ? <ButtonLoader isNew={true} /> : <FaCirclePlus className="text-base" />
                                            }
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
            ) : <div>Loading...</div>
        }
        </>
    );
}

export default IssueList;