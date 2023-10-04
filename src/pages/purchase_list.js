/* eslint-disable eqeqeq */
import { Button, Card, CardBody } from "@material-tailwind/react";
import { FaPencil, FaTrashCan,} from "react-icons/fa6";
import { useState } from "react";
import { useRemoveStoneDetailsMutation, useFetchPurchaseQuery, useFetchPurchaseByIdQuery } from "../store";
import { pause, currentDate } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import SectionTitle from "../components/section_title";
import moment from "moment";
import TableList from "../components/data_table";
import { Link, useNavigate } from "react-router-dom";

function PurchaseList() {

    const [openDelete, setOpenDelete] = useState(false);

    const navigate = useNavigate();

    const [isAlert, setIsAlert] = useState(true);

    const {data} = useFetchPurchaseQuery();

    const [removeStoneDetail, removeResult] = useRemoveStoneDetailsMutation();

    const [deleteId, setDeleteId] = useState('');

    const handleRemove = async (id) => {
        removeStoneDetail(id).then((res) => {console.log(res)});
        setIsAlert(true);
        setOpenDelete(!openDelete);
        await pause(2000);
        setIsAlert(false);
    };

    const handleDeleteBtn = (id) => {
        setDeleteId(id);
        setOpenDelete(!openDelete);
    };

    const editPurchase = async (id) => {
        let editPuData = data.filter((e) => e.invoiceNo === id);
        console.log(editPuData);
        navigate(`/purchase_edit/${editPuData}`);
    }

    const column = [
        {
            name: 'Invoice No',
            sortable: true,
            width: '200px',
            selector: row => row.Code,
        },
        {
            name: 'Date',
            sortable: true,
            width: "200px",
            selector: row => row.PurDate,

        },
        {
            name: 'Supplier',
            sortable: true,
            width: "200px",
            selector: row => row.Supplier,

        },
        {
            name: 'Sub Total',
            sortable: true,
            width: "150px",
            selector: row => row.SubTotal,

        },
        {
            name: 'Discount Amt',
            sortable: true,
            width: "150px",
            selector: row => row.DiscAmt,

        },
        {
            name: 'Grand Total',
            sortable: true,
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
            sortable: true
        },
        {
            name: 'Updated At',
            width: "200px",
            selector: row => row.UpdatedAt,
            sortable: true
        },
        {
            name: 'Action',
            center: true,
            width: "100px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button variant="text" color="deep-purple" className="p-2" onClick={() => editPurchase(row.Code)}><FaPencil /></Button>
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((purchaseData) => {
        return {
            Code: purchaseData.invoiceNo,
            PurDate: moment(purchaseData.purDate).format("YYYY-MM-DD hh:mm:ss a"),
            Supplier: purchaseData.supplier.supplierName,
            SubTotal: purchaseData.subTotal,
            DiscAmt: purchaseData.discAmt,
            GrandTotal: purchaseData.grandTotal,
            Remark: purchaseData.remark,
            CreatedAt: moment(purchaseData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: purchaseData.createdBy,
            UpdatedAt: moment(purchaseData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: purchaseData.updatedBy,
            Status: purchaseData.status,
        }
    });

    return(
        <>
        <div className="flex flex-col gap-4 relative max-w-[85%] min-w-[85%]">
            <div className="w-78 absolute top-0 right-0 z-[9999]">
                {
                    removeResult.isSuccess && isAlert && <SuccessAlert message="Delete successful." handleAlert={() => setIsAlert(false)} />
                }
            </div>
            <SectionTitle title="Purchase List" />
            <Card className="h-auto shadow-md max-w-screen-xxl rounded-sm p-2 border-t">
                <CardBody className="rounded-sm overflow-auto p-0">
                    <TableList columns={column} data={tbodyData} />
                </CardBody>
            </Card>
            <DeleteModal deleteId={deleteId} open={openDelete} handleDelete={handleRemove} closeModal={() => setOpenDelete(!openDelete)} />
        </div>

        </>
    );

}

export default PurchaseList;
