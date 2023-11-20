export function formatRelativeTime(timestamp) {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();
    const timeDifferenceInSeconds = Math.floor((currentDate - messageDate) / 1000);
  
    if (timeDifferenceInSeconds < 60) {
      return 'just now';
    } else if (timeDifferenceInSeconds < 3600) {
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 604800) {
      const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else {
      return messageDate.toLocaleDateString(); // Show the full date if more than a week ago
    }
  }