import { Grid, Triangle } from "react-loader-spinner";

function ListLoader() {
    return (
        <Grid
            height="50"
            width="50"
            color="#6e46b9"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
        />
    );
}

export default ListLoader;