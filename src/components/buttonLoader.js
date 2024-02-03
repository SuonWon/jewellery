import { Grid } from "react-loader-spinner";

function ButtonLoader() {
    return (
        <Grid
        height="25"
        width="25"
        color="#333"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
    />
    );
}

export default ButtonLoader;