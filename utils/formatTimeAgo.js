export function formatTimeAgo(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const diffInSeconds = Math.floor((now - messageTime) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
        return "just now";
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }
}