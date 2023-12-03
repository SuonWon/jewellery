import { Triangle } from "react-loader-spinner";

function ButtonLoader() {
    return (
        <Triangle
            height="30"
            width="30"
            color="#fff"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
        />
    );
}

export default ButtonLoader;