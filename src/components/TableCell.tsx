interface props {
    text: any
}

const TableCell: React.FC<props> = ({text}) => {
    return(
        <div className="w-full h-full border-blue-200 border-b-2 border-r-2 flex items-center justify-center">{text}</div>
    )
}

export default TableCell
