export const ProductData = ({ label, quantity, unit }) => {
    return(
        <div className="list">
            <div className="items">
                <p>{ label }</p>
                <p>{ quantity.toFixed() } { unit }</p>
            </div>
        </div>
    )
}