export function sendPaginatedResponse(res, result, paginator) {
    const { rows, count } = result;
    res.status(200).json({
        items: rows,
        pagination: {
            totalItems: count,
            page: paginator.page,
            totalPages: Math.ceil( count / paginator.limit ),
            limit: paginator.limit
        },
    });
}