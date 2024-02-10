/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Input, Typography } from "@material-tailwind/react";
import { FaCirclePlus, FaFloppyDisk, FaMagnifyingGlass } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useAddWalletMutation, useFetchTrueShareQuery, useFetchWalletCountQuery, useFetchWalletQuery, useRemoveWalletMutation, useUpdateWalletMutation, } from "../store";
import Pagination from "../components/pagination";
import DeleteModal from "../components/delete_modal";
import SectionTitle from "../components/section_title";
import ModalTitle from "../components/modal_title";
import moment from "moment";
import TableList from "../components/data_table";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { AuthContent } from "../context/authContext";
import SuccessAlert from "../components/success_alert";
import { pause } from "../const";
import ButtonLoader from "../components/buttonLoader";

const validator = require('validator');

function WalletList() {

    const { permissions } = useContext(AuthContent);

    const [walletPermission, setWalletPermission] = useState(null);

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
        isNew: false,
    });

    const {data, refetch, isLoading: dataLoad} = useFetchWalletQuery(filterData);

    const navigate = useNavigate();

    useEffect(() => {
        setWalletPermission(permissions[8]);
        refetch();
        if(walletPermission?.view == false) {
            navigate('/403');
        }
    }, [permissions, walletPermission, navigate, data])
    
    const {data: dataCount} = useFetchWalletCountQuery(filterData);

    const {data: shareData} = useFetchTrueShareQuery();

    const [addWallet, addResult] = useAddWalletMutation();

    const [editWallet] = useUpdateWalletMutation();

    const [removeWallet] = useRemoveWalletMutation();

    const auth = useAuthUser();

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [ currentPage, setCurrentPage] = useState(1);

    const resetData = {
        id: uuidv4(),
        walletName: "",
        shareCode: 0,
        balance: 0,
        createdAt: moment().toISOString(),
        createdBy: auth().username,
    }

    const [ formData, setFormData ] = useState(resetData);

    const [deleteId] = useState('');

    const [validationText, setValidationText] = useState({});

    useEffect(() => {
        refetch();
    }, [data]);

    const openModal = () => {
        setIsEdit(false);
        setFormData(resetData)
        setOpen(!open);
        setValidationText({});
    };

    function validateForm() {
        const newErrors = {};

        if(validator.isEmpty(formData.walletName)) {
            newErrors.walletName = 'Wallet Name is required.'
        }

        if(formData.shareCode === 0) {
            newErrors.shareCode = 'Share Name is required.'
        }

        setValidationText(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(isNew = true) {
        if(validateForm()){
            const saveData = {
                id: formData.id,
                walletName: formData.walletName,
                shareCode: formData.shareCode,
                balance: formData.balance,
                createdAt: formData.createdAt,
                createdBy: formData.createdBy,
                updatedAt: moment().toISOString(),
                updatedBy: isEdit ? auth().username : "",
            }
            if(isEdit) {
                saveData.id = formData.id
            }
            isEdit ? await editWallet(saveData).then(async(res) => {
                if(res.data) {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Wallet updated successfully.",
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
                setOpen(isNew);
                setFormData(resetData);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            }) : await addWallet(saveData).then(async(res) => {
                console.log(res);
                if(res.error.data === "Success") {
                    setAlertMsg({
                        ...alertMsg,
                        visible: true,
                        title: "Success",
                        message: "Wallet created successfully.",
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
                setOpen(isNew);
                setFormData(resetData);
                await pause();
                setAlertMsg({
                    ...alertMsg,
                    visible: false,
                });
            });
        }
    }

    async function handleDelete() {
        await removeWallet(deleteId).then(async(res) => {
            if(res.data) {
                setAlertMsg({
                    ...alertMsg,
                    visible: true,
                    title: "Success",
                    message: "Wallet deleted successfully.",
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
    }

    const column = [
        // {
        //     name: 'Status',
        //     width: "150px",
        //     center: "true",
        //     cell: row => (
        //         <div className={`w-[90px] flex items-center justify-center text-white h-7 rounded-full ${row.status ? 'bg-green-500' : 'bg-red-500' } `}>
        //             {
        //                 row.status ? 'Active' : 'Inactive'
        //             }
        //         </div>
        //     ),
        // },
        {
            name: "Balance",
            width: "150px",
            selector: row => row.balance,
            right: true,
        },
        {
            name: 'Name',
            width: "300px",
            selector: row => row.walletName,
            
        },
        {
            name: "Share Name",
            selector: row => row.shareCode
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
        // {
        //     name: 'Action',
        //     fixed: 'right',
        //     center: "true",
        //     width: "150px",
        //     cell: (row) => (
        //         <div className="flex items-center gap-2">
        //             {/* <div className="border-r border-gray-400 pr-2">
        //                 <Switch color="deep-purple" defaultChecked={row.status} id={row.categoryCode} onChange={(e) => changeStatus(e.target.checked, row.categoryCode)} />
        //             </div> */}
        //             <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleEdit(row.id)}><FaPencil /></Button>
        //             <Button variant="text" color="red" className="p-2" onClick={() => {
        //                 setDeleteId(row.id);
        //                 setOpenDelete(true);
        //             }}><FaTrashCan /></Button>
        //         </div>
        //     )
        // },
    ];

    const tbodyData = data?.map((wallet) => {
        return {
            id: wallet.id,
            walletName: wallet.walletName,
            shareCode: wallet.share.shareName,
            balance: wallet.balance.toLocaleString('en-US'),
            createdAt: moment(wallet.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            createdBy: wallet.createdBy,
            updatedAt: moment(wallet.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            updatedBy: wallet.updatedBy,
        }
    });

    return(
        <>
        {
            walletPermission != null && walletPermission != undefined ? (
                <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                    <div className="w-78 absolute top-0 right-0 z-[9999]">
                        {
                            alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                        }
                    </div>
                    <SectionTitle title="Wallet List" handleModal={openModal} permission={walletPermission?.create}/>
                    <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t mb-5">
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
                            {
                                alertMsg.visible? <SuccessAlert title={alertMsg.title} message={alertMsg.message} isError={alertMsg.isError}  /> : ""
                            }
                            <ModalTitle titleName={isEdit ? "Edit Wallet" : "Wallet"} handleClick={openModal} />
                            <div  className="grid grid-cols-2 gap-4">
                                {/* <Switch label="Active" color="deep-purple" defaultChecked /> */}
                                {/* Share Name */}
                                <div className="">
                                    <label className="text-black mb-2 text-sm">Share Name</label>
                                    <select
                                        className="block w-full px-2.5 py-1.5 border border-blue-gray-200 h-[35px] rounded-md focus:border-black text-black"
                                        value={formData.shareCode} 
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            shareCode: Number(e.target.value),
                                        })}
                                    >
                                        <option value="0" disabled>Select Share</option>
                                        {
                                            shareData?.map((share) => {
                                                return <option value={share.shareCode} key={share.shareCode}>{share.shareName}</option>
                                            })
                                        }
                                    </select>
                                        
                                    {
                                        validationText.shareCode && <p className="block text-[12px] text-red-500 font-sans mb-2">{validationText.shareCode}</p>
                                    }
                                </div>
                                {/* Wallet Id */}
                                <div>
                                    <label className="text-black text-sm mb-2">Wallet Name</label>
                                    <input
                                        type="text"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.walletName}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                walletName: e.target.value
                                            });
                                        }}
                                    />
                                    {
                                        validationText.walletName && <p className="block text-[12px] text-red-500 font-sans">{validationText.walletName}</p>
                                    }
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                {/* Balance */}
                                {/* <div>
                                    <label className="text-black text-sm mb-2">Balance</label>
                                    <input
                                        type="number"
                                        className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                        value={formData.balance}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                balance: parseFloat(e.target.value)
                                            });
                                        }}
                                    />
                                    {
                                        validationText.balance && <p className="block text-[12px] text-red-500 font-sans">{validationText.balance}</p>
                                    }
                                </div> */}
                            </div>
                            <div className="flex items-center justify-end mt-6 gap-2">
                                {
                                    !isEdit ? (
                                        <>
                                            <Button 
                                                onClick={() => {
                                                    handleSubmit(false);
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
                                                    handleSubmit();
                                                    setAlertMsg({
                                                        ...alertMsg,
                                                        isNew: true
                                                    })
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
                                    ) : (
                                        walletPermission?.update ? (
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
                        </DialogBody>                      
                    </Dialog>
                    <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleDelete} closeModal={() => setOpenDelete(!openDelete)} />
                </div>
            ) : null
        }
        </>
    );

}

export default WalletList;