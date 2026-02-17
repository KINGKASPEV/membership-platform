export function generateCSV<T extends Record<string, any>>(
    data: T[],
    headers: { key: keyof T; label: string }[]
): string {
    // Create header row
    const headerRow = headers.map((h) => escapeCSVField(h.label)).join(',');

    // Create data rows
    const dataRows = data.map((row) =>
        headers
            .map((h) => {
                const value = row[h.key];
                return escapeCSVField(String(value ?? ''));
            })
            .join(',')
    );

    return [headerRow, ...dataRows].join('\n');
}

export function escapeCSVField(field: string): string {
    // If field contains comma, newline, or quote, wrap in quotes and escape quotes
    if (field.includes(',') || field.includes('\n') || field.includes('"')) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
}

export function downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
