import { Input } from "@material-tailwind/react";
import DataTable from "react-data-table-component";
import { GoSearch } from "react-icons/go";
import ListLoader from "./customLoader";

function TableList(props) {

    const searchBox = <div className="w-60">
        <Input 
            placeholder="Search..." 
            icon={<GoSearch />}
            className="!border !border-gray-300"
            labelProps={{
                className: "hidden",
            }}
    
        />
    </div>;

    return (
        <>
            <style>
                {
                    `
                    [data-column-id="${props.columns.length}"] {
                        position: sticky;
                        right: 0;
                        background-color: #fff;
                    }
                    `
                }
            </style>
            <DataTable
                {...props}
                striped={true}
                subHeader
                subHeaderComponent={searchBox}
                subHeaderAlign="right"
                subHeaderWrap
                progressPending={props.pending}
			    progressComponent={<ListLoader />}
            />
        </>
    )

}

export default TableList;