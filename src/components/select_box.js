

function SelectBox(props) {

    return (
        <select {...props} className="block w-full p-2.5 border border-blue-gray-200 rounded-md  focus:border-black">
            <option value="" selected disabled>{props.selectedValue}</option>
            {
                props.optionData?.map((stone) => {
                    return <option value={stone.stoneCode} >{stone.stoneDesc}</option>
                })
            }
        </select>
    )

}

export default SelectBox;