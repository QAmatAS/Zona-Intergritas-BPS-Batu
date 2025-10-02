interface props {
    text: any
}

const TableCell: React.FC<props> = ({text}) => {
    return(
        <div className="w-full mb-2 h-full flex items-center justify-center">{text}</div>
    )
}

export default TableCell
