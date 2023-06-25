const formattedDate = () => {
  // Assuming you have a JavaScript Date object
  const date = new Date();

  // Extract the day, month, and year from the Date object
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  // Create the formatted date string in "dd/mm/yyyy" format
  return `${month}/${day}/${year}`;
};

export default formattedDate;
