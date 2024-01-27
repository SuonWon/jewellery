/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography, Input } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaPencil, FaMagnifyingGlass } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useFetchStoneDetailsQuery, useAddStoneDetailsMutation, useUpdateStoneDetailsMutation, useRemoveStoneDetailsMutation, useFetchUOMQuery, useFetchTrueBrightnessQuery, useFetchTrueStoneQuery, useFetchTrueGradeQuery, useFetchTrueTypeQuery, useFetchTrueSupplierQuery, useFetchPurchaseQuery, useUpdatePurchaseStatusMutation, useUpdatePurchaseMutation, useFetchTruePurchaseQuery, useFetchStoneDetailsCountQuery } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import SuccessAlert from "../components/success_alert";
import { apiUrl, focusSelect, sizeUnit } from "../const";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContent } from "../context/authContext";

const token = 'Bearer ' + Cookies.get('_auth');

const validator = require("validator");

function StoneDetails() {

    const auth = useAuthUser();

    const { permissions } = useContext(AuthContent);

    const [selectionPermission, setSelectionPermission] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setSelectionPermission(permissions[9]);

        if(selectionPermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, selectionPermission, navigate])

    const [filterData, setFilterData] = useState({
        skip: 0,
        take: 10,
        search: '',
        refetchOnMountOrArgChange: true
    });

    const purchaseFilter = {
        skip: 0,
        take: 0,
        status: 'O',
        isComplete: 'F',
        paidStatus: 'A',
        search_word: ''
    }

    // const {data, refetch} = useFetchStoneDetailsQuery({ refetchOnMountOrArgChange: true });
    const {data, refetch} = useFetchStoneDetailsQuery(filterData);
    const {data: dataCount} = useFetchStoneDetailsCountQuery(filterData);

    const {data: stoneData} = useFetchTrueStoneQuery();

    const {data: gradeData} = useFetchTrueGradeQuery();

    const {data: typeData} = useFetchTrueTypeQuery();

    const {data: unitData} = useFetchUOMQuery();

    const {data: brightData} = useFetchTrueBrightnessQuery();

    const {data: supplierData} = useFetchTrueSupplierQuery();

    const {data: purchaseData} = useFetchPurchaseQuery(purchaseFilter);

    const {data: truePurchaseData} = useFetchTruePurchaseQuery();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [openCombineStock, setOpenCombineStock] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [selectedPurchase, setSelectedPurchase] = useState([]);

    const [isSupplier, setIsSupplier] = useState(false);

    const [isCombined, setIsCombined] = useState(false);

    const [ currentPage, setCurrentPage] = useState(1);

    const [ alert, setAlert] = useState({
        isAlert: false,
        message: '',
        isWarning: false,
        isError: false,
        title: ""
    });

    const [selectOption, setSelectOption] = useState({
        isSelectAll: false,
        isUnselect: false,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const [description, setDescription] = useState({
        stoneDesc: "",
        brightDesc: "",
        gradeDesc: "",
        size: "",
        sizeUnit: "လုံးစီး",
    });

    const [addStoneDetail] = useAddStoneDetailsMutation();

    const [editStoneDetail] = useUpdateStoneDetailsMutation();

    const [removeStoneDetail] = useRemoveStoneDetailsMutation();

    const [updateStatus] = useUpdatePurchaseMutation();

    const [updatePStatus] = useUpdatePurchaseStatusMutation();

    const [deleteId, setDeleteId] = useState('');

    const [purchaseStatus, setPurchaseStatus] = useState(false);

    const [ validationText, setValidationText ] = useState({});

    const [purchase, setPurchase] = useState({});

    const [combineData, setCombineData] = useState([]);

    const stoneDetail = {
        stoneDesc: "",
        referenceNo: "",
        supplierCode: 0,
        stoneCode: 0,
        typeCode: 0,
        brightCode: 0,
        gradeCode: 0,
        size: 0,
        sizeUnit: "လုံးစီး",
        qty: 0,
        weight: 0,
        unitCode: "ct",
        purchasePrice: 0,
        remark: "",
        isActive: true,
        createdBy: auth().username,
        updatedBy: "",
    };

    const [formData, setFormData] = useState(stoneDetail);

    const openModal = () => {
        setIsEdit(false);
        setFormData(stoneDetail);
        setDescription({
            stoneDesc: "",
            brightDesc: "",
            gradeDesc: "",
            size: "",
            sizeUnit: "လုံးစီး",
        });
        setPurchaseStatus(false);
        setOpen(!open);
    };

    function validateForm() {
        const newErrors = {};

        // if(validator.isEmpty(formData.referenceNo.toString())) {
        //     newErrors.referenceNo = 'Reference No is required.';
        // }
        // if(formData.supplierCode === 0) {
        //     newErrors.supplierCode = 'Supplier name is required.'
        // }
        if(formData.stoneCode === 0) {
            newErrors.stoneDesc = 'Stone Description is required.'
        } 
        if(formData.brightCode === 0) {
            newErrors.brightDesc = 'Bright Description is required.'
        }
        if(formData.gradeCode === 0) {
            newErrors.gradeDesc = 'Grade Description is required.'
        }
        if(formData.typeCode === 0) {
            newErrors.typeDesc = 'Type Description is required.'
        }
        if(validator.isEmpty(formData.unitCode.toString())) {
            newErrors.unitDesc = 'Unit is required.'
        }
        if(formData.size === 0) {
            newErrors.size = 'Size is required.'
        }
        // if(formData.qty === 0) {
        //     newErrors.qty = 'Quantity is required.'
        // }
        // if(formData.weight === 0) {
        //     newErrors.weight = 'Weight is required.'
        // }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
        if(validateForm()) {
            console.log(formData);
            try {
                console.log("Ji");
                addStoneDetail({
                    ...formData,
                    stoneDesc: `${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`,
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
                if (purchaseStatus) {
                    updatePStatus({
                        id: formData.referenceNo,
                        updatedBy: auth().username,
                    });
                }
                setPurchaseStatus(false);
                setFormData(stoneDetail);
                setOpen(!open);
                
            }
            catch(err) {
                console.log(err.statusCode);
                
            }
        }
    };

    const onSaveSubmit = () => {
        if (validateForm()) {
            try {
                addStoneDetail({
                    ...formData,
                    stoneDesc: `${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`,
                }).then((res) => {

                    if(res.error != null) {
                        setOpen(!open);
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
                if (purchaseStatus) {
                    updatePStatus({
                        id: formData.referenceNo,
                        updatedBy: auth().username,
                    });
                }
                setPurchaseStatus(false);
                setFormData(stoneDetail);
                setDescription({
                    stoneDesc: "",
                    brightDesc: "",
                    gradeDesc: "",
                    size: "",
                    sizeUnit: "လုံးစီး",
                });
            }
            catch(err) {
                console.log(err.statusCode);
            }
            
        }
    };

    const handleEdit = async (id) => {
        let eData = data.find((stoneDetail) => stoneDetail.stoneDetailCode === id);
        let tempPurchase = purchaseData.find(res => res.invoiceNo === eData.referenceNo);
        if(tempPurchase) {
            setPurchase({
                invoiceNo: tempPurchase.invoiceNo,
                purDate: tempPurchase.purDate,
                supplierCode: tempPurchase.supplierCode,
                stoneCode: tempPurchase.stoneCode,
                qty: tempPurchase.qty,
                totalWeight: tempPurchase.totalWeight,
                unitCode: tempPurchase.unitCode,
                unitPrice: tempPurchase.unitPrice,
                subTotal: tempPurchase.subTotal,
                servicePer: tempPurchase.servicePer,
                serviceCharge: tempPurchase.serviceCharge,
                discAmt: tempPurchase.discAmt,
                grandTotal: tempPurchase.grandTotal,
                remark: tempPurchase.remark,
                paidStatus: tempPurchase.paidStatus,
                status: tempPurchase.status,
                isComplete: tempPurchase.isComplete,
                createdBy: tempPurchase.createdBy,
                createdAt: tempPurchase.createdAt,
                updatedBy: tempPurchase.updatedBy,
                updatedAt: tempPurchase.updatedAt,
                deletedBy: tempPurchase.deletedBy,
                purchaseShareDetails: tempPurchase.purchaseShareDetails.map(el => {
                    return {
                        id: el.id,
                        lineNo: el.lineNo,
                        shareCode: el.shareCode,
                        sharePercentage: el.sharePercentage,
                        amount: el.amount,
                    }
                }),
            });
            setPurchaseStatus(tempPurchase.isComplete);
            setIsCombined(false);
        } else {
            setIsCombined(true);
        }
        setIsEdit(true);
        setFormData(eData);
        setDescription({
            stoneDesc: eData.stone.stoneDesc,
            brightDesc: eData.stoneBrightness.brightDesc,
            gradeDesc: eData.stoneGrade.gradeDesc,
            size: eData.size,
            sizeUnit: eData.sizeUnit,
        });
        setOpen(!open);
    };

    const submitEdit = async () => {
        if(validateForm()) {
            editStoneDetail({
                stoneDetailCode: formData.stoneDetailCode,
                referenceNo: formData.referenceNo,
                supplierCode: formData.supplierCode,
                stoneDesc: `${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`,
                stoneCode: formData.stoneCode,
                typeCode: formData.typeCode,
                brightCode: formData.brightCode,
                gradeCode: formData.gradeCode,
                size: formData.size,
                sizeUnit: formData.sizeUnit,
                qty: formData.qty,
                weight: formData.weight,
                unitCode: formData.unitCode,
                remark: formData.remark,
                isActive: formData.isActive,
                purchasePrice: formData.purchasePrice,
                createdBy: formData.createdBy,
                updatedBy: auth().username,
            }).then((res) => {
                console.log(res);
            });
            if(purchaseStatus !== purchase.isComplete && formData.referenceNo !== "") {
                console.log(purchaseStatus);
                updateStatus({
                    ...purchase,
                    isComplete: purchaseStatus,
                    updatedBy: auth().username,
                }).then((res) => {
                    console.log(res);
                });
            }
            setOpen(!open);
        }
    };

    const handleChange = async (e) => {
        let stoneDetail = data.find((stone) => stone.stoneDetailCode == e.target.id);
        await editStoneDetail({
            stoneDetailCode: stoneDetail.stoneDetailCode,
            referenceNo: stoneDetail.referenceNo,
            supplierCode: stoneDetail.supplierCode,
            stoneDesc: stoneDetail.stoneDesc,
            stoneCode: stoneDetail.stoneCode,
            typeCode: stoneDetail.typeCode,
            brightCode: stoneDetail.brightCode,
            gradeCode: stoneDetail.gradeCode,
            size: stoneDetail.size,
            sizeUnit: stoneDetail.sizeUnit,
            qty: stoneDetail.qty,
            weight: stoneDetail.weight,
            unitCode: stoneDetail.unitCode,
            remark: stoneDetail.remark,
            isActive: e.target.checked ? true: false,
            createdBy: stoneDetail.createdBy,
            updatedBy: auth().username,
        }).then((res) => {
            console.log(res);
        });

    };

    const handleRemove = async (id) => {
        removeStoneDetail(id).then((res) => {console.log(res)});
        setOpenDelete(!openDelete);
    };

    // const handleDeleteBtn = (id) => {
    //     setDeleteId(id);
    //     setOpenDelete(!openDelete);
    // };

    const openCombineModal = (id) => {
        let temp = data.find(res => res.stoneDetailCode === id);
        axios.get(`${apiUrl}/stone-detail/get-same-stone-details?stoneCode=${temp.stoneCode}&typeCode=${temp.typeCode}&brightCode=${temp.brightCode}&gradeCode=${temp.gradeCode}&size=${temp.size}&sizeUnit=${temp.sizeUnit}`, {
            headers: {
                "Authorization": token
            }
        }).then((res) => {
            setCombineData(
                res.data.map(el => {
                    return {
                        stoneDetailCode: el.stoneDetailCode,
                        referenceNo: el.referenceNo,
                        supplierCode: el.supplierCode,
                        supplierName: el.supplier.supplierName,
                        stoneDesc: el.stoneDesc,
                        stoneCode: el.stoneCode,
                        typeCode: el.typeCode,
                        brightCode: el.brightCode,
                        gradeCode: el.gradeCode,
                        size: el.size,
                        sizeUnit: el.sizeUnit,
                        unitCode: el.unitCode,
                        qty: el.qty,
                        weight: el.weight,
                        isActive: el.isActive,
                        remark: el.remark,
                        createdBy: el.createdBy,
                        createdAt: el.createdAt,
                        selectedStone: el.stoneDetailCode === id ? true : false,
                        isSelected: el.stoneDetailCode === id ? true : false,
                    }
                })
            );
        });
        setSelectOption({
            isSelectAll: false,
            isUnselect: false
        })
        setOpenCombineStock(!openCombineStock);
    };

    const handleCombine = async () => {
        let saveData = combineData.filter(res => res.isSelected);
        if (saveData.length > 1) {
            let combinedStone = {
                referenceNo: "",
                stoneDesc: "",
                supplierCode: 0,
                stoneCode: 0,
                typeCode: 0,
                brightCode: 0,
                gradeCode: 0,
                size: 0,
                sizeUnit: "လုံးစီး",
                qty: 0,
                weight: 0,
                unitCode: "ct",
                remark: "",
                isActive: true,
                createdBy: auth().username,
                updatedBy: "",
            };
            saveData.map(el => {
                
                if(el.selectedStone) {
                    combinedStone = {
                        ...combinedStone,
                        stoneDesc: el.stoneDesc,
                        supplierCode: el.supplierCode,
                        stoneCode: el.stoneCode,
                        typeCode: el.typeCode,
                        brightCode: el.brightCode,
                        gradeCode: el.gradeCode,
                        size: el.size,
                        sizeUnit: el.sizeUnit,
                    }
                }
                combinedStone.referenceNo += `${el.referenceNo}, `;
                combinedStone.qty += el.qty;
                combinedStone.weight += el.weight;
            });
            await addStoneDetail(combinedStone)
            .then((res) => {
                console.log(res.data);
                if(res.error == null) {
                    console.log("Hello");
                    saveData.map(el => {
                        console.log(el);
                        editStoneDetail({
                            stoneDetailCode: el.stoneDetailCode,
                            referenceNo: el.referenceNo,
                            supplierCode: el.supplierCode,
                            stoneDesc: el.stoneDesc,
                            stoneCode: el.stoneCode,
                            typeCode: el.typeCode,
                            brightCode: el.brightCode,
                            gradeCode: el.gradeCode,
                            size: el.size,
                            sizeUnit: el.sizeUnit,
                            qty: el.qty,
                            weight: el.weight,
                            unitCode: el.unitCode,
                            remark: el.remark,
                            isActive: false,
                            createdAt: el.createdAt,
                            createdBy: el.createdBy,
                            updatedBy: auth().username,
                            updatedAt: moment().toISOString(),
                        });
                    });
                }
            });
            setOpenCombineStock(!openCombineStock)
        }else {
            setAlert({
                isAlert: true,
                message: "Please select at least two items to continue.",
                isWarning: true,
                title: "Warning"
            });
            setTimeout(() => {
                setAlert({
                    isAlert: false,
                    message: '',
                    isWarning: false,
                    title: ''
                })
            }, 2000);
        }
    };

    const selectAll = () => {
        setCombineData(
            combineData.map(val => ({...val, isSelected: true}))
        )
    };

    const unselectAll = () => {
        setCombineData(
            combineData.map(val => ({...val, isSelected: val.selectedStone? true : false}))
        )
    };

    const column = [
        {
            name: 'Status',
            width: "130px",
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
            name: 'Reference No',
            width: '130px',
            selector: row => row.ReferenceNo,
        },
        {
            name: 'Description',
            width: '280px',
            selector: row => row.Description,
        },
        {
            name: 'Quantity',
            width: "80px",
            selector: row => row.Qty,

        },
        {
            name: 'Weight',
            width: "80px",
            selector: row => row.Weight,
        },
        {
            name: 'Purchase Price',
            width: '130px',
            selector: row => row.PurchasePrice,
            right: true,
        },
        {
            name: 'Sales Price',
            width: '130px',
            selector: row => row.SalesPrice,
            right: true,
        },
        {
            name: 'Profit',
            width: '130px',
            selector: row => row.Profit,
            right: true,
        },
        {
            name: 'Supplier Name',
            width: '200px',
            selector: row => row.SupplierName,
        },
        // {
        //     name: 'Size',
        //     width: "150",
        //     selector: row => row.Size,

        // },
        // {
        //     name: 'Size Unit',
        //     width: "150",
        //     selector: row => row.SizeUnit,

        // },
        // {
        //     name: 'Stone Description',
        //     width: "200px",
        //     selector: row => row.StoneDesc,

        // },
        // {
        //     name: 'Brightness',
        //     width: "150px",
        //     selector: row => row.BrightnessDesc,

        // },
        // {
        //     name: 'Grade',
        //     width: "150px",
        //     selector: row => row.GradeDesc,

        // },
        // {
        //     name: 'Type',
        //     width: "150px",
        //     selector: row => row.TypeDesc,
        // },
        // {
        //     name: 'Unit',
        //     width: "150px",
        //     selector: row => row.UnitDesc,
        // },
        {
            name: 'Remark',
            width: "200px",
            selector: row => row.Remark,
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
            width: "130px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {
                        selectionPermission?.update ? (
                            <>
                                <div className="border-r border-gray-400 pr-2">
                                    <div class="custom-checkbox">
                                        <input class="input-checkbox" checked={row.Status} id={row.Code} type="checkbox" onChange={handleChange} />
                                        <label for={row.Code}></label>
                                    </div>
                                </div>

                                <Button variant="text" color="teal" className="p-2" onClick={() => openCombineModal(row.Code)} disabled={row.Status? false : true}><FaCirclePlus /></Button>
                            </>
                        ) : null
                    }
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.Code)}><FaPencil /></Button>
                    {/* <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button> */}
                </div>
            )
        },
    ];

    const tbodyData = data?.map((stoneDetail) => {
        return {
            Code: stoneDetail.stoneDetailCode,
            ReferenceNo: stoneDetail.referenceNo,
            SupplierName: stoneDetail.supplier.supplierName,
            Description: stoneDetail.stoneDesc,
            StoneDesc: stoneDetail.stone.stoneDesc,
            BrightnessDesc: stoneDetail.stoneBrightness.brightDesc,
            GradeDesc: stoneDetail.stoneGrade.gradeDesc,
            TypeDesc: stoneDetail.stoneType.typeDesc,
            Size: stoneDetail.size,
            SizeUnit: stoneDetail.sizeUnit,
            Qty: stoneDetail.qty,
            Weight: stoneDetail.weight,
            UnitDesc: stoneDetail.unitCode,
            CreatedAt: moment(stoneDetail.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: stoneDetail.createdBy,
            UpdatedAt: moment(stoneDetail.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: stoneDetail.updatedBy,
            Remark: stoneDetail.remark,
            Status: stoneDetail.isActive,
            PurchasePrice: stoneDetail.purchasePrice.toLocaleString('en-US'),
            SalesPrice: stoneDetail.salesPrice.toLocaleString('en-US'),
            Profit: stoneDetail.profit.toLocaleString('en-US'),
        }
    });

    const combineColumn = [
        {
            name: '',
            center: "true",
            width: "70px",
            cell: (row) => (
                <input 
                    type="checkbox" 
                    className="border border-blue-gray-200 w-[20px] h-[20px] py-1.5 rounded-md text-black"
                    checked={row.isSelected}
                    disabled={row.selectedStone}
                    onChange={(e) => {
                        setSelectOption({
                            isSelectAll: false,
                            isUnselect: false,
                        })
                        setCombineData(combineData.map((el) => {
                            if (el.stoneDetailCode === row.stoneDetailCode) {
                                el.isSelected = e.target.checked;
                                return el;
                            } else {
                                return el;
                            }
                        }))
                    }}
                />
            )
        },
        {
            name: 'Quantity',
            width: "100px",
            selector: row => row.qty,
            right: true,

        },
        {
            name: 'Weight',
            width: "150px",
            selector: row => row.weight,
            right: true,
        },
        {
            name: 'Description',
            width: '280px',
            selector: row => row.description,
        },
        {
            name: 'Reference No',
            width: '150px',
            selector: row => row.referenceNo,
        },
        {
            name: 'Supplier Name',
            width: '200px',
            selector: row => row.supplierName,
        },
    ];

    const tCombineData = combineData.map((stoneDetail) => {
        return {
            stoneDetailCode: stoneDetail.stoneDetailCode,
            referenceNo: stoneDetail.referenceNo,
            supplierName: stoneDetail.supplierName,
            description: stoneDetail.stoneDesc,
            qty: stoneDetail.qty,
            weight: stoneDetail.weight,
            selectedStone: stoneDetail.selectedStone,
            isSelected: stoneDetail.isSelected,
        }
    });

    return(
        <>
        {
            selectionPermission != null && selectionPermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <SectionTitle title="Stone Details" handleModal={openModal} permission={selectionPermission?.create}/>
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alert.isAlert && <SuccessAlert title="Stone Details" message={alert.message} isError={true} />
                        }
                    </div>
                    <Card className="h-[auto] shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
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
                    <Dialog open={open} handler={openModal} size="lg">
                        <DialogBody>
                            <ModalTitle titleName={isEdit ? "Edit Stone Detail" : "Create Stone Detail"} handleClick={openModal} />
                            {
                                alert.isAlert? <SuccessAlert title={alert.title} message={alert.message} isWarning={alert.isWarning} /> : ""
                            }
                            <form  className="flex flex-col p-3 gap-4">
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="w-full col-span-2">
                                        <label className="text-black text-sm mb-2">Description</label>
                                        <input className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-md" value={`${description.stoneDesc} ${description.size}${description.sizeUnit} ${description.gradeDesc} ${description.brightDesc}`} disabled />
                                        {
                                            validationText.description && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.description}</p>
                                        }
                                    </div>
                                    {/* <div className="w-full col-span-2">
                                        <Input label="Name" value={`${description.stoneDesc} ${description.brightDesc} ${description.typeDesc}`} readOnly/>
                                        {
                                            validationText.customerName && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.customerName}</p>
                                        }
                                    </div> */}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Supplier Name */}
                                    <div>
                                        <label className="text-black text-sm mb-2">Supplier Name</label>
                                        <select 
                                            className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                            value={formData.supplierCode}
                                            onChange={(e) => {
                                                setIsSupplier(true);
                                                let selectP = truePurchaseData.filter(el => el.supplierCode === Number(e.target.value));
                                                setSelectedPurchase(selectP);
                                                setFormData({
                                                    ...formData,
                                                    supplierCode: Number(e.target.value),
                                                    referenceNo: "",
                                                });
                                            }}
                                        >
                                            <option value="0" disabled>Select supplier</option>
                                            {
                                                supplierData?.map((supplier) => {
                                                    return <option value={supplier.supplierCode} key={supplier.supplierCode}>{supplier.supplierName}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.supplierCode && <p className="block text-[12px] text-red-500 font-sans">{validationText.supplierCode}</p>
                                        }
                                    </div>
                                    {/* Reference No */}
                                    <div className="col-span-2 grid grid-cols-3 gap-2">
                                        <div className="col-span-2">
                                            <label className="text-black text-sm mb-2">Reference No</label>
                                            {
                                                isCombined? <input className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-md" value={formData.referenceNo} readOnly /> :
                                                <select 
                                                    className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                                    value={formData.referenceNo}
                                                    onChange={(e) => {
                                                        setFormData({...formData, referenceNo: e.target.value});
                                                    }}
                                                >
                                                    <option value="" disabled>Select...</option>
                                                    {
                                                        isSupplier?
                                                        selectedPurchase?.map((purchase) => {
                                                            if(!purchase.isComplete) {
                                                                return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo} ({purchase.supplier.supplierName}, {purchase.stone.stoneDesc})</option>
                                                            }
                                                        }) :
                                                        truePurchaseData?.map((purchase) => {
                                                            if(!purchase.isComplete) {
                                                                return <option value={purchase.invoiceNo} key={purchase.invoiceNo}>{purchase.invoiceNo} ({purchase.supplier.supplierName}, {purchase.stone.stoneDesc})</option>
                                                            }
                                                        })
                                                    }
                                                </select>
        
                                            }
                                        </div>
                                        <div className="">
                                            <label className="text-black text-sm mb-2">Purchase Complete</label>
                                            <div className="w-full">
                                                <input 
                                                    type="checkbox" 
                                                    className="border border-blue-gray-200 w-[20px] h-[20px] py-1.5 rounded-md text-black"
                                                    checked={purchaseStatus}
                                                    disabled={isCombined}
                                                    onChange={() => {
                                                        if (formData.referenceNo === "") {
                                                            setAlert({
                                                                isAlert: true,
                                                                message: "Please select reference no.",
                                                                isWarning: true,
                                                                title: "Warning"
                                                            });
                                                            setTimeout(() => {
                                                                setAlert({
                                                                    isAlert: false,
                                                                    message: '',
                                                                    isWarning: false,
                                                                    title: ''
                                                                })
                                                            }, 2000);
                                                        } else {
                                                            setPurchaseStatus(!purchaseStatus);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {/* <input className="border border-blue-gray-200 text-black w-full h-[40px] p-2.5 rounded-md" value={formData.referenceNo} disabled /> */}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <div>
                                        <label className="text-black text-sm mb-2">Type</label>
                                        <select 
                                            className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                            value={formData.typeCode}
                                            onChange={(e) => {
                                                setFormData({...formData, typeCode: Number(e.target.value)});
                                            }}
                                        >
                                            <option value="0" disabled>Select...</option>
                                            {
                                                typeData?.map((type) => {
                                                    return <option value={type.typeCode} key={type.typeCode}>{type.typeDesc}</option>
                                                })
                                            }
                                        </select>
                                        {
                                            validationText.typeDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.typeDesc}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="text-black text-sm mb-2">Stone Description</label>
                                        <select 
                                            className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                            value={formData.stoneCode}
                                            onChange={(e) => {
                                                setDescription({...description, stoneDesc: e.target.selectedOptions[0].text}); 
                                                setFormData({...formData, stoneCode: Number(e.target.value)});
                                            }}
                                        >
                                            <option value="0" disabled>Select...</option>
                                            {
                                                stoneData?.map((stone) => {
                                                    return <option value={stone.stoneCode} key={stone.stoneCode}>{stone.stoneDesc}</option>
                                                })
                                            }
                                        </select>
                                        {/* <Select 
                                            options={stoneOption} 
                                            isSearchable
                                            defaultValue={{value: formData.stoneCode, label: formData.stone === ""? "Select..." : formData.stone}}
                                            onChange={(e) => {
                                                setDescription({...description, stoneDesc: e.label}); 
                                                setFormData({...formData, stoneCode: Number(e.value)});
                                            }}
                                        /> */}
                                        {
                                            validationText.stoneDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.stoneDesc}</p>
                                        }
                                    </div>
                                    <div>
                                        <label className="text-black text-sm mb-2">Brightness</label>
                                        <select 
                                            className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                            value={formData.brightCode}
                                            onChange={(e) => {
                                                setDescription({...description, brightDesc: e.target.selectedOptions[0].text}); 
                                                setFormData({...formData, brightCode: Number(e.target.value)});
                                            }}
                                        >
                                            <option value="0" disabled>Select...</option>
                                            {
                                                brightData?.map((bright) => {
                                                    return <option value={bright.brightCode} key={bright.brightCode}>{bright.brightDesc}</option>
                                                })
                                            }
                                        </select>
                                        {/* <Select 
                                            options={brightOption} 
                                            isSearchable
                                            defaultValue={{value: formData.brightCode, label: formData.stone === ""? "Select..." : formData.bright}}
                                            onChange={(e) => {
                                                setDescription({...description, brightDesc: e.label}); 
                                                setFormData({...formData, brightCode: Number(e.value)});
                                            }}
                                        /> */}
                                        {
                                            validationText.brightDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.brightDesc}</p>
                                        }
                                    </div>
                                    
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <div>
                                        <label className="text-black text-sm mb-2">Grade</label>
                                        <select 
                                            className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                            value={formData.gradeCode}
                                            onChange={(e) => {
                                                setDescription({...description, gradeDesc: e.target.selectedOptions[0].text}); 
                                                setFormData({...formData, gradeCode: Number(e.target.value)});
                                            }}
                                        >
                                            <option value="0" disabled>Select...</option>
                                            {
                                                gradeData?.map((grade) => {
                                                    return <option value={grade.gradeCode} key={grade.gradeCode}>{grade.gradeDesc}</option>
                                                })
                                            }
                                        </select>
                                        {/* <Select 
                                            options={gradeOption} 
                                            isSearchable
                                            defaultValue={{value: formData.gradeCode, label: formData.grade === ""? "Select..." : formData.grade}}
                                            onChange={(e) => {
                                                setFormData({...formData, gradeCode: Number(e.value)});
                                            }}
                                        /> */}
                                        {
                                            validationText.gradeDesc && <p className="block text-[12px] text-red-500 font-sans">{validationText.gradeDesc}</p>
                                        }
                                    </div>
                                    <div className="col-span-2">
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="w-full">
                                                <label className="text-black text-sm mb-2">Size</label>
                                                <input 
                                                    type="number" 
                                                    className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" 
                                                    value={formData.size} 
                                                    onChange={(e) => {
                                                        setDescription({...description, size: Number(e.target.value)}); 
                                                        setFormData({...formData, size: Number(e.target.value)})
                                                    }}
                                                    onFocus={(e) => focusSelect(e)}
                                                />
                                                {
                                                    validationText.size && <p className="block text-[12px] text-red-500 font-sans">{validationText.size}</p>
                                                }
                                            </div>
                                            <div>
                                                <label className="text-black text-sm mb-2">Size Unit</label>
                                                <select 
                                                    className="block w-full text-sm text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                                    value={formData.sizeUnit}
                                                    onChange={(e) => {
                                                        setDescription({...description, sizeUnit: e.target.value});
                                                        setFormData({...formData, sizeUnit: e.target.value});
                                                    }}
                                                >
                                                    {
                                                        sizeUnit.map((el, index) => {
                                                            return <option value={el} key={index}>{el}</option>
                                                        })
                                                    }
                                                </select>
                                                {
                                                    validationText.sizeUnit && <p className="block text-[12px] text-red-500 font-sans">{validationText.sizeUnit}</p>
                                                }
                                            </div>
                                            <div>
                                                <label className="text-black text-sm mb-2">Qty</label>
                                                <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.qty} onChange={(e) => setFormData({...formData, qty: Number(e.target.value)})} readOnly={isEdit} onFocus={(e) => focusSelect(e)}/>
                                                {
                                                    validationText.qty && <p className="block text-[12px] text-red-500 font-sans">{validationText.qty}</p>
                                                }
                                            </div>
                                            <div>
                                                <label className="text-black text-sm mb-2">Weight</label>
                                                <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.weight} onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} readOnly={isEdit} onFocus={(e) => focusSelect(e)} />
                                                {
                                                    validationText.weight && <p className="block text-[12px] text-red-500 font-sans">{validationText.weight}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <div>
                                        <label className="text-black text-sm mb-2">Unit</label>
                                        <select 
                                            className="block w-full text-black p-2.5 border border-blue-gray-200 max-h-[2.5rem] rounded-md focus:border-black"
                                            value={formData.unitCode}
                                            onChange={(e) => {
                                                setFormData({...formData, unitCode: e.target.value});
                                            }}
                                        >
                                            <option value="" disabled>Select...</option>
                                            {
                                                unitData?.map((unit) => {
                                                    return <option value={unit.unitCode} key={unit.unitCode}>{unit.unitCode}</option>
                                                })
                                            }
                                        </select>
                                        {/* <Select 
                                            options={unitOption} 
                                            isSearchable
                                            defaultValue={{value: formData.unitCode, label: formData.unitCode}}
                                            onChange={(e) => {
                                                setFormData({...formData, unitCode: e.value});
                                            }}
                                        /> */}
                                        {
                                            validationText.unitDesc && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.unitDesc}</p>
                                        }
                                    </div>
                                    <div className="col-span-2">
                                        <div className="grid grid-cols-3 gap-2">
                                            {/* Purchase Price */}
                                            <div>
                                                <label className="text-black text-sm mb-2">Purchase Price</label>
                                                <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})} onFocus={(e) => focusSelect(e)}/>
                                            </div>
                                            {/* Sales Price */}
                                            <div>
                                                <label className="text-black text-sm mb-2">Sales Price</label>
                                                <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.salesPrice} readOnly/>
                                            </div>
                                            {/* Profit */}
                                            <div>
                                                <label className="text-black text-sm mb-2">Profit</label>
                                                <input type="number" className="border border-blue-gray-200 w-full h-[40px] p-2.5 rounded-md text-black" value={formData.profit} readOnly/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-black text-sm mb-2">Remark</label>
                                        <textarea
                                            className="border border-blue-gray-200 w-full px-2.5 py-1.5 rounded-md text-black"
                                            rows={1} 
                                            value={formData.remark} onChange={(e) => setFormData({...formData, remark: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-6 gap-2">
                                    {
                                        isEdit ? (
                                            selectionPermission?.update ? (
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
                            </form>
                        </DialogBody>
                    </Dialog>
                    <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                    <Dialog open={openCombineStock} handler={openCombineModal} size="lg">
                        <DialogBody>
                            <ModalTitle titleName="Stock Combination" handleClick={() => setOpenCombineStock(!openCombineStock)} />
                            {
                                alert.isAlert? <SuccessAlert title={alert.title} message={alert.message} isWarning={alert.isWarning} /> : ""
                            }
                            <Card className="max-h-[500px] max-w-screen-xxl shadow-none p-2 ">
                                <CardBody className="overflow-auto p-0">
                                    <div className="grid grid-cols-8 gap-1">
                                        <label htmlFor="selectAll" className="flex items-center justify-center gap-2 p-1 rounded-md hover:bg-gray-100" onClick={() => {
                                            setSelectOption({
                                                isSelectAll: true,
                                                isUnselect: false
                                            });
                                            selectAll();
                                        }}>
                                            <input 
                                                type="checkbox" 
                                                id="selectAll"
                                                name="selectAll"
                                                className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                                checked={selectOption.isSelectAll}
                                            />
                                            <span className="text-sm">Select All</span>
                                        </label>
                                        <label htmlFor="unselectAll" className="flex items-center justify-center gap-2 p-1 rounded-md hover:bg-gray-100" onClick={() => {
                                            setSelectOption({
                                                isSelectAll: false,
                                                isUnselect: true,
                                            });
                                            unselectAll();
                                        }}>
                                            <input 
                                                type="checkbox" 
                                                id="unselectAll"
                                                name="unselectAll"
                                                className="border border-blue-gray-200 w-[15px] h-[15px] py-1.5 rounded-md text-black"
                                                checked={selectOption.isUnselect}
                                            />
                                            <span className="text-sm">Unselect All</span>
                                        </label>
                                    </div>
                                    <DataTable 
                                        columns={combineColumn} 
                                        data={tCombineData} 
                                        fixedHeader
                                        fixedHeaderScrollHeight="400px"
                                        customStyles={{
                                            rows: {
                                                style: {
                                                    minHeight: '40px',
                                                },
                                            },
                                            headCells: {
                                                style: {
                                                    fontWeight: "bold",
                                                    fontSize: "0.9rem",
                                                    minHeight: '40px',
                                                }
                                            }
                                        }} 
                                    />
                                </CardBody>
                            </Card>
                                <div className="flex items-center justify-end">
                                    <Button onClick={handleCombine} color="deep-purple" size="sm" variant="gradient" className="flex items-center gap-2 mt-3">
                                        <FaCirclePlus className="text-base" />
                                        <Typography variant="small" className="capitalize">
                                            Combine
                                        </Typography>
                                    </Button>
                                </div>
                        </DialogBody>
                    </Dialog>
                </div>
            ) : <div>Loading...</div>
        }

        </>
    );

}

export default StoneDetails;
