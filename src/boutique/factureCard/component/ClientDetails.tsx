
export default function ClientDetails({clientName, clientAddress, clientCoordonne, invoiceNumber}: any) {
  return (
    <>
      <section className="mt-10">
        <h2 className="text-2xl uppercase font-bold mb-1">{clientName}</h2>
        <p>{clientAddress}</p>
        <p>{clientCoordonne}</p>
        <article className="flex items-start justify-start">
          <ul>
            <li className="p-1">
              <span className="font-bold">Tel: </span> {invoiceNumber}
            </li>
            {/* <li className="p-1 bg-gray-100">
              <span className="font-bold">date:</span>
            </li> */}
            {/* <li className="p-1 ">
              <span className="font-bold">Due date:</span> {dueDate}
            </li> */}
          </ul>
        </article>
      </section>
    </>
  )
}
