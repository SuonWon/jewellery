import { Grid } from "react-loader-spinner";

function ButtonLoader({isNew = false}) {
    return (
        <Grid
        height="25"
        width="25"
        color={isNew? "#6e46b9" : "#fff"}
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
    />
    );
}

export default ButtonLoader;