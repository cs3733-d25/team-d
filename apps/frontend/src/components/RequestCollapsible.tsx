import { TableCell, TableRow } from "@/components/ui/table";

export default function LinksVisitors({linkId}: {linkId: string) {
    const visitors = [...] // these are the visitor objects based on the linkId

    return (
        <>
            {visitors ? (
                visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                        <TableCell>{visitor.name}</TableCell>
                        <TableCell>{visitor.totalDuration}</TableCell>
                        <TableCell>
                            //
                        </TableCell>
                    </TableRow>
                ))
            ) : null}
        </>
    );
}