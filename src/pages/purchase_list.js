/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Dialog, DialogBody, Typography } from "@material-tailwind/react";
import { FaEye, FaPencil, FaPlus, FaTrashCan, } from "react-icons/fa6";
import { useState } from "react";
import { pause } from "../const";
import { useFetchTruePurchaseQuery, useRemovePurchaseMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { Link } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import ModalTitle from "../components/modal_title";

function PurchaseList() {

    const auth = useAuthUser;

    const [open, setOpen] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const { data } = useFetchTruePurchaseQuery();

    const [viewData, setViewData] = useState({});

    const [removePurchase, removeResult] = useRemovePurchaseMutation();

    const [deleteId, setDeleteId] = useState('');

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removePurchase({
            id: removeData[0].invoiceNo,
            deletedAt: moment().toISOString(),
            deletedBy: auth().username
        }).then((res) => { console.log(res) });
        setIsAlert(true);
        setOpenDelete(!openDelete);
        await pause(2000);
        setIsAlert(false);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const handleView = (id) => {
        let tempData = data.find(res => res.invoiceNo === id);
        console.log(tempData);
        setViewData(tempData);
        setOpen(!open);
    }

    const column = [
        {
            name: 'Invoice No',
            width: '200px',
            selector: row => row.Code,
            omit: true
        },
        {
            name: 'Date',
            width: "150px",
            selector: row => row.PurDate,

        },
        {
            name: 'Supplier',
            width: "200px",
            selector: row => row.Supplier,

        },
        {
            name: 'Sub Total',
            width: "150px",
            selector: row => row.SubTotal,

        },
        {
            name: 'Discount Amt',
            width: "150px",
            selector: row => row.DiscAmt,

        },
        {
            name: 'Grand Total',
            width: "150px",
            selector: row => row.GrandTotal,

        },
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
            center: true,
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {/* <Link to={`/purchase_edit/${row.Code}`}>
                        <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
                    </Link> */}
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => handleView(row.Code)}><FaEye /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((purchaseData) => {
        return {
            Code: purchaseData.invoiceNo,
            PurDate: moment(purchaseData.purDate).format("YYYY-MM-DD"),
            Supplier: purchaseData.supplier.supplierName,
            SubTotal: purchaseData.subTotal.toLocaleString('en-US'),
            DiscAmt: purchaseData.discAmt.toLocaleString('en-US'),
            GrandTotal: purchaseData.grandTotal.toLocaleString('en-US'),
            Remark: purchaseData.remark,
            CreatedAt: moment(purchaseData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: purchaseData.createdBy,
            UpdatedAt: moment(purchaseData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: purchaseData.updatedBy,
            Status: purchaseData.status,
        }
    });

    return (
        <>
            <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
                <div className="w-78 absolute top-0 right-0 z-[9999]">
                    {
                        removeResult.isSuccess && isAlert && <SuccessAlert title="Purchase" message="Delete successful." handleAlert={() => setIsAlert(false)} />
                    }
                </div>
                <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                    <Typography variant="h5">
                        Purchase List
                    </Typography>
                    <Link to='/purchase_invoice'>
                        <Button variant="gradient" size="sm" color="deep-purple" className="flex items-center gap-2">
                            <FaPlus /> Create New
                        </Button>
                    </Link>
                </div>
                <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                    <CardBody className="rounded-sm overflow-auto p-0">
                        <TableList columns={column} data={tbodyData} />
                    </CardBody>
                </Card>
                <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
                <Dialog open={open} size="xl">
                    <DialogBody>
                        <ModalTitle titleName="Purchase Details" handleClick={() => setOpen(!open)} />
                        <div className="grid grid-cols-4 gap-2">
                            <div>
                                <label className="text-black mb-2 text-sm">Purchase Date</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={moment(viewData.purDate).format("YYYY-MM-DD hh:mm:ss a")}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-black mb-2 text-sm">Supplier Name</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={viewData.supplierCode}
                                    readOnly
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-black mb-2 text-sm">Remark</label>
                                <input
                                    type="text"
                                    className="border border-blue-gray-200 w-full h-[35px] px-2.5 py-1.5 rounded-md text-black"
                                    value={viewData.remark}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            
                        </div>
                    </DialogBody>
                </Dialog>
            </div>

        </>
    );

}

export default PurchaseList;
