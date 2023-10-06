/* eslint-disable eqeqeq */
import { Button, Card, CardBody } from "@material-tailwind/react";
import { FaPencil, FaTrashCan,} from "react-icons/fa6";
import { useState } from "react";
import { pause } from "../const";
import { useFetchTruePurchaseQuery, useRemovePurchaseMutation } from "../store";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import SectionTitle from "../components/section_title";
import moment from "moment";
import TableList from "../components/data_table";
import { Link } from "react-router-dom";

function PurchaseList() {

    const [openDelete, setOpenDelete] = useState(false);

    const [isAlert, setIsAlert] = useState(true);

    const {data} = useFetchTruePurchaseQuery();

    const [removePurchase, removeResult] = useRemovePurchaseMutation();

    const [deleteId, setDeleteId] = useState('');

    const handleRemove = async (id) => {
        let removeData = data.filter((el) => el.invoiceNo === id);
        removePurchase({
            id: removeData[0].invoiceNo,
            deletedAt: moment().toISOString(),
            deletedBy: "Htet Wai Aung"
        }).then((res) => {console.log(res)});
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
                    <Link to={`/purchase_edit/${row.Code}`}>
                        <Button variant="text" color="deep-purple" className="p-2"><FaPencil /></Button>
                    </Link>
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
