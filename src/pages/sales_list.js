/* eslint-disable eqeqeq */
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { FaPencil, FaPlus, FaTrashCan,} from "react-icons/fa6";
import { useState } from "react";
import { useRemoveStoneDetailsMutation, useFetchSalesQuery } from "../store";
import { pause } from "../const";
import DeleteModal from "../components/delete_modal";
import SuccessAlert from "../components/success_alert";
import moment from "moment";
import TableList from "../components/data_table";
import { Link, useNavigate } from "react-router-dom";

function SalesList() {

    const [openDelete, setOpenDelete] = useState(false);

    const navigate = useNavigate();

    const [isAlert, setIsAlert] = useState(true);

    const {data} = useFetchSalesQuery();

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

    const editSales = async (id) => {
        let editPuData = data.filter((e) => e.invoiceNo === id);
        console.log(editPuData);
        navigate(`/sales_edit/${editPuData}`);
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
            name: 'Customer',
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
                    {/* <Button variant="text" color="deep-purple" className="p-2" onClick={() => editSales(row.Code)}><FaPencil /></Button> */}
                    <Button variant="text" color="red" className="p-2" onClick={() => handleDeleteBtn(row.Code)}><FaTrashCan /></Button>
                </div>
            )
        },
    ];

    const tbodyData = data?.map((salesData) => {
        return {
            Code: salesData.invoiceNo,
            PurDate: moment(salesData.salesDate).format("YYYY-MM-DD"),
            Supplier: salesData.customer.customerName,
            SubTotal: salesData.subTotal.toLocaleString('en-US'),
            DiscAmt: salesData.discAmt.toLocaleString('en-US'),
            GrandTotal: salesData.grandTotal.toLocaleString('en-US'),
            Remark: salesData.remark,
            CreatedAt: moment(salesData.createdAt).format("YYYY-MM-DD hh:mm:ss a"),
            CreatedBy: salesData.createdBy,
            UpdatedAt: moment(salesData.updatedAt).format("YYYY-MM-DD hh:mm:ss a"),
            UpdatedBy: salesData.updatedBy,
            Status: salesData.status,
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
            <div className="flex items-center py-3 bg-white gap-4 sticky top-0 z-10">
                <Typography variant="h5">
                    Sales List
                </Typography>
                <Link to='/sales_invoice'>
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
        </div>

        </>
    );

}

export default SalesList;
