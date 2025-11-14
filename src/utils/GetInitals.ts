export function GetInitials(name: string) {
    if (!name || typeof name !== 'string') return '-';

    // Split by spaces and remove empty strings from multiple spaces
    const names = name.trim().split(' ').filter(n => n.length > 0);

    if (names.length < 1) return '-';

    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
}