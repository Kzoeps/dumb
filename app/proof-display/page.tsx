export default function ProofDisplay({params, searchParams}: any) {
    const mappedParams = Object.entries(searchParams).map(([key, value]) => {
        return { display: key, value }
    })
    console.log(mappedParams)
    return (
        <>
            <div>
                Here is the proof that you requested and its details are as follows
            </div>
            <ol>
                {mappedParams.map(({ display, value }: any) => (
                    <li key={value}>
                        <strong>{display}</strong>: {value}
                    </li>
                ))}
            </ol>

            </>
    )
}