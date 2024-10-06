function jsTimestampToMysqlUTC(timestamp) {
    const date = new Date(timestamp); // Convert JS timestamp to Date object

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Return the formatted timestamp in MySQL UTC format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = { jsTimestampToMysqlUTC };