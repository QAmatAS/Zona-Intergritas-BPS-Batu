interface props {
    text: any
}

const TableCell: React.FC<props> = ({text}) => {
    return(
        <div className="w-full h-full px-1 py-1 border-white border-b-2 border-r-2 flex items-center justify-center">{text}</div>
    )
}

export default TableCell
